import json
import logging
import datetime

from flask import request

from .. import tasks
from ..application import db
from ..exceptions import *
from ..models import CopyJob, CloudConnection
from ..managers.auth_manager import token_required, get_logged_in_user


@token_required
def list(page_size=50, offset=0):
    owner = get_logged_in_user(request)

    copy_jobs = (CopyJob.query
        .filter_by(owner=owner)
        .order_by(CopyJob.id.desc())
        .limit(page_size)
        .all()
    )
    return copy_jobs


@token_required
def create(data):
    owner = get_logged_in_user(request)

    copy_job = CopyJob(**{
        'description': data.get('description', None),
        'src_cloud_id': data.get('src_cloud_id', None),
        'src_resource_path': data.get('src_resource_path', None),
        'dst_cloud_id': data.get('dst_cloud_id', None),
        'dst_resource_path': data.get('dst_resource_path', None),
        'copy_links': data.get('copy_links', None),
        'progress_current': 0,
        'progress_total': 100,
        'progress_state': "PROGRESS",
        'owner': owner
    })

    db.session.add(copy_job)
    db.session.commit()

    task_id = copy_job.id
    tasks.copy_job.apply_async(task_id=str(task_id), kwargs={
        'task_id': task_id,
    })

    return copy_job


@token_required
def retrieve(id):
    copy_job = CopyJob.query.get(id)

    if copy_job is None:
        raise HTTP_404_NOT_FOUND('Copy Job with id {} not found'.format(id))

    owner = get_logged_in_user(request)

    if copy_job.owner != owner:
        raise HTTP_404_NOT_FOUND('Copy Job with id {} not found'.format(id))

    try:
        task = tasks.copy_job.AsyncResult(str(copy_job.id))
        copy_job.progress_text = task.info.get('text', '')
        copy_job.progress_error_text = task.info.get('error_text', '')
    except Exception:
        pass # Sometimes rabbitmq closes the connection!

    return copy_job


@token_required
def stop(id):
    copy_job = retrieve(id)

    task = tasks.copy_job.AsyncResult(str(copy_job.id))
    task.revoke(terminate=True)

    copy_job = CopyJob.query.get(id) # Avoid race conditions
    if copy_job.progress_state == 'PROGRESS':
        copy_job.progress_state = 'STOPPED'
        db.session.commit()

    return copy_job
