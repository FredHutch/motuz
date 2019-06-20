import time
import random
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

    copy_job.progress_current = 100
    copy_job.progress_state = 'FINISHED'
    db.session.commit()


    return {}

