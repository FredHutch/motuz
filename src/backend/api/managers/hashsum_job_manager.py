import json
import logging
import datetime
import random

from flask import request

from .. import tasks
from ..application import db
from ..exceptions import *
from ..models import HashsumJob, CloudConnection
from ..managers.auth_manager import token_required, get_logged_in_user



@token_required
def list(page_size=50, offset=0):
    owner = get_logged_in_user(request)

    hashsum_jobs = (HashsumJob.query
        .filter_by(owner=owner)
        .order_by(HashsumJob.id.desc())
        .limit(page_size)
        .all()
    )
    return hashsum_jobs



# @token_required
def create(data):
    owner = "aicioara"
    # owner = get_logged_in_user(request)

    hashsum_job = HashsumJob(**{
        'cloud_id': data.get('cloud_id', None),
        'resource_path': data.get('resource_path', None),
        'progress_current': 0,
        'progress_total': 100,
        'progress_state': "PROGRESS",
        'owner': owner
    })

    db.session.add(hashsum_job)
    db.session.commit()

    task_id = hashsum_job.id
    tasks.hashsum_job.apply_async(task_id=str(task_id), kwargs={
        'task_id': task_id,
    })

    return hashsum_job


# @token_required
def retrieve(id):
    hashsum_job = HashsumJob.query.get(id)

    if hashsum_job is None:
        raise HTTP_404_NOT_FOUND('Hashsum Job with id {} not found'.format(id))

    # owner = get_logged_in_user(request)
    owner = "aicioara"

    if hashsum_job.owner != owner:
        raise HTTP_404_NOT_FOUND('Hashsum Job with id {} not found'.format(id))

    try:
        task = tasks.hashsum_job.AsyncResult(str(hashsum_job.id))
        hashsum_job.progress_text = task.info.get('text', '')
        hashsum_job.progress_error_text = task.info.get('error_text', '')
    except Exception:
        logging.error("Rabbitmq closed the connection. Failing silently")

    return hashsum_job


# @token_required
def stop(id):
    hashsum_job = retrieve(id)

    task = tasks.hashsum_job.AsyncResult(str(hashsum_job.id))
    task.revoke(terminate=True)

    hashsum_job = HashsumJob.query.get(id) # Avoid race conditions
    if hashsum_job.progress_state == 'PROGRESS':
        hashsum_job.progress_state = 'STOPPED'
        db.session.commit()

    return hashsum_job
