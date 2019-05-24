from flask import request
from flask_restplus import Resource

from ..managers.auth_manager import token_required
from ..serializers import CopyJobSerializer
from ..managers import copy_job_manager
from ..tasks import my_sleep


api = CopyJobSerializer.api
dto = CopyJobSerializer.dto


"""
POST /api/jobs/$id/start CopyJobStart
POST /api/jobs/$id/pause CopyJobPause
GET  /api/jobs/$id CopyJobStatus
GET  /api/jobs CopyJobListAll (to display in the UI)
POST /api/jobs CopyJobSave (there should be no PATCH/PUT, jobs should be immutable)
CopyJobReSync - not sure what a resync is
"""

@api.route('/')
class CopyJobList(Resource):
    @api.marshal_list_with(dto)
    def get(self):
        """List all Copy Jobs"""
        return copy_job_manager.list()

    @api.response(201, 'User successfully created.')
    @api.expect(dto, validate=True)
    def post(self):
        """Create a new Copy Job"""
        data = request.json
        my_sleep.delay("Hello")
        return copy_job_manager.create(data=data)


@api.route('/<id>')
@api.param('id', 'The Copy Job Identifier')
@api.response(404, 'Copy Job not found.')
class CopyJob(Resource):
    @api.marshal_with(dto, code=200)
    def get(self, id):
        """Get a specific Copy Job"""
        result = copy_job_manager.retrieve(id)
        if not result:
            api.abort(404)
        else:
            return result


@api.route('/<id>/start')
@api.param('id', 'The Copy Job Identifier')
@api.response(404, 'Copy Job not found.')
class CopyJob(Resource):
    @api.marshal_with(dto, code=202)
    def put(self, id):
        """Start the Copy Job"""
        result = copy_job_manager.retrieve(id)
        if not result:
            api.abort(404)
        else:
            return result


@api.route('/<id>/pause')
@api.param('id', 'The Copy Job Identifier')
@api.response(404, 'Copy Job not found.')
class CopyJob(Resource):
    @api.marshal_with(dto, code=202)
    def put(self, id):
        """Pause the Copy Job"""
        result = copy_job_manager.retrieve(id)
        if not result:
            api.abort(404)
        else:
            return result
