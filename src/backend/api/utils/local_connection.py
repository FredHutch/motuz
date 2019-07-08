import logging
import os
import re
import subprocess

from ..exceptions import *
from .abstract_connection import AbstractConnection, RcloneException



class LocalConnection(AbstractConnection):
    """
    A symmetric API for RcloneConnection to be used locally
    """

    def __init__(self):
        pass


    def ls(self, data, path):
        """
        New way of doing it
        """
        user = data.owner

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


    def mkdir(self, data, path):
        pass



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
    """
    @deprecated
    """
    import pwd

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