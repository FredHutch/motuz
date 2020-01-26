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
    tasks.check_job.apply_async(task_id=str(random_id), kwargs={
        'task_id': random_id,
        'owner': owner,
    })

    return {
        'id': random_id,
    }


@token_required
def retrieve(task_id):
    try:
        task = tasks.check_job.AsyncResult(str(task_id))
        return {
            'text': task.info.get('text', ''),
            'error_text': task.info.get('error_text', ''),
        }
    except Exception:
        return {
            "text": "TODO",
            "error_text": "FIXME",
        }


@token_required
def stop(id):
    check_job = retrieve(id)

    task = tasks.check_job.AsyncResult(str(check_job.id))
    task.revoke(terminate=True)

    check_job = CopyJob.query.get(id) # Avoid race conditions
    if check_job.progress_state == 'PROGRESS':
        check_job.progress_state = 'STOPPED'
        db.session.commit()

    return check_job
