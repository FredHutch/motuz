from collections import defaultdict
import functools
import json
import logging
import re
import subprocess
import threading
import time
import os

from .abstract_connection import AbstractConnection, RcloneException
from .hashsum_job_queue import HashsumJobQueue
from .copy_job_queue import CopyJobQueue

class RcloneConnection(AbstractConnection):
    def __init__(self):
        self._hashsum_job_queue = HashsumJobQueue()
        self._copy_job_queue = CopyJobQueue()

        self._job_status = defaultdict(functools.partial(defaultdict, str)) # Mapping from id to status dict

        self._job_text = defaultdict(str)
        self._job_error_text = defaultdict(str)
        self._job_percent = defaultdict(int)
        self._job_exitstatus = {}

        self._stop_events = {} # Mapping from id to threading.Event
        self._latest_job_id = 0


    def verify(self, data):
        credentials = self._formatCredentials(data, name='current')
        user = data.owner
        bucket = getattr(data, 'bucket', None)
        if bucket is None:
            bucket = ''

        command = [
            'sudo',
            '-E',
            '-u', user,
            '/usr/local/bin/rclone',
            '--config=/dev/null',
            'lsjson',
            'current:{}'.format(bucket),
        ]

        self._logCommand(command, credentials)

        try:
            result = self._execute(command, credentials)
            return {
                'result': True,
                'message': 'Success',
            }
        except subprocess.CalledProcessError as e:
            returncode = e.returncode
            return {
                'result': False,
                'message': 'Exit status {}'.format(returncode),
            }



    def ls(self, data, path):
        credentials = self._formatCredentials(data, name='current')
        user = data.owner
        command = [
            'sudo',
            '-E',
            '-u', user,
            '/usr/local/bin/rclone',
            '--config=/dev/null',
            'lsjson',
            'current:{}'.format(path),
        ]

        self._logCommand(command, credentials)

        try:
            result = self._execute(command, credentials)
            files = json.loads(result)
            return {
                'files': files,
                'path': path,
            }
        except subprocess.CalledProcessError as e:
            raise RcloneException(sanitize(str(e)))



    def mkdir(self, data, path):
        credentials = self._formatCredentials(data, name='current')
        user = data.owner
        command = [
            'sudo',
            '-E',
            '-u', user,
            '/usr/local/bin/rclone',
            '--config=/dev/null',
            'touch',
            'current:{}/.motuz_keep'.format(path),
        ]

        self._logCommand(command, credentials)

        try:
            result = self._execute(command, credentials)
            return {
                'message': 'Success',
            }
        except subprocess.CalledProcessError as e:
            raise RcloneException(sanitize(str(e)))



    def copy(self,
            src_data,
            src_resource_path,
            dst_data,
            dst_resource_path,
            user,
            copy_links,
            job_id
    ):
        credentials = {}
        option_exclude_dot_snapshot = '' # HACKHACK: remove once https://github.com/rclone/rclone/issues/2425 is addressed

        if src_data is None: # Local
            src = src_resource_path
            if os.path.isdir(src):
                option_exclude_dot_snapshot = '--exclude=\\.snapshot/'
        else:
            credentials.update(self._formatCredentials(src_data, name='src'))
            src = 'src:{}'.format(src_resource_path)

        if dst_data is None: # Local
            dst = dst_resource_path
        else:
            credentials.update(self._formatCredentials(dst_data, name='dst'))
            dst = 'dst:{}'.format(dst_resource_path)

        if copy_links:
            option_copy_links = '--copy-links'
        else:
            option_copy_links = ''

        command = [
            'sudo',
            '-E',
            '-u', user,
            '/usr/local/bin/rclone',
            '--config=/dev/null',
            option_exclude_dot_snapshot,
            'copyto',
            src,
            dst,
            option_copy_links,
            '--progress',
            '--stats', '2s',
        ]

        command = [cmd for cmd in command if len(cmd) > 0]

        self._logCommand(command, credentials)

        try:
            self._copy_job_queue.push(command, credentials, job_id)
        except RcloneException as e:
            raise RcloneException(sanitize(str(e)))

        return job_id


    def copy_text(self, job_id):
        return self._copy_job_queue.copy_text(job_id)

    def copy_error_text(self, job_id):
        return self._copy_job_queue.copy_error_text(job_id)

    def copy_percent(self, job_id):
        return self._copy_job_queue.copy_percent(job_id)

    def copy_stop(self, job_id):
        self._copy_job_queue.copy_stop(job_id)

    def copy_finished(self, job_id):
        return self._copy_job_queue.copy_finished(job_id)

    def copy_exitstatus(self, job_id):
        return self._copy_job_queue.copy_exitstatus(job_id)


    def md5sum(self,
            data,
            resource_path,
            user,
            job_id,
            download=False,
    ):
        credentials = {}
        option_exclude_dot_snapshot = '' # HACKHACK: remove once https://github.com/rclone/rclone/issues/2425 is addressed

        if data is None: # Local
            src = resource_path
            download = False
            if os.path.isdir(src):
                option_exclude_dot_snapshot = '--exclude=\\.snapshot/'
        else:
            credentials.update(self._formatCredentials(data, name='src'))
            src = 'src:{}'.format(resource_path)

        command = [
            'sudo',
            '-E',
            '-u', user,
            '/usr/local/bin/rclone',
            '--config=/dev/null',
            'md5sum',
            src,
            option_exclude_dot_snapshot,
        ]

        command = [cmd for cmd in command if len(cmd) > 0]

        self._logCommand(command, credentials)

        try:
            self._hashsum_job_queue.push(command, credentials, job_id, download)
        except RcloneException as e:
            raise RcloneException(sanitize(str(e)))

        return job_id


    def hashsum_text(self, job_id):
        return self._hashsum_job_queue.hashsum_text(job_id)

    def hashsum_error_text(self, job_id):
        return self._hashsum_job_queue.hashsum_error_text(job_id)

    def hashsum_percent(self, job_id):
        return self._hashsum_job_queue.hashsum_percent(job_id)

    def hashsum_stop(self, job_id):
        self._hashsum_job_queue.hashsum_stop(job_id)

    def hashsum_finished(self, job_id):
        return self._hashsum_job_queue.hashsum_finished(job_id)

    def hashsum_exitstatus(self, job_id):
        return self._hashsum_job_queue.hashsum_exitstatus(job_id)

    def hashsum_delete(self, job_id):
        return self._hashsum_job_queue.hashsum_delete(job_id)


    def _logCommand(self, command, credentials):
        bash_command = "{} {}".format(
            ' '.join("{}='{}'".format(key, value) for key, value in sanitize_credentials(credentials).items()),
            ' '.join(command),
        )
        logging.info(sanitize(bash_command))


    def _formatCredentials(self, data, name):
        """
        Credentials are of the form
        RCLONE_CONFIG_CURRENT_TYPE=s3
            ^          ^        ^   ^
        [mandatory  ][name  ][key][value]
        """

        prefix = "RCLONE_CONFIG_{}".format(name.upper())

        credentials = {}
        credentials['{}_TYPE'.format(prefix)] = data.type

        def _addCredential(env_key, data_key, *, value_functor=None):
            value = getattr(data, data_key, None)
            if value is not None:
                if value_functor is not None:
                    value = value_functor(value)
                credentials[env_key] = value


        if data.type == 's3':
            _addCredential(
                '{}_REGION'.format(prefix),
                's3_region'
            )
            _addCredential(
                '{}_ACCESS_KEY_ID'.format(prefix),
                's3_access_key_id'
            )
            _addCredential(
                '{}_SECRET_ACCESS_KEY'.format(prefix),
                's3_secret_access_key'
            )

            _addCredential(
                '{}_ENDPOINT'.format(prefix),
                's3_endpoint'
            )
            _addCredential(
                '{}_V2_AUTH'.format(prefix),
                's3_v2_auth'
            )

        elif data.type == 'azureblob':
            _addCredential(
                '{}_ACCOUNT'.format(prefix),
                'azure_account'
            )
            _addCredential(
                '{}_KEY'.format(prefix),
                'azure_key'
            )
            _addCredential(
                '{}_SAS_URL'.format(prefix),
                'azure_sas_url'
            )

        elif data.type == 'swift':
            _addCredential(
                '{}_USER'.format(prefix),
                'swift_user'
            )
            _addCredential(
                '{}_KEY'.format(prefix),
                'swift_key'
            )
            _addCredential(
                '{}_AUTH'.format(prefix),
                'swift_auth'
            )
            _addCredential(
                '{}_TENANT'.format(prefix),
                'swift_tenant'
            )

        elif data.type == 'google cloud storage':
            _addCredential(
                '{}_CLIENT_ID'.format(prefix),
                'gcp_client_id'
            )
            _addCredential(
                '{}_SERVICE_ACCOUNT_CREDENTIALS'.format(prefix),
                'gcp_service_account_credentials'
            )
            _addCredential(
                '{}_PROJECT_NUMBER'.format(prefix),
                'gcp_project_number'
            )
            _addCredential(
                '{}_OBJECT_ACL'.format(prefix),
                'gcp_object_acl'
            )
            _addCredential(
                '{}_BUCKET_ACL'.format(prefix),
                'gcp_bucket_acl'
            )

        elif data.type == 'sftp':
            _addCredential(
                '{}_HOST'.format(prefix),
                'sftp_host',
            )
            _addCredential(
                '{}_PORT'.format(prefix),
                'sftp_port',
            )
            _addCredential(
                '{}_USER'.format(prefix),
                'sftp_user',
            )
            _addCredential(
                '{}_PASS'.format(prefix),
                'sftp_pass',
                value_functor=self._obscure,
            )
            _addCredential(
                '{}_KEY_FILE'.format(prefix),
                'sftp_key_file',
            )

        elif data.type == 'dropbox':
            _addCredential(
                '{}_TOKEN'.format(prefix),
                'dropbox_token',
            )

        elif data.type == 'onedrive':
            _addCredential(
                '{}_TOKEN'.format(prefix),
                'onedrive_token',
            )
            _addCredential(
                '{}_DRIVE_ID'.format(prefix),
                'onedrive_drive_id',
            )
            _addCredential(
                '{}_DRIVE_TYPE'.format(prefix),
                'onedrive_drive_type',
            )

        elif data.type == 'webdav':
            _addCredential(
                '{}_URL'.format(prefix),
                'webdav_url',
            )
            _addCredential(
                '{}_USER'.format(prefix),
                'webdav_user',
            )
            _addCredential(
                '{}_PASS'.format(prefix),
                'webdav_pass',
                value_functor=self._obscure,
            )

        else:
            logging.error("Connection type unknown: {}".format(data.type))

        return credentials


    def _job_id_exists(self, job_id):
        return job_id in self._job_status


    def _obscure(self, password):
        """
        Calls `rclone obscure password` and returns the result
        """
        return self._execute(["rclone", "obscure", password])


    def _execute(self, command, env={}):
        full_env = os.environ.copy()
        full_env.update(env)
        try:
            byteOutput = subprocess.check_output(
                command,
                stderr=subprocess.PIPE,
                env=full_env
            )
            output = byteOutput.decode('UTF-8').rstrip()
            return output
        except subprocess.CalledProcessError as err:
            if (err.stderr is None):
                raise
            stderr = err.stderr.decode('UTF-8').strip()
            if len(stderr) == 0:
                raise
            raise RcloneException(stderr)


