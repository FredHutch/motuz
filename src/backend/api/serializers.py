from flask_restplus import Namespace, fields



class UserSerializer:
    api = Namespace('users', description='User related operations')
    dto = api.model('user', {
        'email': fields.String(required=True, description='User email address'),
        'username': fields.String(required=True, description='User username'),
        'password': fields.String(required=True, description='User password'),
        'public_id': fields.String(description='User ID'),
    })



class AuthSerializer:
    api = Namespace('auth', description='Authentication related operations')
    dto = api.model('auth', {
        'email': fields.String(required=True, description='The email address'),
        'password': fields.String(required=True, description='The user password'),
    })



class CloudConnectionSerializer:
    api = Namespace('connections', description='Connection related operations')
    dto = api.model('connection', {
        'id': fields.Integer(readonly=True, example=1),
        'type': fields.String(required=True, example='S3'),
        'name': fields.String(required=True, example='arbitrary-unique-name'),
        'bucket': fields.String(required=True, example='my-bucket-name'),
        'region': fields.String(required=True, example='us-west-2'),
        'access_key_id': fields.String(required=True, example='KJRHJKHWEIUJDSJKDC2J'),
        'access_key_secret': fields.String(required=True, example='jksldASDLASdak+asdSDASDKjasldkjadASDAasd'),
        # access_key examples above have the correct length, but characters are made up
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
