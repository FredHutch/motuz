from flask_restplus import Namespace, fields



class UserSerializer:
    api = Namespace('users', description='user related operations')
    dto = api.model('user', {
        'email': fields.String(required=True, description='User email address'),
        'username': fields.String(required=True, description='User username'),
        'password': fields.String(required=True, description='User password'),
        'public_id': fields.String(description='User ID'),
    })



class AuthSerializer:
    api = Namespace('auth', description='authentication related operations')
    dto = api.model('auth', {
        'email': fields.String(required=True, description='The email address'),
        'password': fields.String(required=True, description='The user password'),
    })


class CopyJobSerializer:
    api = Namespace('copy-jobs', description='CopyJob related operations')
    dto = api.model('copy-job', {
        'id': fields.Integer(),
        'start_time': fields.DateTime(),
        'finish_time': fields.DateTime(),
        'from_uri': fields.String(required=True),
        'to_uri': fields.String(required=True),
        'status': fields.String(),
        'progress': fields.Integer(),
    })


class ConnectionSerializer:
    api = Namespace('connections', description='Connection related operations')
    dto = api.model('connection', {
        'id': fields.Integer(),
        'service': fields.String(required=True),
        'username': fields.String(required=True),
        'password': fields.String(required=True),
    })


class SystemSerializer:
    api = Namespace('system', description='System related operations')
    dto = api.model('system', {
    })
