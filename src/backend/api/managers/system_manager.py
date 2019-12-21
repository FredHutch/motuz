import datetime
import json
import logging
import os
import re
import pwd
import subprocess

from flask import request

from ..exceptions import *
from ..managers.auth_manager import token_required, get_logged_in_user
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


# no token_required
def get_info():
    rclone_version = (subprocess
        .check_output("rclone --version", shell=True)
        .decode('utf-8')
        .strip()
        .replace('\n', ' | ')
        .replace('- ', '')
    )

    return {
        "status": "healthy",
        "date": str(datetime.datetime.now()),
        "rclone_version": rclone_version,
    }



@token_required
def ls(data):
    user = get_logged_in_user(request)
    path = data['path']
    connection_id = data['connection_id']

    if connection_id == 0:
        cloud_connection = Dummy()
        cloud_connection.owner = user
        connection = LocalConnection()
    else:
        cloud_connection = cloud_connection_manager.retrieve(connection_id)
        if cloud_connection.owner != user:
            # Should never happen
            raise HTTP_404_NOT_FOUND('Cloud Connection with id {} not found'.format(connection_id))

        connection = RcloneConnection()

    try:
        return connection.ls(data=cloud_connection, path=path)
    except RcloneException as e:
        raise HTTP_400_BAD_REQUEST(str(e))


@token_required
def lshome():
    user = get_logged_in_user(request)

    cloud_connection = Dummy()
    cloud_connection.owner = user
    connection = LocalConnection()

    try:
        return connection.lshome(data=cloud_connection)
    except RcloneException as e:
        raise HTTP_400_BAD_REQUEST(str(e))



@token_required
def mkdir(data):
    user = get_logged_in_user(request)
    path = data['path']
    connection_id = data['connection_id']

    if connection_id == 0:
        cloud_connection = Dummy()
        cloud_connection.owner = user
        connection = LocalConnection()
    else:
        cloud_connection = cloud_connection_manager.retrieve(connection_id)
        if cloud_connection.owner != user:
            # Should never happen
            raise HTTP_404_NOT_FOUND('Cloud Connection with id {} not found'.format(connection_id))

        connection = RcloneConnection()

    try:
        return connection.mkdir(data=cloud_connection, path=path)
    except RcloneException as e:
        raise HTTP_400_BAD_REQUEST(str(e))



class Dummy:
    pass
