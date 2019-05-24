import time
import random

import celery

@celery.task(name='motuz.api.tasks.my_sleep')
def my_sleep(message, seconds=1):
    time.sleep(seconds)
    print(message)
    return seconds


@celery.task(name='motuz.api.tasks.copy_job', bind=True)
def copy_job(self):
    for i in range(0, 101, 10):
        self.update_state(
            state="PROGRESS",
            meta={
                "current": i,
                "total": 100,
            },
        )
        time.sleep(random.randint(0, 10))
    return {
        "current": 100,
        "total": 100,
    }

