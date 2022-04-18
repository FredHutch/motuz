import functools
import logging
from os import path as os_path
import re
import time
import json

from .. import celery
from ..models import CopyJob, HashsumJob, CloudConnection
from ..application import db

from ..utils.rclone_connection import RcloneConnection
from ..utils.email_utils import Email
from ..utils.file_utils import generate_file_tree, remove_identical_branches


@celery.task(name='motuz.api.tasks.copy_job', bind=True)
def copy_job(self, task_id=None):
    try:
        start_time = time.time()

        copy_job = CopyJob.query.get(task_id)
        copy_job.progress_state = 'PROGRESS'
        db.session.commit()

        connection = RcloneConnection()
        connection.copy(
            src_data=copy_job.src_cloud,
            src_resource_path=copy_job.src_resource_path,
            dst_data=copy_job.dst_cloud,
            dst_resource_path=copy_job.dst_resource_path,
            user=copy_job.owner,
            copy_links=copy_job.copy_links,
            job_id=task_id,
        )

        while not connection.copy_finished(task_id):
            progress_current = connection.copy_percent(task_id)
            copy_job.progress_current = progress_current
            copy_job.progress_execution_time = int(time.time() - start_time)
            db.session.commit()

            self.update_state(state='PROGRESS', meta={
                'text': connection.copy_text(task_id),
                'error_text': connection.copy_error_text(task_id)
            })

            time.sleep(1)


        exitstatus = connection.copy_exitstatus(task_id)
        if exitstatus == -1:
            logging.error("Copy Job did not set its status")
            copy_job.progress_state = 'UNSET'
        elif exitstatus == 0:
            copy_job.progress_state = 'SUCCESS'
        else:
            copy_job.progress_state = 'FAILED'


        copy_job.progress_current = 100
        copy_job.progress_execution_time = int(time.time() - start_time)
        db.session.commit()

        Email.send_notification(
            to=copy_job.notification_email,
            subject=f'Motuz Copy Job with ID {task_id} COMPLETED successfully!'
        )

        return {
            'text': connection.copy_text(task_id),
            'error_text': connection.copy_error_text(task_id)
        }
    except Exception as e:
        logging.exception(e)

        try:
            copy_job.progress_current = 100
            copy_job.progress_state = 'FAILED'
        except:
            pass

        try:
            copy_job.progress_execution_time = int(time.time() - start_time)
        except:
            pass

        try:
            db.session.commit()
        except:
            pass

        try:
            Email.send_notification(
                to=copy_job.notification_email,
                subject=f'Motuz Copy Job with ID {task_id} FAILED!'
            )
        except:
            pass

        return {
            'text': '',
            'error_text': str(e),
        }


