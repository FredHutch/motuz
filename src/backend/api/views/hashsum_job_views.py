import logging
import random

from flask import request
from flask_restplus import Resource, Namespace, fields

from ..managers import hashsum_job_manager
from .. import tasks
from ..exceptions import HTTP_EXCEPTION



api = Namespace('hashsum-jobs', description='CheckJob related operations')

progress_test = {

}

hashsum_job_output = api.model('hashsum-job-output', {
    'Name': fields.String(readonly=True),
    'md5chksum': fields.String(readonly=True),
})

dto = api.model('hashsum-job', {
    'id': fields.String(readonly=True, example='a6cac16a63d05672555c884d38b8a3'),
    'cloud_id': fields.Integer(required=False, example=1),
    'resource_path': fields.String(required=True, example='/tmp'),

    'progress_state': fields.String(readonly=True, example='PENDING'),
    'progress_text': fields.List(fields.Nested(hashsum_job_output), readonly=True),
    'progress_error_text': fields.String(readonly=True, example='Multi\nLine\nText'),
    'progress_error': fields.String(readonly=True),
    'progress_execution_time': fields.Integer(readonly=True, example=3600),
})


@api.route('/')
class HashsumJobList(Resource):

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
            import pdb; pdb.set_trace();
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
