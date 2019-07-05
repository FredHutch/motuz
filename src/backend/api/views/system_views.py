from flask import request
from flask_restplus import Resource, Namespace, fields

from ..managers import system_manager
from ..managers.auth_manager import token_required
from ..exceptions import HTTP_EXCEPTION


api = Namespace('system', description='System related operations')


dto = api.model('system', {
    'connection_id': fields.Integer(required=True, example='2'),
    'path': fields.String(required=True, example='/usr/bin/'),
})


@api.route('/files/')
class SystemFiles(Resource):
    @api.expect(dto, validate=True)
    def post(self):
        """
        List all files for a particular URI.
        """
        data = request.json
        try:
            return system_manager.ls(data), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)


@api.route('/files/mkdir/')
class SystemFiles(Resource):
    @api.expect(dto, validate=True)
    def post(self):
        """
        List all files for a particular URI.
        """
        data = request.json
        try:
            return system_manager.mkdir(data), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)



@api.route('/uid/')
class SystemUid(Resource):
    def get(self):
        """
        Get the `uid` of the currently logged in user.
        """
        try:
            return system_manager.get_uid(), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