def sanitize_credentials(credentials_dict_orig):
    "sanitize values for certain keys"
    credentials_dict = credentials_dict_orig.copy()
    sensitive_keys_src = [
        "ACCESS_KEY_ID",
        "SECRET_ACCESS_KEY",
        "KEY",
        "SAS_URL",
        "CLIENT_ID",
        "SERVICE_ACCOUNT_CREDENTIALS",
        "PASS",
        "TOKEN",
    ]
    sensitive_keys = []
    for key in sensitive_keys_src:
        for srcdst in ["SRC", "DST"]:
            sensitive_keys.append("RCLONE_CONFIG_{}_{}".format(srcdst, key))
    for key, value in credentials_dict.items():
        if key in sensitive_keys:
            credentials_dict[key] = ''.join('*' * len(value))


    return credentials_dict

def sanitize(string):
    sanitizations_regs = [
        # s3
        (r"(RCLONE_CONFIG_\S*_ACCESS_KEY_ID=')(\S*)(\S\S\S\S')", r"\1***\3"),
        (r"(RCLONE_CONFIG_\S*_SECRET_ACCESS_KEY=')(\S*)(')", r"\1***\3"),

        # Azure
        (r"(RCLONE_CONFIG_\S*_KEY=')(\S*)(')", r"\1***\3"),
        (r"(RCLONE_CONFIG_\S*_SAS_URL=')(\S*)(')", r"\1***\3"),

        # Swift
        (r"(RCLONE_CONFIG_\S*_KEY=')(\S*)(')", r"\1***\3"),

        # GCP
        (r"(RCLONE_CONFIG_\S*_CLIENT_ID=')(\S*)(\S\S\S\S')", r"\1***\3"),
        (r"(RCLONE_CONFIG_\S*_SERVICE_ACCOUNT_CREDENTIALS=')([^']*)(')", r"\1{***}\3"),

        # SFTP / WebDAV
        (r"(RCLONE_CONFIG_\S*_PASS=')([^']*)(')", r"\1***\3"),

        # Dropbox / Onedrive
        (r"(RCLONE_CONFIG_\S*_TOKEN=')([^']*)(')", r"\1***\3"),
    ]

    for regex, replace in sanitizations_regs:
        string = re.sub(regex, replace, string)

    return string



