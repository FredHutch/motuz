import logging
import subprocess
import functools
import threading
import re
import time
from collections import defaultdict

class RcloneConnection:
    def __init__(self, type, region, access_key_id, secret_access_key):
        self.type = type
        self.region = region
        self.access_key_id = access_key_id
        self.secret_access_key = secret_access_key

        self._job_status = defaultdict(functools.partial(defaultdict, str)) # Mapping from id to status dict
        self._job_text = defaultdict(str)
        self._job_percent = defaultdict(int)
        self._stop_events = {} # Mapping from id to threading.Event
        self._latest_job_id = 0


    def ls(self, path):
        command = (
            'RCLONE_CONFIG_CURRENT_TYPE={type} '
            'RCLONE_CONFIG_CURRENT_REGION={region} '
            'RCLONE_CONFIG_CURRENT_ACCESS_KEY_ID={access_key_id} '
            'RCLONE_CONFIG_CURRENT_SECRET_ACCESS_KEY={secret_access_key} '
            'rclone lsjson current:{path}'
        ).format(
            type=self.type,
            region=self.region,
            access_key_id=self.access_key_id,
            secret_access_key=self.secret_access_key,
            path=path,
        )

        result = self._execute(command)
        return result


    def copy(self, src, dst, job_id=None):
        command = (
            'RCLONE_CONFIG_CURRENT_TYPE={type} '
            'RCLONE_CONFIG_CURRENT_REGION={region} '
            'RCLONE_CONFIG_CURRENT_ACCESS_KEY_ID={access_key_id} '
            'RCLONE_CONFIG_CURRENT_SECRET_ACCESS_KEY={secret_access_key} '
            'rclone copy {src} current:{dst} '
            '--progress '
            '--stats 2s '
        ).format(
            type=self.type,
            region=self.region,
            access_key_id=self.access_key_id,
            secret_access_key=self.secret_access_key,
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
        self._execute_interactive(command, job_id)
        return job_id


    def copy_text(self, job_id):
        return self._job_text[job_id]

    def copy_percent(self, job_id):
        return self._job_percent[job_id]

    def copy_stop(self, job_id):
        self._stop_events[job_id].set()

    def copy_finished(self, job_id):
        return self._stop_events[job_id].is_set()


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
            stderr=subprocess.STDOUT,
            shell=True,
        )

        reset_sequence1 = '\x1b[2K\x1b[0' # + 'G'
        reset_sequence2 = '\x1b[2K\x1b[A\x1b[2K\x1b[A\x1b[2K\x1b[A\x1b[2K\x1b[A\x1b[2K\x1b[A\x1b[2K\x1b[A\x1b[2K\x1b[0' # + 'G'

        while not stop_event.is_set() and process.poll() is None:
            line = process.stdout.readline().decode('utf-8').strip()

            if len(line) == 0:
                stop_event.set()
                continue

            q1 = line.find(reset_sequence1)
            if q1 != -1:
                line = line[q1 + len(reset_sequence1):]

            q2 = line.find(reset_sequence2)
            if q2 != -1:
                line = line[q2 + len(reset_sequence1):]

            line = line.replace(reset_sequence1, '')
            line = line.replace(reset_sequence2, '')

            match = re.search(r'([A-Za-z ]+):\s*(.*)', line)
            if match is None:
                print("No match in {}".format(line))
                time.sleep(0.5)
                continue

            key, value = match.groups()
            self._job_status[job_id][key] = value
            self.__process_status(job_id)

        self._job_percent[job_id] = 100
        logging.info("Finished Copy")
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






def main():
    import time
    import os

    connection = RcloneConnection(
        type='s3',
        region=os.environ['MOTUZ_REGION'],
        access_key_id=os.environ['MOTUZ_ACCESS_KEY_ID'],
        secret_access_key=os.environ['MOTUZ_SECRET_ACCESS_KEY'],
    )

    # result = connection.ls('/fh-ctr-mofuz-test/hello/world')
    job_id = 123
    import random
    connection.copy('/tmp/motuz/mb_blob.bin', '/fh-ctr-mofuz-test/hello/world/{}'.format(random.randint(10, 10000)), job_id=job_id)


    while not connection.copy_finished(job_id):
        print(connection.copy_percent(job_id))
        time.sleep(0.1)



def sanitize(string):
    string = sanitize_secret_access_key(string)
    string = sanitize_access_key_id(string)
    return string


sanitize_secret_access_key = functools.partial(
    re.sub,
    r'(RCLONE_CONFIG_CURRENT_SECRET_ACCESS_KEY=)(\S*)',
    r'\1****'
)

sanitize_access_key_id = functools.partial(
    re.sub,
    r'(RCLONE_CONFIG_CURRENT_ACCESS_KEY_ID=)\S*(\S\S\S\S)',
    r'\1****\2'
)



if __name__ == '__main__':
    main()
