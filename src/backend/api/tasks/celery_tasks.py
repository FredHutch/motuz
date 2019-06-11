import time
import random
import logging

from .. import celery
from ..application import db



@celery.task(name='motuz.api.tasks.my_sleep')
def my_sleep(message, seconds=1):
    time.sleep(seconds)
    print(message)
    return seconds


@celery.task(name='motuz.api.tasks.copy_job', bind=True)
def copy_job(self, task_id=None):
    # copy_job = CopyJob.query.get(task_id)

    for i in range(0, 101, 1):
        # copy_job.progress_state = 'PENDING'
        # copy_job.progress_current = i
        # copy_job.progress_total = 100
        # db.session.commit()

        self.update_state(
            state="PROGRESS",
            meta={
                "current": i,
                "total": 100,
            },
        )
        time.sleep(random.randint(0, 3) / 10)

    # copy_job.progress_state = 'SUCCESS'
    # copy_job.progress_current = 100
    # copy_job.progress_total = 100
    # db.session.commit()

    return {
        "current": 100,
        "total": 100,
    }

