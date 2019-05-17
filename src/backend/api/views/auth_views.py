from flask import request
from flask_restplus import Resource

from ..serializers import AuthSerializer
from ..managers import auth_manager
from ..managers.auth_manager import token_required


api = AuthSerializer.api
dto = AuthSerializer.dto


@api.route('/login')
class UserLogin(Resource):
    @api.expect(dto, validate=True)
    def post(self):
        """Login and retrieve JWT token"""
        post_data = request.json
        return auth_manager.login_user(data=post_data)



@api.route('/logout')
class LogoutAPI(Resource):
    def post(self):
        """Logout and invalidate JWT token"""
        auth_header = request.headers.get('Authorization')
        return auth_manager.logout_user(data=auth_header)