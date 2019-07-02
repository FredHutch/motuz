from flask import request
from flask_restplus import Resource

from ..managers.auth_manager import token_required
from ..models import CloudConnectionSerializer
from ..managers import cloud_connection_manager
from ..exceptions import HTTP_EXCEPTION

api = CloudConnectionSerializer.api
dto = CloudConnectionSerializer.dto


@api.route('/')
class ConnectionList(Resource):

    @api.marshal_list_with(dto)
    def get(self):
        """
        List all Connections
        """
        try:
            return cloud_connection_manager.list(), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)


    @api.expect(dto, validate=True)
    @api.marshal_with(dto, code=201)
    def post(self):
        """
        Create a new Connection
        """
        data = request.json

        try:
            return cloud_connection_manager.create(data=data), 201
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)



@api.route('/<id>')
@api.param('id', 'The Connection Identifier')
@api.response(404, 'Connection not found.')
class Connection(Resource):

    @api.marshal_with(dto, code=200)
    def get(self, id):
        """
        Retrieve a specific Connection
        """
        try:
            return cloud_connection_manager.retrieve(id), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)


    @api.expect(dto, validate=True)
    @api.marshal_with(dto, code=200)
    def patch(self, id):
        """
        Update a specific Connection
        """
        data = request.json

        try:
            return cloud_connection_manager.update(id, data), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)


    @api.marshal_with(dto, code=200)
    def delete(self, id):
        """
        Delete a specific Connection
        """

        try:
            return cloud_connection_manager.delete(id), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)

