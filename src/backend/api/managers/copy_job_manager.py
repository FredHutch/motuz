import json
import uuid
import datetime

from ..application import db
from ..models import CopyJob
from .. import tasks
from ..exceptions import *
from ..utils.alchemy_encoder import AlchemyEncoder


def list():
    jobs = CopyJob.query.all()

    result = []
    for job in jobs:
        task = tasks.copy_job.AsyncResult(str(job.id))
        result.append({
            "id": job.id,
            "progress": get_progress_info(task)
        })
    return result


def create(data):
    copy_job = CopyJob(
        # public_id=str(uuid.uuid4()),
        # email=data['email'],
        # username=data['username'],
        # password=data['password'],
        # registered_on=datetime.datetime.utcnow()
    )
    save_changes(copy_job)

    task = tasks.copy_job.apply_async(task_id=str(copy_job.id))
    progress_info = get_progress_info(task)

    return {
        "id": copy_job.id,
        "progress": progress_info,
    }



def retrieve(id):
    copy_job = CopyJob.query.get(id)

    if copy_job is None:
        raise HTTP_404_NOT_FOUND()


    task = tasks.copy_job.AsyncResult(id)
    progress_info = get_progress_info(task)

    return {
        "id": copy_job.id,
        "progress": progress_info,
    }


def save_changes(data):
    db.session.add(data)
    db.session.commit()


def get_progress_info(task):
    state = getattr(task, 'state', 'PENDING')

    if state == 'PENDING': # job did not start yet
        response = {
            'state': state,
            'current': 0,
            'total': 100,
        }
    elif state != 'FAILURE': # SUCCESS
        response = {
            'state': state,
            'current': task.info.get('current', 0),
            'total': task.info.get('total', 100),
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
