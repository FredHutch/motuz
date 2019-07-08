import datetime
import json
import logging
import os
import re
import pwd
import subprocess

from ..exceptions import *
from ..managers.auth_manager import token_required
from ..managers import cloud_connection_manager
from ..utils.rclone_connection import RcloneConnection
from ..utils.local_connection import LocalConnection
from ..utils.abstract_connection import RcloneException


@token_required
def get_uid():
    uid = os.getuid()
    return {
        "uid": uid,
    }


@token_required
def ls(data, user):
    path = data['path']
    connection_id = data['connection_id']

    if connection_id == 0:
        data = Dummy()
        data.owner = user
        connection = LocalConnection()
        return connection.ls(data, path)

    cloud_connection = cloud_connection_manager.retrieve(connection_id)
    if cloud_connection.owner != user:
        # Should never happen
        raise HTTP_404_NOT_FOUND('Cloud Connection with id {} not found'.format(connection_id))

    connection = RcloneConnection()
    return connection.ls(data=cloud_connection, path=path)


@token_required
def mkdir(data, user):
    path = data['path']
    connection_id = data['connection_id']

    if connection_id == 0:
        raise HTTP_400_BAD_REQUEST("Cannot create local folder")

    cloud_connection = cloud_connection_manager.retrieve(connection_id)
    if cloud_connection.owner != user:
        # Should never happen
        raise HTTP_404_NOT_FOUND('Cloud Connection with id {} not found'.format(connection_id))

    try:
        connection = RcloneConnection()
        return connection.mkdir(data=cloud_connection, path=path)
    except RcloneException as e:
        raise HTTP_400_BAD_REQUEST(str(e))


class Dummy:
    pass
