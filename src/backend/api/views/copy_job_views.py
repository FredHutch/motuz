import logging
import random

from flask import request
from flask_restplus import Resource

from ..models import CopyJobSerializer
from ..managers import copy_job_manager
from .. import tasks
from ..exceptions import *



api = CopyJobSerializer.api
dto = CopyJobSerializer.dto



@api.route('/')
class CopyJobList(Resource):

    @api.marshal_list_with(dto)
    def get(self):
        """
        List all Copy Jobs
        """
        response = copy_job_manager.list()
        return response, 200


    @api.expect(dto, validate=True)
    @api.marshal_with(dto, code=201)
    def post(self):
        """
        Create a new Copy Job
        """
        data = request.json
        response = copy_job_manager.create(data)
        return response, 201



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
            response = copy_job_manager.retrieve(id)
        except HTTP_404_NOT_FOUND as e:
            return {
                "detail": "CopyJob {} not found".format(id),
            }, e.code

        return response, 200



@api.route('/<id>/start')
@api.param('id', 'The Copy Job Identifier')
@api.response(404, 'Copy Job not found.')
class CopyJob(Resource):

    @api.marshal_with(dto, code=202)
    def put(self, id):
        """
        Start the Copy Job
        """
        try:
            response = copy_job_manager.retrieve(id)
        except HTTP_404_NOT_FOUND as e:
            return {
                "detail": "CopyJob {} not found".format(id),
            }, e.code

        return response, 202



@api.route('/<id>/pause')
@api.param('id', 'The Copy Job Identifier')
@api.response(404, 'Copy Job not found.')
class CopyJob(Resource):

    @api.marshal_with(dto, code=202)
    def put(self, id):
        """
        Pause the Copy Job
        """
        try:
            response = copy_job_manager.retrieve(id)
        except HTTP_404_NOT_FOUND as e:
            return {
                "detail": "CopyJob {} not found".format(id),
            }, e.code

        return response, 202
