import json
import uuid
import datetime

from ..application import db
from ..models import CopyJob
from .. import tasks
from ..exceptions import *



def list():
    copy_jobs = CopyJob.query.all()

    for copy_job in copy_jobs:
        task = tasks.copy_job.AsyncResult(str(copy_job.id))
        setattr(copy_job, 'progress', _get_progress(task))

    return copy_jobs



def create(data):
    # TODO: validate that this data does not have additional fields
    copy_job = CopyJob(**data)
    _save_changes(copy_job)

    tasks.copy_job.apply_async(task_id=str(copy_job.id))
    task = tasks.copy_job.AsyncResult(str(copy_job.id))
    setattr(copy_job, 'progress', _get_progress(task))

    return copy_job



def retrieve(id):
    copy_job = CopyJob.query.get(id)

    if copy_job is None:
        raise HTTP_404_NOT_FOUND()


    task = tasks.copy_job.AsyncResult(id)

    progress_info = _get_progress(task)
    setattr(copy_job, 'progress', progress_info)

    return copy_job



def _save_changes(data):
    db.session.add(data)
    db.session.commit()



def _get_progress(task):
    _e = None
    for _ in range(3):
        try:
            return __get_progress(task)
        except Exception as e:
            _e = e
            continue
    else:
        raise e

def __get_progress(task):
    state = getattr(task, 'state', 'PENDING')

    if state == 'PENDING': # job did not start yet
        response = {
            'state': state,
            'current': 100,
            'total': 100,
        }
    elif state == 'PROGRESS':
        response = {
            'state': state,
            'current': task.info and task.info.get('current', 0),
            'total': task.info and task.info.get('total', 100),
        }
    elif state == 'SUCCESS': # SUCCESS
        response = {
            'state': state,
            'current': task.info and task.info.get('current', 0),
            'total': task.info and task.info.get('total', 100),
        }
        if 'result' in task.info:
            response['result'] = task.info['result']
        if 'status' in task.info:
            response['status'] = task.info.get('status', '')
    else: # something went wrong in the background job
        response = {
            'state': state,
            'current': 100,
            'total': 100,
            'error': str(task.info),  # this is the exception raised
        }

    return response
