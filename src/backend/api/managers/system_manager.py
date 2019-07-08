import datetime
import json
import logging
import os
import re
import pwd
import subprocess

# TODO: For testing purposes, this file should not take flask as an import
# Move this requirement 1 level up, inside the view
from flask import request

from ..exceptions import *
from ..managers.auth_manager import token_required
from ..managers import cloud_connection_manager
from ..managers.auth_manager import get_logged_in_user
from ..utils.rclone_connection import RcloneConnection, RcloneException


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
    user = get_logged_in_user(request)

    if connection_id == 0:
        return _get_local_files(path, user)

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

    try:
        connection = RcloneConnection()
        return connection.mkdir(data=cloud_connection, path=path)
    except RcloneException as e:
        raise HTTP_400_BAD_REQUEST(str(e))



def _get_local_files(path, user):
    """
    New way of doing it
    """

    try:
        output = _ls_with_impersonation(path, user)
    except subprocess.CalledProcessError as err:
        raise HTTP_403_FORBIDDEN("User {user} does not have privilege for path '{path}'".format(
            user=user,
            path=path,
        ))
    except Exception as err:
        raise HTTP_403_FORBIDDEN(str(err))

    files = _parse_ls(output)
    return files


def _parse_ls(output):
    """
    Each line looks like
    drwxr-xr-x      12      ubuntu  staff    384    Jul     6    15:42    ./
    permissions | position | user | group | size | month | day | time | filename
        0       |    1     |   2  |   3   |   4  |   5   |  6  |  7   |   8
    """

    regex = r'^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)'
    #            0       1       2       3       4       5       6       7       8

    result = []
    for line in output.split('\n'):
        match = re.search(regex, line)
        if match is None:
            logging.error("Could not parse line `{}`".format(line))
            continue

        groups = match.groups()
        permissions = groups[0]
        size = groups[4]
        filename = groups[8]

        if permissions[0] == 'l':
            type = "symlink"
        elif permissions[0] == 'd':
            type = "dir"
        elif permissions[0] == '-':
            type = "file"
        else:
            type = "unknown"

        if type == 'symlink':
            filename = filename.split('->')[0].strip()

        result.append({
            "name": filename,
            "type": type,
            "size": size,
        })

    return result



def _ls_with_impersonation(path, user):
    command = [
        'sudo',
        '-n',
        '-u', user,
        'ls',
        '-al',
        path,
    ]

    byteOutput = subprocess.check_output(command)
    output = byteOutput.decode('UTF-8').rstrip()
    return output



def _get_local_files_pythonic(path):
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
