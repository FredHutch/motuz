import time

import celery

@celery.task(name='my_sleep')
def my_sleep(message, seconds=1):
    time.sleep(seconds)
    print(message)
    return seconds
