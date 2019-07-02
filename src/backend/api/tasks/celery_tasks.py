import time
import random
import functools
import logging
import re

from .. import celery
from ..models import CopyJob, CloudConnection
from ..application import db

from ..rclone.rclone_connection import RcloneConnection


@celery.task(name='motuz.api.tasks.copy_job', bind=True)
def copy_job(self, task_id=None):
    copy_job = CopyJob.query.get(task_id)
    copy_job.progress_state = 'PROGRESS'
    db.session.commit()

    src_cloud_id = copy_job.src_cloud_id
    dst_cloud_id = copy_job.dst_cloud_id

    if src_cloud_id is None and dst_cloud_id is None:
        copy_job.progress_state = 'FAILED'
        copy_job.progress_current = 100
        copy_job.progress_total = 100
        db.session.commit()

        text = "Local copies not supported"
        logging.warning(text)
        return {
            'text': text
        }


    if src_cloud_id is not None and dst_cloud_id is not None:
        copy_job.progress_state = 'FAILED'
        copy_job.progress_current = 100
        copy_job.progress_total = 100
        db.session.commit()

        text = "Remote-only copies not supported"
        logging.warning(text)
        return {
            'text': text
        }

    if src_cloud_id is not None:
        cloud_connection = copy_job.src_cloud

    if dst_cloud_id is not None:
        cloud_connection = copy_job.dst_cloud


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
        progress_current = connection.copy_percent(task_id)
        copy_job.progress_current = progress_current
        db.session.commit()

        self.update_state(state='PROGRESS', meta={
            'text': connection.copy_text(task_id)
        })

        time.sleep(1)


    copy_job.progress_current = 100
    copy_job.progress_state = 'FINISHED'
    db.session.commit()

    return {
        'text': connection.copy_text(task_id),
    }