def main():
    """
    Can run as
    export MOTUZ_REGION='<add-here>'
    export MOTUZ_ACCESS_KEY_ID='<add-here>'
    export MOTUZ_SECRET_ACCESS_KEY='<add-here>'

    python -m utils.rclone_connection
    """

    import time
    import os

    class CloudConnection:
        pass

    data = CloudConnection()
    data.__dict__ = {
        'type': 's3',
        'owner': 'aicioara',
        's3_region': os.environ['MOTUZ_REGION'],
        's3_access_key_id': os.environ['MOTUZ_ACCESS_KEY_ID'],
        's3_secret_access_key': os.environ['MOTUZ_SECRET_ACCESS_KEY'],
    }

    connection = RcloneConnection()

    # result = connection.ls(data, '/motuz-test/')
    # print(result)
    # return

    import random
    import json
    id = connection.md5sum(
        data,
        'motuz-test/test/',
        'aicioara',
        random.randint(1, 10000000),
        download=True,
    )
    while not connection.hashsum_finished(id):
        print(json.dumps(connection.hashsum_text(id)))
        time.sleep(1)
    print(json.dumps(connection.hashsum_text(id)))

    # connection.copy(
    #     src_data=None, # Local
    #     src_resource_path='/tmp/motuz/mb_blob.bin',
    #     dst_data=data,
    #     dst_resource_path='/fh-ctr-mofuz-test/hello/world/{}'.format(random.randint(10, 10000)),
    # )

    # while not connection.copy_finished(job_id):
    #     print(connection.copy_percent(job_id))
    #     time.sleep(0.1)



if __name__ == '__main__':
    main()
