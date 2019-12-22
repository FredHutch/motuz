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

class RcloneConnection(AbstractConnection):
    def __init__(self):
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
            'rclone',
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
            'rclone',
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
            'rclone',
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
            job_id=None
    ):
        credentials = {}

        if src_data is None: # Local
            src = src_resource_path
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
            'rclone',
            'copyto',
            src,
            dst,
            option_copy_links,
            '--progress',
            '--stats', '2s',
        ]

        command = [cmd for cmd in command if len(cmd) > 0]

        self._logCommand(command, credentials)

        if job_id is None:
            job_id = self._get_next_job_id()
        else:
            if self._job_id_exists(job_id):
                raise ValueError('rclone copy job with ID {} already exists'.fromat(job_id))

        self._stop_events[job_id] = threading.Event()

        try:
            self._execute_interactive(command, credentials, job_id)
        except subprocess.CalledProcessError as e:
            raise RcloneException(sanitize(str(e)))

        return job_id



    def copy_text(self, job_id):
        return self._job_text[job_id]

    def copy_error_text(self, job_id):
        return self._job_error_text[job_id]

    def copy_percent(self, job_id):
        return self._job_percent[job_id]

    def copy_stop(self, job_id):
        self._stop_events[job_id].set()

    def copy_finished(self, job_id):
        return self._stop_events[job_id].is_set()

    def copy_exitstatus(self, job_id):
        return self._job_exitstatus.get(job_id, -1)


    def _logCommand(self, command, credentials):
        bash_command = "{} {}".format(
            ' '.join("{}='{}'".format(key, value) for key, value in credentials.items()),
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


    def _get_next_job_id(self):
        self._latest_job_id += 1
        while self._job_id_exists(self._latest_job_id):
            self._latest_job_id += 1
        return self._latest_job_id

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


    def _execute_interactive(self, command, env, job_id):
        thread = threading.Thread(target=self.__execute_interactive, kwargs={
            'command': command,
            'env': env,
            'job_id': job_id,
        })
        thread.daemon = True
        thread.start()


    def __execute_interactive(self, command, env={}, job_id=0):
        stop_event = self._stop_events[job_id]
        full_env = os.environ.copy()
        full_env.update(env)

        process = subprocess.Popen(
            command,
            env=full_env,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        reset_sequence1 = '\x1b[2K\x1b[0' # + 'G'
        reset_sequence2 = '\x1b[2K\x1b[A\x1b[2K\x1b[A\x1b[2K\x1b[A\x1b[2K\x1b[A\x1b[2K\x1b[A\x1b[2K\x1b[A\x1b[2K\x1b[0' # + 'G'

        while not stop_event.is_set():
            line = process.stdout.readline().decode('utf-8')

            if len(line) == 0:
                if process.poll() is not None:
                    stop_event.set()
                else:
                    time.sleep(0.5)
                continue

            line = line.strip()

            q1 = line.find(reset_sequence1)
            if q1 != -1:
                line = line[q1 + len(reset_sequence1):]

            q2 = line.find(reset_sequence2)
            if q2 != -1:
                line = line[q2 + len(reset_sequence1):]

            line = line.replace(reset_sequence1, '')
            line = line.replace(reset_sequence2, '')

            match = re.search(r'(ERROR.*)', line)
            if match is not None:
                error = match.groups()[0]
                logging.error(error)
                self._job_error_text[job_id] += error
                self._job_error_text[job_id] += '\n'
                continue

            match = re.search(r'([A-Za-z ]+):\s*(.*)', line)
            if match is None:
                logging.info("No match in {}".format(line))
                time.sleep(0.5)
                continue

            key, value = match.groups()
            self._job_status[job_id][key] = value
            self.__process_status(job_id)

        self._job_percent[job_id] = 100
        self.__process_status(job_id)

        exitstatus = process.poll()
        self._job_exitstatus[job_id] = exitstatus

        for _ in range(1000):
            line = process.stderr.readline().decode('utf-8')
            if len(line) == 0:
                break
            line = line.strip()
            self._job_error_text[job_id] += line
            self._job_error_text[job_id] += '\n'

        logging.info("Copy process exited with exit status {}".format(exitstatus))
        stop_event.set() # Just in case


    def __process_status(self, job_id):
        self.__process_text(job_id)
        self.__process_percent(job_id)


    def __process_text(self, job_id):
        headers = [
            'GTransferred',
            'Errors',
            'Checks',
            'Transferred',
            'Elapsed time',
            'Transferring',
        ]

        status = self._job_status[job_id]

        text = '\n'.join(
            '{:>12}: {}'.format(header, status[header])
            for header in headers
        )
        self._job_text[job_id] = text


    def __process_percent(self, job_id):
        status = self._job_status[job_id]

        match = re.search(r'(\d+)\%', status['GTransferred'])

        if match is not None:
            self._job_percent[job_id] = match[1]
            return

        match = re.search(r'(\d+)\%', status['Transferred'])
        if match is not None:
            self._job_percent[job_id] = match[1]
            return

        self._job_percent[job_id] = -1



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
        (r"(RCLONE_CONFIG_\S*_PASS=')([^']*)(')", r"\1{***}\3"),

        # Dropbox / Onedrive
        (r"(RCLONE_CONFIG_\S*_TOKEN=')([^']*)(')", r"\1{***}\3"),
    ]

    for regex, replace in sanitizations_regs:
        string = re.sub(regex, replace, string)

    return string



def main():
    import time
    import os

    class CloudConnection:
        pass

    data = CloudConnection()
    data.__dict__ = {
        'type': 's3',
        'region': os.environ['MOTUZ_REGION'],
        'access_key_id': os.environ['MOTUZ_ACCESS_KEY_ID'],
        'secret_access_key': os.environ['MOTUZ_SECRET_ACCESS_KEY'],
    }

    connection = RcloneConnection()

    # result = connection.ls('/fh-ctr-mofuz-test/hello/world')
    job_id = 123
    import random
    connection.copy(
        src_data=None, # Local
        src_resource_path='/tmp/motuz/mb_blob.bin',
        dst_data=data,
        dst_resource_path='/fh-ctr-mofuz-test/hello/world/{}'.format(random.randint(10, 10000)),
        job_id=job_id
    )


    while not connection.copy_finished(job_id):
        print(connection.copy_percent(job_id))
        time.sleep(0.1)



if __name__ == '__main__':
    main()
