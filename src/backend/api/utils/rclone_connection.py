from collections import defaultdict
import functools
import json
import logging
import re
import subprocess
import threading
import time

class RcloneConnection:
    def __init__(self, data):
        self.data = data

        self._setCredentials()

        self._job_status = defaultdict(functools.partial(defaultdict, str)) # Mapping from id to status dict

        self._job_text = defaultdict(str)
        self._job_error_text = defaultdict(str)
        self._job_percent = defaultdict(int)
        self._job_exitstatus = {}

        self._stop_events = {} # Mapping from id to threading.Event
        self._latest_job_id = 0


    def verify(self):
        command = '{} rclone lsjson current:'.format(self.credentials)

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


    def ls(self, path):
        command = (
            '{credentials} '
            'rclone lsjson current:{path}'
        ).format(
            credentials=self.credentials,
            path=path,
        )

        try:
            result = self._execute(command)
            result = json.loads(result)
            return result
        except subprocess.CalledProcessError as e:
            raise RcloneException(sanitize(str(e)))




    def mkdir(self, path):
        command = (
            '{credentials} '
            'rclone touch current:{path}/.keep'
        ).format(
            credentials=self.credentials,
            path=path,
        )

        try:
            result = self._execute(command)
            return {
                'message': 'Success',
            }
        except subprocess.CalledProcessError as e:
            raise RcloneException(sanitize(str(e)))



    def copy(self, src, dst, job_id=None):
        command = (
            '{credentials} '
            'rclone copy {src} current:{dst} '
            '--progress '
            '--stats 2s '
        ).format(
            credentials=self.credentials,
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


    def _setCredentials(self):
        self.credentials = ''
        self.credentials += "RCLONE_CONFIG_CURRENT_TYPE='{}' ".format(self.data.type)

        def _addCredential(env_key, data_key):
            value = getattr(self.data, data_key, None)
            if value is not None:
                self.credentials += "{}='{}' ".format(env_key, value)


        if self.data.type == 's3':
            _addCredential('RCLONE_CONFIG_CURRENT_REGION', 's3_region')
            _addCredential('RCLONE_CONFIG_CURRENT_ACCESS_KEY_ID', 's3_access_key_id')
            _addCredential('RCLONE_CONFIG_CURRENT_SECRET_ACCESS_KEY', 's3_secret_access_key')

            _addCredential('RCLONE_CONFIG_CURRENT_ENDPOINT', 's3_endpoint')
            _addCredential('RCLONE_CONFIG_CURRENT_V2_AUTH', 's3_v2_auth')

        elif self.data.type == 'azureblob':
            _addCredential('RCLONE_CONFIG_CURRENT_ACCOUNT', 'azure_account')
            _addCredential('RCLONE_CONFIG_CURRENT_KEY', 'azure_key')

        elif self.data.type == 'swift':
            _addCredential('RCLONE_CONFIG_CURRENT_USER', 'swift_user')
            _addCredential('RCLONE_CONFIG_CURRENT_KEY', 'swift_key')
            _addCredential('RCLONE_CONFIG_CURRENT_AUTH', 'swift_auth')
            _addCredential('RCLONE_CONFIG_CURRENT_TENANT', 'swift_tenant')

        elif self.data.type == 'google cloud storage':
            _addCredential('RCLONE_CONFIG_CURRENT_CLIENT_ID', 'gcp_client_id')
            _addCredential('RCLONE_CONFIG_CURRENT_SERVICE_ACCOUNT_CREDENTIALS', 'gcp_service_account_credentials')
            _addCredential('RCLONE_CONFIG_CURRENT_PROJECT_NUMBER', 'gcp_project_number')
            _addCredential('RCLONE_CONFIG_CURRENT_OBJECT_ACL', 'gcp_object_acl')
            _addCredential('RCLONE_CONFIG_CURRENT_BUCKET_ACL', 'gcp_bucket_acl')

        else:
            logging.error("Connection type unknown: {}".format(self.data.type))


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

    connection = RcloneConnection(
        data=data,
    )

    # result = connection.ls('/fh-ctr-mofuz-test/hello/world')
    job_id = 123
    import random
    connection.copy('/tmp/motuz/mb_blob.bin', '/fh-ctr-mofuz-test/hello/world/{}'.format(random.randint(10, 10000)), job_id=job_id)


    while not connection.copy_finished(job_id):
        print(connection.copy_percent(job_id))
        time.sleep(0.1)



if __name__ == '__main__':
    main()
