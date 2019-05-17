from flask import request
from flask_restplus import Resource

from ..serializers import UserSerializer
from ..managers import user_manager
from ..managers.auth_manager import token_required


api = UserSerializer.api
dto = UserSerializer.dto


@api.route('/')
class UserList(Resource):
    @api.marshal_list_with(dto, envelope='data')
    def get(self):
        """List all registered Users"""
        return user_manager.get_all_users()

    @api.response(201, 'User successfully created.')
    @api.expect(dto, validate=True)
    def post(self):
        """Creates a new User """
        data = request.json
        return user_manager.save_new_user(data=data)


@api.route('/<public_id>')
@api.param('public_id', 'The User identifier')
@api.response(404, 'User not found.')
class User(Resource):
    @api.marshal_with(dto, code=200)
    def get(self, public_id):
        """Get a specific user"""
        user = user_manager.get_a_user(public_id)
        if not user:
            api.abort(404)
        else:
            return user
