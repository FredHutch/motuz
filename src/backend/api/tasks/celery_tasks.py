import time
import random
import logging

from .. import celery
from ..models import CopyJob
from ..application import db



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
