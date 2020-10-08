import logging
import random

from flask import request
from flask_restplus import Resource, Namespace, fields

from ..managers import hashsum_job_manager
from .. import tasks
from ..exceptions import HTTP_EXCEPTION


api = Namespace('hashsum-jobs', description='CheckJob related operations')

dto = api.model('hashsum-job', {
    'id': fields.String(readonly=True, example='a6cac16a63d05672555c884d38b8a3'),
    'src_cloud_id': fields.Integer(required=False, example=1),
    'src_resource_path': fields.String(required=True, example='/tmp'),
    'dst_cloud_id': fields.Integer(required=False, example=2),
    'dst_resource_path': fields.String(required=True, example='/temp'),

    'option_download': fields.Boolean(required=True, example=True),
    'notification_email': fields.String(required=False, example='hello@example.com'),

    'progress_state': fields.String(readonly=True, example='PENDING'),
    'progress_current': fields.Integer(readonly=True, example=45),
    'progress_total': fields.Integer(readonly=True, example=100),
    'progress_execution_time': fields.Integer(readonly=True, example=3600),
    'progress_error': fields.String(readonly=True),

    'progress_src_tree': fields.String(readonly=True, example='[{title, children}]'),
    'progress_dst_tree': fields.String(readonly=True, example='[{title, children}]'),

    # Rabbitmq fields
    'progress_src_error_text': fields.String(readonly=True, example='Multi\nLine\nText'),
    'progress_dst_error_text': fields.String(readonly=True, example='Multi\nLine\nText'),
})


@api.route('/')
class HashsumJobList(Resource):

    @api.marshal_list_with(dto)
    def get(self):
        """
        List all Check Jobs
        """
        try:
            return hashsum_job_manager.list()
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))


    @api.expect(dto, validate=True)
    @api.marshal_with(dto, code=201)
    def post(self):
        """
        Create a new Check Job
        """
        try:
            return hashsum_job_manager.create(request.json), 201
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))



@api.route('/<id>')
@api.param('id', 'The Check Job Identifier')
@api.response(404, 'Check Job not found.')
class HashsumJob(Resource):

    @api.marshal_with(dto, code=200)
    def get(self, id):
        """
        Get a specific Check Job
        """
        try:
            return hashsum_job_manager.retrieve(id), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))



@api.route('/<id>/stop/')
@api.param('id', 'The Check Job Identifier')
@api.response(404, 'Check Job not found.')
class HashsumJob(Resource):

    @api.marshal_with(dto, code=202)
    def put(self, id):
        """
        Stop the Check Job
        """
        try:
            return hashsum_job_manager.stop(id), 202
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))
