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



class CopyJobSerializer:
    api = Namespace('copy-jobs', description='CopyJob related operations')
    dto = api.model('copy-job', {
        'id': fields.Integer(readonly=True),
        'description': fields.String(required=True),
        'src_cloud': fields.String(required=True),
        'src_resource': fields.String(required=True),
        'dst_cloud': fields.String(required=True),
        'dst_path': fields.String(required=True),
        'owner': fields.String(required=True),
        'progress': fields.Nested(api.model('copy-job-progress', {
            'state': fields.String(),
            'current': fields.Integer(),
            'total': fields.Integer(),
            'status': fields.String(),
            'error': fields.String(),
        }), readonly=True),
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
        'uri': fields.String(required=True),
    })
