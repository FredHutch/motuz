import datetime
import json
import logging
import os
import pwd
import subprocess

from ..exceptions import *

def get_uid():
    uid = os.getuid()
    return {
        "uid": uid,
    }


def get_files(data):
    if data['type'] in ('file', 'localhost'):
        return _get_local_files(data)
    elif data['type'] == 's3':
        return _get_rclone_files(data)
    else:
        raise HTTP_400_BAD_REQUEST('Unknown type `{}`'.format(data['type']))


def _get_local_files(data):
    path = data['path']

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


def _get_rclone_files(data):
    path = data['path']
    region = data.get('region', None)
    access_key_id = data.get('access_key_id', None)
    access_key_secret = data.get('access_key_secret', None)

    if region is None:
        raise HTTP_400_BAD_REQUEST('Missing region')

    if access_key_id is None:
        raise HTTP_400_BAD_REQUEST('Missing access_key_id')

    if access_key_secret is None:
        raise HTTP_400_BAD_REQUEST('Missing access_key_secret')


    command = (
        'RCLONE_CONFIG_CURRENT_TYPE=s3 '
        'RCLONE_CONFIG_CURRENT_REGION={region} '
        'RCLONE_CONFIG_CURRENT_ACCESS_KEY_ID={access_key_id} '
        'RCLONE_CONFIG_CURRENT_SECRET_ACCESS_KEY={access_key_secret} '
        'rclone lsjson current:{path}'
    ).format(
        path=path,
        region=region,
        access_key_id=access_key_id,
        access_key_secret=access_key_secret,
    )

    try:
        byteOutput = subprocess.check_output(command, shell=True)
        output = byteOutput.decode('UTF-8').rstrip()
        result = json.loads(output)
        return result
    except subprocess.CalledProcessError as e:
        logging.error("Error in rclone", e.output)
        return []
