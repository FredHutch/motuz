import logging

from flask import request
from flask_restplus import Resource, Namespace, fields

from ..managers import system_manager
from ..exceptions import HTTP_EXCEPTION


api = Namespace('system', description='System related operations')


dto = api.model('system', {
    'connection_id': fields.Integer(required=True, example=2),
    'path': fields.String(required=True, example='/usr/bin/'),
})


@api.route('/files/')
class SystemFiles(Resource):
    @api.expect(dto, validate=True)
    def post(self):
        """
        List all files for a particular URI.
        """
        try:
            return system_manager.ls(request.json), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))


@api.route('/files/home/')
class SystemFilesHome(Resource):
    def post(self):
        """
        List all files for local home
        """
        try:
            return system_manager.lshome(), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))


@api.route('/files/mkdir/')
class SystemFilesMkdir(Resource):
    @api.expect(dto, validate=True)
    def post(self):
        """
        Crete a new directory at a particular URI.
        """
        try:
            return system_manager.mkdir(request.json), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))



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
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))


@api.route('/info/')
class SystemUid(Resource):
    def get(self):
        """
        Get information about current system
        """
        try:
            return system_manager.get_info(), 200
        except HTTP_EXCEPTION as e:
            api.abort(e.code, e.payload)
        except Exception as e:
            logging.exception(e, exc_info=True)
            api.abort(500, str(e))