@celery.task(name='motuz.api.tasks.hashsum_job', bind=True)
def hashsum_job(self, task_id):
    """
    @return : dict {
        "progress_src_tree",
        "progress_src_error_text",
        "progress_dst_tree",
        "progress_dst_error_text",
    }
    """
    try:
        start_time = time.time()

        hashsum_job = HashsumJob.query.get(task_id)
        hashsum_job.progress_state = 'PROGRESS'
        db.session.commit()

        result_src = _hashsum_job_single(self, hashsum_job, side='src', start_time=start_time)
        if not result_src["success"]:
            hashsum_job.progress_execution_time = int(time.time() - start_time)
            db.session.commit()
            return result_src["payload"]

        result_dst = _hashsum_job_single(self, hashsum_job, side='dst', start_time=start_time)
        if not result_dst["success"]:
            hashsum_job.progress_execution_time = int(time.time() - start_time)
            db.session.commit()
            return result_dst["payload"]


        progress_src_tree = result_src["payload"].get("progress_src_tree", [])
        progress_dst_tree = result_dst["payload"].get("progress_dst_tree", [])
        progress_src_error = result_src["payload"].get("progress_src_error", None)
        progress_dst_error = result_dst["payload"].get("progress_dst_error", None)

        progress_src_tree, progress_dst_tree = remove_identical_branches(progress_src_tree, progress_dst_tree)

        self.update_state(state='PROGRESS', meta={}) # Clearing rabbitmq

        hashsum_job.progress_state = 'SUCCESS'
        hashsum_job.progress_current = 100
        hashsum_job.progress_execution_time = int(time.time() - start_time)
        hashsum_job.progress_src_error = progress_src_error
        hashsum_job.progress_dst_error = progress_dst_error

        try:
            hashsum_job.progress_src_tree = json.dumps(progress_src_tree)
        except Exception as e:
            logging.error("Could not save progress_src_tree to DB")
            logging.exception(e)

        try:
            hashsum_job.progress_dst_tree = json.dumps(progress_dst_tree)
        except Exception as e:
            logging.error("Could not save progress_src_tree to DB")
            logging.exception(e)

        db.session.commit()

        if len(progress_src_tree) == 0 and len(progress_dst_tree) == 0:
            integrity_outcome_message = "Files are IDENTICAL!"
        else:
            integrity_outcome_message = "Files are DIFFERENT!"

        Email.send_notification(
            to=hashsum_job.notification_email,
            subject=f'Motuz Integrity Check Job with ID {task_id} completed! {integrity_outcome_message}'
        )

        return {}

    except Exception as e:
        logging.exception(e)

        try:
            hashsum_job.progress_current = 100
            hashsum_job.progress_state = 'FAILED'
        except:
            pass

        try:
            hashsum_job.progress_execution_time = int(time.time() - start_time)
        except:
            pass

        try:
            db.session.commit()
        except:
            pass

        try:
            Email.send_notification(
                to=hashsum_job.notification_email,
                subject=f'Motuz Integrity Check Job with ID {task_id} FAILED!'
            )
        except:
            pass

        return {
            'error_text': str(e),
        }


def _hashsum_job_single(self, hashsum_job, *, start_time, side):
    """
    @param hashsum_job: HashsumJob
    @param side: string - 'src' or 'dst'
    @param start_time: int

    @return: dict {
        "success",
        "payload",
    }
    """
    if side not in ("src", "dst"):
        raise ValueError("_hashsum_job_single side should be either 'src' or 'dst'")

    rclone_connection_id = f"{hashsum_job.id}_{side}"
    connection = RcloneConnection()

    def get_hashsum_tree():
        # Using closure to capture all parameters
        files = connection.hashsum_text(rclone_connection_id)
        tree = generate_file_tree(files)
        return tree

    result = connection.md5sum(
        data=getattr(hashsum_job, f'{side}_cloud'),
        resource_path=getattr(hashsum_job, f'{side}_resource_path'),
        user=hashsum_job.owner,
        job_id=rclone_connection_id,
        download=hashsum_job.option_download,
    )

    while not connection.hashsum_finished(rclone_connection_id):
        progress_current = connection.hashsum_percent(rclone_connection_id)
        hashsum_job.progress_current = int(
            progress_current * 0.5 + (0.5 if side == 'dst' else 0)
        )
        hashsum_job.progress_execution_time = int(time.time() - start_time)
        db.session.commit()

        self.update_state(state='PROGRESS', meta={
            f'progress_{side}_tree': get_hashsum_tree(),
            f'progress_{side}_error_text': connection.hashsum_error_text(rclone_connection_id)
        })

        time.sleep(1)

    result = {}

    exitstatus = connection.hashsum_exitstatus(rclone_connection_id)
    if exitstatus == -1:
        logging.error("Hashsum Job did not set its status")

        hashsum_job.progress_state = 'UNSET'
        hashsum_job.progress_current = 100
        result = {
            "success": False,
            "payload": {
                f'progress_{side}_tree': get_hashsum_tree(),
                f'progress_{side}_error_text': connection.hashsum_error_text(rclone_connection_id)
            },
        }
    elif exitstatus != 0:
        hashsum_job.progress_state = 'FAILED'
        hashsum_job.progress_current = 100
        result = {
            "success": False,
            "payload": {
                f'progress_{side}_tree': get_hashsum_tree(),
                f'progress_{side}_error_text': connection.hashsum_error_text(rclone_connection_id)
            },
        }
    else:
        result = {
            "success": True,
            "payload": {
                f'progress_{side}_tree': get_hashsum_tree(),
                f'progress_{side}_error_text': connection.hashsum_error_text(rclone_connection_id)
            }
        }

    connection.hashsum_delete(rclone_connection_id)
    return result
