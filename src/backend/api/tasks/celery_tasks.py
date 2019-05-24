import time

import celery

@celery.task(name='motuz.api.tasks.my_sleep')
def my_sleep(message, seconds=1):
    time.sleep(seconds)
    print(message)
    return seconds


@celery.task(name='motuz.api.tasks.copy_job', bind=True)
def copy_job(self):
    pass