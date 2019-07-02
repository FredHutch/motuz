from flask_restplus import Namespace, fields


class AuthSerializer:
    api = Namespace('auth', description='Authentication related operations')
    dto = api.model('auth', {
        'username': fields.String(required=True, description='The (Linux) username'),
        'password': fields.String(required=True, description='The user password'),
    })



class SystemSerializer:
    api = Namespace('system', description='System related operations')
    dto = api.model('system', {
        'type': fields.String(required=True, example='file'),
        'path': fields.String(required=True, example='/usr/bin/'),
        'region': fields.String(required=False, example='us-west-2'),
        'access_key_id': fields.String(required=False, example='KJRHJKHWEIUJDSJKDC2J'),
        'access_key_secret': fields.String(required=False, example='jksldASDLASdak+asdSDASDKjasldkjadASDAasd'),
        # access_key examples above have the correct length, but characters are made up
    })
