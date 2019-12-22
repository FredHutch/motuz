import logging
import random

from flask import request
from flask_restplus import Resource, Namespace, fields

from ..managers import copy_job_manager
from .. import tasks
from ..exceptions import HTTP_EXCEPTION



api = Namespace('copy-jobs', description='CopyJob related operations')

dto = api.model('copy-job', {
    'id': fields.Integer(readonly=True, example=1234),
    'description': fields.String(required=True, example='Task Description'),
    'src_cloud_id': fields.Integer(required=False, example=1),
    'src_resource_path': fields.String(required=True, example='/tmp'),
    'dst_cloud_id': fields.Integer(required=False, example=2),
    'dst_resource_path': fields.String(required=True, example='/trash'),
    'owner': fields.String(required=False, example='owner'),
    'copy_links': fields.Boolean(required=True, example=True),

    'progress_state': fields.String(readonly=True, example='PENDING'),
    'progress_text': fields.String(readonly=True, example='Multi\nLine\nText'),
    'progress_error_text': fields.String(readonly=True, example='Multi\nLine\nText'),
    'progress_current': fields.Integer(readonly=True, example=45),
    'progress_total': fields.Integer(readonly=True, example=100),
    'progress_error': fields.String(readonly=True),
    'progress_execution_time': fields.Integer(readonly=True, example=3600),
})


@api.route('/')
class CopyJobList(Resource):

    @api.marshal_list_with(dto)
    def get(self):
        """
        List all Copy Jobs
        """
        try:
            return copy_job_manager.list()
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))



    @api.expect(dto, validate=True)
    @api.marshal_with(dto, code=201)
    def post(self):
        """
        Create a new Copy Job
        """
        try:
            return copy_job_manager.create(request.json), 201
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))



@api.route('/<id>')
@api.param('id', 'The Copy Job Identifier')
@api.response(404, 'Copy Job not found.')
class CopyJob(Resource):

    @api.marshal_with(dto, code=200)
    def get(self, id):
        """
        Get a specific Copy Job
        """
        try:
            return copy_job_manager.retrieve(id), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))



@api.route('/<id>/stop/')
@api.param('id', 'The Copy Job Identifier')
@api.response(404, 'Copy Job not found.')
class CopyJob(Resource):

    @api.marshal_with(dto, code=202)
    def put(self, id):
        """
        Stop the Copy Job
        """
        try:
            return copy_job_manager.stop(id), 202
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))
