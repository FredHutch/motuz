import json
import uuid
import datetime

from .. import tasks
from ..application import db
from ..exceptions import *
from ..models import CopyJob, CloudConnection
from ..rclone.rclone_connection import RcloneConnection


def list():
    copy_jobs = CopyJob.query.all()

    return copy_jobs


def create(data):
    # TODO: validate that this data does not have additional fields
    copy_job = CopyJob(**data)
    copy_job.progress_state = 'PROGRESS'
    copy_job.progress_current = 0
    copy_job.progress_total = 100

    db.session.add(copy_job)
    db.session.commit()

    task_id = copy_job.id
    tasks.copy_job.apply_async(task_id=str(task_id), kwargs={
        'task_id': task_id,
    })

    return copy_job


def retrieve(id):
    copy_job = CopyJob.query.get(id)

    if copy_job is None:
        raise HTTP_404_NOT_FOUND('Copy Job with id {} not found'.format(id))

    return copy_job


def stop(id):
    copy_job = CopyJob.query.get(id)

    if copy_job is None:
        raise HTTP_404_NOT_FOUND('Copy Job with id {} not found'.format(id))

    task = tasks.copy_job.AsyncResult(str(copy_job.id))
    task.revoke(terminate=True)

    copy_job = CopyJob.query.get(id) # Avoid race conditions
    copy_job.progress_state = 'STOPPED'
    db.session.commit()

    return copy_job
