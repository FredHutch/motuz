import logging
import random

from flask import request
from flask_restplus import Resource

from ..models import CopyJobSerializer
from ..managers import copy_job_manager
from .. import tasks
from ..exceptions import HTTP_EXCEPTION



api = CopyJobSerializer.api
dto = CopyJobSerializer.dto



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


    @api.expect(dto, validate=True)
    @api.marshal_with(dto, code=201)
    def post(self):
        """
        Create a new Copy Job
        """
        data = request.json
        try:
            return copy_job_manager.create(data), 201
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)



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
