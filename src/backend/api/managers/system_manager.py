import datetime
import os
from urllib.parse import urlparse
from os import path
import pwd

def get_uid():
    uid = os.getuid()
    return {
        "uid": uid,
    }


def get_files(uri):
    parts = urlparse(uri)

    scheme = parts.scheme

    if scheme == 'file':
        url = parts.path
        return _get_local_files(url)
    elif scheme == '':
        return {
            'error': 'No scheme found for URI. Use `file:///` for local files',
        }, 400
    else:
        return {
            'error': 'Unknown scheme `{}`'.format(scheme),
        }, 400


def _get_local_files(url):
    result = []

    try:
        resources = os.scandir(url)
    except FileNotFoundError:
        return {
            'error': 'Path not found on local disk {}'.format(url)
        }, 400

    except PermissionError:
        uid = os.getuid()
        return {
            'error': "User {user}({uid}) does not have privilege for path '{path}'".format(
                user=pwd.getpwuid(uid).pw_name,
                uid=uid,
                path=url,
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
