from flask import request
from flask_restplus import Resource

from ..managers.auth_manager import token_required
from ..serializers import CloudConnectionSerializer
from ..managers import cloud_connection_manager


api = CloudConnectionSerializer.api
dto = CloudConnectionSerializer.dto


@api.route('/')
class ConnectionList(Resource):

    @api.marshal_list_with(dto)
    def get(self):
        """
        List all Connections
        """
        return cloud_connection_manager.list()


    @api.expect(dto, validate=True)
    @api.marshal_with(dto, code=201)
    def post(self):
        """
        Create a new Connection
        """
        data = request.json
        response = cloud_connection_manager.create(data=data)
        return response, 201



@api.route('/<id>')
@api.param('id', 'The Connection Identifier')
@api.response(404, 'Connection not found.')
class Connection(Resource):
    @api.marshal_with(dto, code=200)
    def get(self, id):
        """
        Get a specific Connection
        """
        result = cloud_connection_manager.retrieve(id)
        if not result:
            api.abort(404)
        else:
            return result

    @api.marshal_with(dto, code=200)
    def patch(self, id):
        """
        Edit a specific Connection
        """
        result = cloud_connection_manager.retrieve(id)
        if not result:
            api.abort(404)
        else:
            return result

    @api.marshal_with(dto, code=200)
    def delete(self, id):
        """
        Delete a specific Connection
        """
        result = cloud_connection_manager.retrieve(id)
        if not result:
            api.abort(404)
        else:
            return result

