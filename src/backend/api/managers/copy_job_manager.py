import logging

from flask import request

from .. import tasks
from ..application import db
from ..exceptions import *
from ..models import CopyJob
from ..managers.auth_manager import token_required, get_logged_in_user


@token_required
def list(page_size=50, page=1):
    owner = get_logged_in_user(request)
    try:
        query = (CopyJob.query
                 .filter_by(owner=owner)
                 .order_by(CopyJob.id.desc())
                 .paginate(page=page,
                           per_page=page_size,
                           error_out=False)
                 )
    except Exception as e:
        import envelopes
        import os
        server, port = os.environ.get('MOTUZ_SMTP_SERVER').split(':')
        if port:
            port = int(port)
        use_ssl = os.environ.get('MOTUZ_SMTP_REQUIRE_SSL', 'false').lower() == 'true'
        recipients = os.environ.get('MOTUZ_ALERT_ADDRESS', '').split(',')
        recipients = [x.strip() for x in recipients]
        envelope = envelopes.Envelope(
            from_addr=u'motuz-noreply@fredhutch.org',
            to_addr=recipients,
            subject=u'Motuz: Error listing copy jobs',
            body=str(e)
        )
        envelope.send(server, port,
                      login=os.getenv("MOTUZ_SMTP_USER"),
                      password=os.getenv("MOTUZ_SMTP_PASSWORD"), tls=use_ssl)
        logging.exception(e, exc_info=True)
        raise HTTP_500_INTERNAL_SERVER_ERROR(str(e))

    return {
        'data': query.items,
        'total': query.total,
        'page': query.page,
        'pages': query.pages
    }


@token_required
def create(data):
    owner = get_logged_in_user(request)

    copy_job = CopyJob(**{
        'description': data.get('description', None),
        'src_cloud_id': data.get('src_cloud_id', None),
        'src_resource_path': data.get('src_resource_path', None),
        'dst_cloud_id': data.get('dst_cloud_id', None),
        'dst_resource_path': data.get('dst_resource_path', None),

        'copy_links': data.get('copy_links', None),
        'notification_email': data.get('notification_email', None),

        'progress_current': 0,
        'progress_total': 100,
        'progress_state': "PROGRESS",
        'owner': owner
    })

    db.session.add(copy_job)
    db.session.commit()

    task_id = copy_job.id
    tasks.copy_job.apply_async(task_id=str(task_id), kwargs={
        'task_id': task_id,
    })

    return copy_job


@token_required
def retrieve(id):
    copy_job = CopyJob.query.get(id)

    if copy_job is None:
        raise HTTP_404_NOT_FOUND('Copy Job with id {} not found'.format(id))

    owner = get_logged_in_user(request)

    if copy_job.owner != owner:
        raise HTTP_404_NOT_FOUND('Copy Job with id {} not found'.format(id))

    for _ in range(2):  # Sometimes rabbitmq closes the connection!
        try:
            task = tasks.copy_job.AsyncResult(str(copy_job.id))
            copy_job.progress_text = task.info.get('text', '')
            copy_job.progress_error_text = task.info.get('error_text', '')
        except Exception:
            pass
    else:
        logging.error("Rabbitmq closed the connection. Failing silently")

    return copy_job


@token_required
def stop(id):
    copy_job = retrieve(id)

    task = tasks.copy_job.AsyncResult(str(copy_job.id))
    task.revoke(terminate=True)

    copy_job = CopyJob.query.get(id)  # Avoid race conditions
    if copy_job.progress_state == 'PROGRESS':
        copy_job.progress_state = 'STOPPED'
        db.session.commit()

    return copy_job
