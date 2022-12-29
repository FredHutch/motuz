import logging
import time

from ..application import db
from ..models import CopyJob
from ..utils.rclone_connection import RcloneConnection



def submit_to_cluster(command, credentials):
    """
    - generate command script - copy it to head node 
    - lock down permissions on it
    - submit it to the cluster
    - remove script file from head node (or maybe it removes itself)
    cat t | ssh -i docker/secrets/MOTUZ_SSH_KEY root@rhino01 "cat - > /tmp/soko"
    """
    pass

# class HPCCopyJobSubmitter(object):
#     def __init__(self, copy_job):
#         self.copy_job = copy_job

#     def submit_copy_job(self, src_path, dst_path):
#         self.hpc_manager.submit_copy_job(src_path, dst_path)
#         return True


def submit_copy_job(copy_job):
    """
    Code cribbed from celery_tasks.py
    """
    logging.debug("in submit_copy_job()")
    start_time = time.time()

    copy_job.progress_state = 'PROGRESS'
    db.session.commit()

    connection = RcloneConnection()
    command, credentials = connection.copy(
        src_data=copy_job.src_cloud,
        src_resource_path=copy_job.src_resource_path,
        dst_data=copy_job.dst_cloud,
        dst_resource_path=copy_job.dst_resource_path,
        user=copy_job.owner,
        copy_links=copy_job.copy_links,
        job_id=copy_job.id,
    )

    hpc_job_id = submit_to_cluster(command, credentials)
    # update db record with hpc job id
    # handle it if user is not onboarded to cluster


