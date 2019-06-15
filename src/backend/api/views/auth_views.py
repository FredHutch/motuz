from flask import request
from flask_restplus import Resource

from ..serializers import AuthSerializer
from ..managers import auth_manager
from ..managers.auth_manager import token_required
from ..exceptions import HTTP_EXCEPTION


api = AuthSerializer.api
dto = AuthSerializer.dto


@api.route('/login/')
class UserLogin(Resource):
    @api.expect(dto, validate=True)
    def post(self):
        """Login and retrieve JWT token"""
        post_data = request.json
        try:
            return auth_manager.login_user(data=post_data), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)



@api.route('/logout/')
class LogoutAPI(Resource):
    def post(self):
        """Logout and invalidate JWT token"""
        auth_header = request.headers.get('Authorization')
        try:
            return auth_manager.logout_user(data=auth_header), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
