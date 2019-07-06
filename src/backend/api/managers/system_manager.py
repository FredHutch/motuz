import datetime
import json
import logging
import os
import pwd
import subprocess

from ..exceptions import *
from ..managers.auth_manager import token_required
from ..managers import cloud_connection_manager
from ..utils.rclone_connection import RcloneConnection


@token_required
def get_uid():
    uid = os.getuid()
    return {
        "uid": uid,
    }


@token_required
def ls(data):
    path = data['path']
    connection_id = data['connection_id']

    if connection_id == 0:
        return _get_local_files(path)

    cloud_connection = cloud_connection_manager.retrieve(connection_id)

    # If user does not have permission to the cloud_connection or if the cloud_connection
    # does not exist, the line above will raise the correct HTTP 4xx Exception

    return _get_remote_files(cloud_connection, path)


@token_required
def mkdir(data):
    path = data['path']
    connection_id = data['connection_id']

    if connection_id == 0:
        raise HTTP_400_BAD_REQUEST("Cannot create local folder")

    cloud_connection = cloud_connection_manager.retrieve(connection_id)

    # If user does not have permission to the cloud_connection or if the cloud_connection
    # does not exist, the line above will raise the correct HTTP 4xx Exception

    connection = RcloneConnection()
    return connection.mkdir(data=cloud_connection, path=path)


def _get_local_files(path):
    result = []

    try:
        resources = os.scandir(path)
    except FileNotFoundError:
        raise HTTP_400_BAD_REQUEST('Path not found on local disk {}'.format(path))

    except PermissionError:
        uid = os.getuid()
        raise HTTP_403_FORBIDDEN("User {user}({uid}) does not have privilege for path '{path}'".format(
            user=pwd.getpwuid(uid).pw_name,
            uid=uid,
            path=path,
        ))


    try:
        for resource in resources:
            if resource.is_dir():
                type = "dir"
            elif resource.is_file():
                type = "file"
            elif resource.is_symlink():
                type = "symlink"
            else:
                type = "unknown"

            size = -1
            try:
                size = resource.stat().st_size
            except Exception:
                pass # Cannot stat for some reason


            result.append({
                "name": resource.name,
                "type": type,
                "size": size,
            })
    except Exception as e:
        raise HTTP_400_BAD_REQUEST('Unknown Error {}'.format(e))

    return result


def _get_remote_files(cloud_connection, path):
    connection = RcloneConnection()
    try:
        return connection.ls(data=cloud_connection, path=path)
    except Exception as e:
        # TODO: be more granular about it
        raise HTTP_503_SERVICE_UNAVAILABLE(str(e))
