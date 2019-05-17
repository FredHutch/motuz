import datetime
import os
from urllib.parse import urlparse
from os import path

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
    else:
        return {
            'error': 'Unknown scheme `{}`'.format(scheme)
        }, 400


def _get_local_files(url):
    result = []

    for resource in os.scandir(url):
        if resource.is_dir():
            type = "dir"
        elif resource.is_file():
            type = "file"
        elif resource.is_symlink():
            type = "symlink"


        result.append({
            "name": resource.name,
            "type": type,
        })

    return result
