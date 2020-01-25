import logging

from flask import request
from flask_restplus import Resource, Namespace, fields

from ..managers.auth_manager import token_required
from ..managers import cloud_connection_manager
from ..exceptions import HTTP_EXCEPTION

class OptionalString(fields.String):
    __schema_type__ = ['string', 'null']
    __schema_example__ = 'nullable string'


class PrivateString(fields.String):
    def format(self, value):
        return None


class PrivateOptionalString(OptionalString, PrivateString):
    pass


api = Namespace('connections', description='Connection related operations')

dto = api.model('connection', {
    'id': fields.Integer(readonly=True, example=1),
    'name': fields.String(required=True, example='arbitrary-unique-name'),

    'type': fields.String(required=True, example='s3'),
    'bucket': OptionalString(required=False, example='my-bucket-name'),

    's3_access_key_id': fields.String(required=False, example='KJRHJKHWEIUJDSJKDC2J'),
    's3_secret_access_key': PrivateString(required=False, example='jksldASDLASdak+asdSDASDKjasldkjadASDAasd'),
    's3_region': OptionalString(required=False, example='us-west-2'),

    's3_endpoint': OptionalString(required=False, example='https://hello.swiftstack.com'),
    's3_v2_auth': fields.String(required=False, example='true'),

    'azure_account': fields.String(required=False, example='my_azure_account'),
    'azure_key': PrivateString(required=False, example='qe21euoidjlkadj283u2398rudy8d87adh3dasdkahsd23ey239eaduhawd812e1uidhwdkjdh2es_asdASDAS=='),
    'azure_sas_url': PrivateString(required=False, example='https://yourstorage.blob.core.windows.net/?sig=hSjdsakwrhasweqweaijdopvbxiudoSOIDAdsduoiqwejsad'),

    'swift_user': fields.String(required=False, example='swift_username'),
    'swift_key': PrivateString(required=False, example='asd*aqeaSDASDASDlkas.u'),
    'swift_auth': fields.String(required=False, example='https://hello.swiftstack.com/auth/v2.0'),
    'swift_tenant': OptionalString(required=False, example='AUTH_swift_tennant'),

    'gcp_client_id': fields.String(required=False, example='141849123123812938127'),
    'gcp_service_account_credentials': PrivateString(required=False, example='{"type": "service_account", "project_id": "myID1233s", "private_key_id": "123012312ea12390d09123aa12390dda1309123a", "private_key": "-----BEGIN PRIVATE KEY-----\nA_PASTE_OF_YOUR_KEY\n-----END PRIVATE KEY-----\n", "client_email": "hello@email.com", "client_id": "141849123123812938127", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/sa-datamover%40datamover.iam.gserviceaccount.com"}'),
    'gcp_project_number': fields.String(required=False, example='199432342343'),
    'gcp_object_acl': fields.String(required=False, example='authenticatedRead'),
    'gcp_bucket_acl': fields.String(required=False, example='authenticatedRead'),

    'sftp_host': fields.String(required=False, example='localhost'),
    'sftp_port': fields.String(required=False, example='22'),
    'sftp_user': fields.String(required=False, example='username'),
    'sftp_pass': PrivateOptionalString(required=False, example='p@ssw0rd'),
    'sftp_key_file': OptionalString(required=False, example='/path/to/key.pem'),

    'dropbox_token': PrivateString(required=False, example='{"access_token":"hStGBm-oRDsqJksiRspOnbsDiu","token_type":"bearer","expiry":"0001-01-01T00:00:00Z"}'),

    'onedrive_token': PrivateString(required=False, example='{"access_token":"youraccesstoken","token_type":"Bearer","refresh_token":"yourrefreshtoken","expiry":"2018-08-26T22:39:52.486512262+08:00"}'),
    'onedrive_drive_id': fields.String(required=False, example='b!Eqwertyuiopasdfghjklzxcvbnm-7mnbvcxzlkjhgfdsapoiuytrewqk'),
    'onedrive_drive_type': fields.String(required=False, example='business'),

    'webdav_url': fields.String(required=False, example='https://example.com/remote.php/webdav/'),
    'webdav_user': fields.String(required=False, example='email@example.com'),
    'webdav_pass': PrivateString(required=False, example='p@ssw0rd'),

    # examples above have the correct length, but characters are made up
})


@api.route('/')
class ConnectionList(Resource):

    @api.marshal_list_with(dto)
    def get(self):
        """
        List all Connections
        """
        try:
            return cloud_connection_manager.list(), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))


    @api.expect(dto, validate=True)
    @api.marshal_with(dto, code=201)
    def post(self):
        """
        Create a new Connection
        """
        try:
            return cloud_connection_manager.create(request.json), 201
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))



@api.route('/verify/')
class ConnectionVerify(Resource):
    @api.expect(dto, validate=True)
    def post(self):
        """
        Verify credentials for a connection
        """
        try:
            return cloud_connection_manager.verify(request.json), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))



@api.route('/<id>')
@api.param('id', 'The Connection Identifier')
@api.response(404, 'Connection not found.')
class Connection(Resource):

    @api.marshal_with(dto, code=200)
    def get(self, id):
        """
        Retrieve a specific Connection
        """
        try:
            return cloud_connection_manager.retrieve(id), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))


    @api.expect(dto, validate=True)
    @api.marshal_with(dto, code=200)
    def patch(self, id):
        """
        Update a specific Connection
        """
        try:
            return cloud_connection_manager.update(id, request.json), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))


    @api.marshal_with(dto, code=200)
    def delete(self, id):
        """
        Delete a specific Connection
        """
        try:
            return cloud_connection_manager.delete(id), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))
