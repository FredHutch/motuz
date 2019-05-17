from flask import request
from flask_restplus import Resource

from ..serializers import SystemSerializer
from ..managers import system_manager
from ..managers.auth_manager import token_required


api = SystemSerializer.api
dto = SystemSerializer.dto

"""
GET /api/uid UidGet (this might go under GET /api/users/$id, but not sure yet)

GET /api/files DirList
"""



@api.route('/files')
@api.param('uri', 'URI where to read files tree from')
class SystemFiles(Resource):
    def get(self, uri):
        """List all files available to the user for a particular URI"""
        return system_manager.get_files()



@api.route('/uid')
class SystemUid(Resource):
    def get(self):
        """Get the `uid` of the currently logged in user"""
        return system_manager.get_uid()
