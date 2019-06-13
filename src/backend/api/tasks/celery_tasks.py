import time
import random
import logging
import re

from .. import celery
from ..models import CopyJob, CloudConnection
from ..application import db

from ..rclone.rclone_connection import RcloneConnection


@celery.task(name='motuz.api.tasks.my_sleep')
def my_sleep(message, seconds=1):
    time.sleep(seconds)
    print(message)
    return seconds


@celery.task(name='motuz.api.tasks.copy_job', bind=True)
def copy_job(self, task_id=None):
    copy_job = CopyJob.query.get(task_id)
    copy_job.progress_state = 'PROGRESS'
    db.session.commit()

    # TODO: make the correct relationship
    cloud_connections = CloudConnection.query.all()
    if len(cloud_connections) == 0:
        copy_job.progress_state = 'FINISHED'
        copy_job.progress_current = 100
        copy_job.progress_total = 100
        return {}

    cloud_connection = cloud_connections[0]

    connection = RcloneConnection(
        type=cloud_connection.type,
        region=cloud_connection.region,
        access_key_id=cloud_connection.access_key_id,
        secret_access_key=cloud_connection.access_key_secret,
    )

    connection.copy(
        src=copy_job.src_resource,
        dst=copy_job.dst_path,
        job_id=task_id,
    )

    while not connection.copy_finished(task_id):
        status = connection.copy_status(task_id)
        logging.info(status)
        progress_match = re.search(r'(\d*)%', status)
        if progress_match is not None:
            copy_job.progress_current = int(progress_match.group(1))
            db.session.commit()
        time.sleep(1)

    return {}


@celery.task(name='motuz.api.tasks.dummy_copy_job', bind=True)
def dummy_copy_job(self, task_id=None):
    copy_job = CopyJob.query.get(task_id)
    copy_job.progress_state = 'PROGRESS'
    db.session.commit()

    for i in range(0, 101, 1):
        copy_job.progress_current = i
        copy_job.progress_total = 100
        db.session.commit()

        self.update_state(
            state="PROGRESS",
            meta={
                "current": i,
                "total": 100,
            },
        )
        time.sleep(random.randint(0, 3) / 10)

    copy_job.progress_state = 'SUCCESS'
    copy_job.progress_current = 100
    copy_job.progress_total = 100
    db.session.commit()

    return {
        "current": 100,
        "total": 100,
    }



# TODO: remove the items below

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
