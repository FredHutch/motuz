import json
import logging
import datetime
import random

from flask import request

from .. import tasks
from ..application import db
from ..exceptions import *
from ..models import CopyJob, CloudConnection
from ..managers.auth_manager import token_required, get_logged_in_user


# @token_required
def create(data):
    owner = "aicioara"
    # owner = get_logged_in_user(request)

    random_id = '%030x' % random.randrange(16**30)
    tasks.md5sum_job.apply_async(task_id=str(random_id), kwargs={
        'task_id': random_id,
        'owner': owner,
        'data': data,
    })

    return {
        'id': random_id,
    }


# @token_required
def retrieve(task_id):
    try:
        task = tasks.md5sum_job.AsyncResult(str(task_id))
        return {
            'progress_text': task.info.get('text', ''),
            'progress_error_text': task.info.get('error_text', ''),
        }
    except Exception as e:
        return {
            'progress_error_text': str(e),
        }


@token_required
def stop(id):
    md5sum_job = retrieve(id)

    task = tasks.md5sum_job.AsyncResult(str(md5sum_job.id))
    task.revoke(terminate=True)

    md5sum_job = CopyJob.query.get(id) # Avoid race conditions
    if md5sum_job.progress_state == 'PROGRESS':
        md5sum_job.progress_state = 'STOPPED'
        db.session.commit()

    return md5sum_job
