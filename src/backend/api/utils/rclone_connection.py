from collections import defaultdict
import functools
import json
import logging
import re
import subprocess
import threading
import time

class RcloneConnection:
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
        command = '{} rclone lsjson current:'.format(credentials)

        try:
            result = self._execute(command)
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

        command = (
            '{credentials} '
            'rclone lsjson current:{path}'
        ).format(
            credentials=credentials,
            path=path,
        )

        try:
            result = self._execute(command)
            result = json.loads(result)
            return result
        except subprocess.CalledProcessError as e:
            raise RcloneException(sanitize(str(e)))




    def mkdir(self, data, path):
        credentials = self._formatCredentials(data, name='current')

        command = (
            '{credentials} '
            'rclone touch current:{path}/.keep'
        ).format(
            credentials=credentials,
            path=path,
        )

        try:
            result = self._execute(command)
            return {
                'message': 'Success',
            }
        except subprocess.CalledProcessError as e:
            raise RcloneException(sanitize(str(e)))



    def copy(self, src_data, src_path, dst_data, dst_path, job_id=None):
        credentials = ''

        if src_data is None: # Local
            src = src_path
        else:
            credentials += self._formatCredentials(src_data, name='src')
            src = 'src:{}'.format(src_path)

        if dst_data is None: # Local
            dst = dst_path
        else:
            credentials += self._formatCredentials(dst_data, name='dst')
            dst = 'dst:{}'.format(dst_path)


        command = (
            '{credentials} '
            'rclone copy {src} {dst} '
            '--progress '
            '--stats 2s '
        ).format(
            credentials=credentials,
            src=src,
            dst=dst,
        )

        logging.info(sanitize(command))

        if job_id is None:
            job_id = self._get_next_job_id()
        else:
            if self._job_id_exists(job_id):
                raise ValueError('rclone copy job with ID {} already exists'.fromat(job_id))

        self._stop_events[job_id] = threading.Event()

        try:
            self._execute_interactive(command, job_id)
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


    def _formatCredentials(self, data, name):
        """
        Credentials are of the form
        RCLONE_CONFIG_CURRENT_TYPE=s3
            ^          ^        ^   ^
        [mandatory  ][name  ][key][value]
        """

        prefix = "RCLONE_CONFIG_{}".format(name.upper())

        credentials = ''
        credentials += "{}_TYPE='{}' ".format(prefix, data.type)

        def _addCredential(credentials, env_key, data_key):
            value = getattr(data, data_key, None)
            if value is not None:
                credentials += "{}='{}' ".format(env_key, value)
            return credentials


        if data.type == 's3':
            credentials = _addCredential(credentials,
                '{}_REGION'.format(prefix),
                's3_region'
            )
            credentials = _addCredential(credentials,
                '{}_ACCESS_KEY_ID'.format(prefix),
                's3_access_key_id'
            )
            credentials = _addCredential(credentials,
                '{}_SECRET_ACCESS_KEY'.format(prefix),
                's3_secret_access_key'
            )

            credentials = _addCredential(credentials,
                '{}_ENDPOINT'.format(prefix),
                's3_endpoint'
            )
            credentials = _addCredential(credentials,
                '{}_V2_AUTH'.format(prefix),
                's3_v2_auth'
            )

        elif data.type == 'azureblob':
            credentials = _addCredential(credentials,
                '{}_ACCOUNT'.format(prefix),
                'azure_account'
            )
            credentials = _addCredential(credentials,
                '{}_KEY'.format(prefix),
                'azure_key'
            )

        elif data.type == 'swift':
            credentials = _addCredential(credentials,
                '{}_USER'.format(prefix),
                'swift_user'
            )
            credentials = _addCredential(credentials,
                '{}_KEY'.format(prefix),
                'swift_key'
            )
            credentials = _addCredential(credentials,
                '{}_AUTH'.format(prefix),
                'swift_auth'
            )
            credentials = _addCredential(credentials,
                '{}_TENANT'.format(prefix),
                'swift_tenant'
            )

        elif data.type == 'google cloud storage':
            credentials = _addCredential(credentials,
                '{}_CLIENT_ID'.format(prefix),
                'gcp_client_id'
            )
            credentials = _addCredential(credentials,
                '{}_SERVICE_ACCOUNT_CREDENTIALS'.format(prefix),
                'gcp_service_account_credentials'
            )
            credentials = _addCredential(credentials,
                '{}_PROJECT_NUMBER'.format(prefix),
                'gcp_project_number'
            )
            credentials = _addCredential(credentials,
                '{}_OBJECT_ACL'.format(prefix),
                'gcp_object_acl'
            )
            credentials = _addCredential(credentials,
                '{}_BUCKET_ACL'.format(prefix),
                'gcp_bucket_acl'
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


    def _execute(self, command):
        byteOutput = subprocess.check_output(command, shell=True)
        output = byteOutput.decode('UTF-8').rstrip()
        return output


    def _execute_interactive(self, command, job_id):
        thread = threading.Thread(target=self.__execute_interactive, kwargs={
            'command': command,
            'job_id': job_id,
        })
        thread.daemon = True
        thread.start()


    def __execute_interactive(self, command, job_id):
        stop_event = self._stop_events[job_id]

        process = subprocess.Popen(
            command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=True,
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
        if match is None:
            self._job_percent[job_id] = -1
        else:
            self._job_percent[job_id] = match[1]



def sanitize(string):
    sanitizations_regs = [
        # s3
        (r"(RCLONE_CONFIG_\S*_ACCESS_KEY_ID=')(\S*)(\S\S\S\S')", r"\1***\3"),
        (r"(RCLONE_CONFIG_\S*_SECRET_ACCESS_KEY=')(\S*)(')", r"\1***\3"),

        # Azure
        (r"(RCLONE_CONFIG_\S*_KEY=')(\S*)(')", r"\1***\3"),

        # Swift
        (r"(RCLONE_CONFIG_\S*_KEY=')(\S*)(')", r"\1***\3"),

        # GCP
        (r"(RCLONE_CONFIG_\S*_CLIENT_ID=')(\S*)(\S\S\S\S')", r"\1***\3"),
        (r"(RCLONE_CONFIG_\S*_SERVICE_ACCOUNT_CREDENTIALS=')([^']*)(')", r"\1{***}\3"),
    ]

    for regex, replace in sanitizations_regs:
        string = re.sub(regex, replace, string)

    return string



class RcloneException(Exception):
    pass


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
        src_path='/tmp/motuz/mb_blob.bin',
        dst_data=data,
        dst_path='/fh-ctr-mofuz-test/hello/world/{}'.format(random.randint(10, 10000)),
        job_id=job_id
    )


    while not connection.copy_finished(job_id):
        print(connection.copy_percent(job_id))
        time.sleep(0.1)



if __name__ == '__main__':
    main()
