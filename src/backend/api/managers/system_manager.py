import datetime
import logging
import os
import pwd
from os import path
from urllib.parse import urlparse

from ..exceptions import *

def get_uid():
    uid = os.getuid()
    return {
        "uid": uid,
    }


def get_files(data):
    if data['type'] == 'file':
        return _get_local_files(data)
    elif data['type'] == 's3':
        return _get_rclone_files(data)
    else:
        raise HTTP_400_BAD_REQUEST('Unknown type `{}`'.format(data['type']))


def _get_local_files(path):
    path = data['path']

    result = []

    try:
        resources = os.scandir(path)
    except FileNotFoundError:
        return {
            'error': 'Path not found on local disk {}'.format(path)
        }, 400

    except PermissionError:
        uid = os.getuid()
        return {
            'error': "User {user}({uid}) does not have privilege for path '{path}'".format(
                user=pwd.getpwuid(uid).pw_name,
                uid=uid,
                path=path,
            )
        }, 403


    try:
        for resource in resources:
            if resource.is_dir():
                type = "dir"
            elif resource.is_file():
                type = "file"
            elif resource.is_symlink():
                type = "symlink"

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
        return {
            'error': 'Unknown Error {}'.format(e)
        }, 400

    return result


def _get_rclone_files(data):
    path = data['path']
    access_key_id = data.get('access_key_id', None)
    secret_access_key = data.get('secret_access_key', None)

    if access_key_id is None:
        raise HTTP_400_BAD_REQUEST('Missing access_key_id')

    if secret_access_key is None:
        raise HTTP_400_BAD_REQUEST('Missing secret_access_key')

    request = (
        'RCLONE_CONFIG_CURRENT_TYPE=s3 '
        'RCLONE_CONFIG_CURRENT_ACCESS_KEY_ID={access_key_id} '
        'RCLONE_CONFIG_CURRENT_SECRET_ACCESS_KEY={secret_access_key} '
        'rclone lsjson current:{path}'
    ).format(
        path=path,
        access_key_id=access_key_id,
        secret_access_key=secret_access_key,
    )

    print(request)
    return []
