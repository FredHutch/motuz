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

    def ls(self, data, path):
        user = data.owner

        try:
            output = _ls_with_impersonation(path, user)
        except subprocess.CalledProcessError as err:
            logging.exception(err)
            raise HTTP_403_FORBIDDEN("User {user} does not have privilege for path '{path}'".format(
                user=user,
                path=path,
            ))
        except Exception as err:
            logging.exception(err)
            raise HTTP_403_FORBIDDEN(str(err))

        files = _parse_ls(output)
        return {
            'files': files,
            'path': path,
        }


    def lshome(self, data):
        user = data.owner

        try:
            homePath = _homepath_with_impersonation(user)
            return self.ls(data, homePath)
        except Exception as e:
            logging.error("User does not have a home", exc_info=True)
            return self.ls(data, '/')


    def mkdir(self, data, path):
        user = data.owner

        try:
            output = _mkdir_with_impersonation(path, user)
        except subprocess.CalledProcessError as err:
            raise HTTP_403_FORBIDDEN("User {user} does not have privilege for path '{path}'".format(
                user=user,
                path=path,
            ))
        except Exception as err:
            raise HTTP_403_FORBIDDEN(str(err))

        return {
            'message': 'success',
        }



def _homepath_with_impersonation(user):
    command = [
        'sudo',
        '-n',
        '-u', user,
        '-i', 'eval',
        'echo $HOME'
    ]

    byteOutput = subprocess.check_output(command)
    output = byteOutput.decode('UTF-8').rstrip()
    return output


def _parse_ls(output):
    """
    Each line looks like one of the following

    drwxr-xr-x      12      ubuntu  staff    384    Jul     6    15:42    ./
    permissions | position | user | group | size | month | day | time | filename
        0       |    1     |   2  |   3   |   4  |   5   |  6  |  7   |   8

    drwxr-xr-x      12      ubuntu  staff    384    Jul     6    2018    ./
    permissions | position | user | group | size | month | day | year | filename
        0       |    1     |   2  |   3   |   4  |   5   |  6  |  7   |   8

    l?????????       ?           ?     ?       ?                    ?   shared",
    permissions | position | user | group | size | month   day   year | filename
        0       |    1     |   2  |   3   |   4  |   5   |  6  |  7   |   8
    """

    # Case 1 and 2
    regex1 = r'^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)'
    #             0       1       2       3       4       5       6       7       8

    # Case 3
    regex2 = r'^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\s)(\s)(\S+)\s+(.+)'
    #             0       1       2       3       4       5   6   7       8

    regexes = (regex1, regex2,)

    result = []
    for line in output.split('\n'):
        if line.startswith("total"):
            continue

        for regex in regexes:
            match = re.search(regex, line)
            if match is not None:
                break
        else:
            logging.error("Could not parse line `{}`".format(line))
            continue

        groups = match.groups()
        permissions = groups[0]
        size = groups[4]
        filename = groups[8]

        if filename == '.' or filename == '..':
            continue

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
        '-alL',
        path,
    ]

    try:
        byteOutput = subprocess.check_output(command)
        output = byteOutput.decode('UTF-8').rstrip()
        return output
    except subprocess.CalledProcessError as err:
        # Sometimes `ls -alL` errors out when it cannot dereference symlinks, but it
        # still returns some results on stdout. We should display those cases
        try:
            output = err.stdout.decode('UTF-8').rstrip()
            if len(output) == 0:
                raise
            return output
        except:
            raise


def _mkdir_with_impersonation(path, user):
    command = [
        'sudo',
        '-n',
        '-u', user,
        'mkdir',
        '-p',
        path,
    ]

    byteOutput = subprocess.check_output(command)
    output = byteOutput.decode('UTF-8').rstrip()
    return output
