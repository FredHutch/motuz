import logging

from flask import request
from flask_restplus import Resource, Namespace, fields

from ..managers import auth_manager
from ..managers.auth_manager import token_required
from ..exceptions import HTTP_EXCEPTION


api = Namespace('auth', description='Authentication related operations')

dto = api.model('auth', {
    'username': fields.String(required=True, description='The (Linux) username'),
    'password': fields.String(required=True, description='The user password'),
})


@api.route('/login/')
class UserLogin(Resource):
    @api.expect(dto, validate=True)
    def post(self):
        """Login and retrieve JWT token"""
        try:
            return auth_manager.login_user(request.json), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))


@api.route('/refresh/')
class TokenRefresh(Resource):
    def post(self):
        """Use JWT refresh token to retrienve a new JWT access token"""
        try:
            return auth_manager.refresh_token(), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))



@api.route('/logout/')
class LogoutAPI(Resource):
    def post(self):
        """Logout and invalidate JWT token"""
        try:
            return auth_manager.logout_user(), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))
