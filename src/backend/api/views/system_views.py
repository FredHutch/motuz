from flask import request
from flask_restplus import Resource, Namespace, fields

from ..managers import system_manager
from ..managers.auth_manager import token_required
from ..exceptions import HTTP_EXCEPTION


api = Namespace('system', description='System related operations')


dto = api.model('system', {
    'type': fields.String(required=True, example='file'),
    'path': fields.String(required=True, example='/usr/bin/'),
    'region': fields.String(required=False, example='us-west-2'),
    'access_key_id': fields.String(required=False, example='KJRHJKHWEIUJDSJKDC2J'),
    'access_key_secret': fields.String(required=False, example='jksldASDLASdak+asdSDASDKjasldkjadASDAasd'),
    # access_key examples above have the correct length, but characters are made up
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
            return system_manager.get_files(data), 200
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
