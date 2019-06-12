import os
import subprocess
import sys
import threading
import time


class RcloneConnection:
    def __init__(self, type, region, access_key_id, secret_access_key):
        self.type = type
        self.region = region
        self.access_key_id = access_key_id
        self.secret_access_key = secret_access_key

        self._job_status = {} # Mapping from id to status string
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


    def copy(self, src, dst):
        command = (
            'RCLONE_CONFIG_CURRENT_TYPE={type} '
            'RCLONE_CONFIG_CURRENT_REGION={region} '
            'RCLONE_CONFIG_CURRENT_ACCESS_KEY_ID={access_key_id} '
            'RCLONE_CONFIG_CURRENT_SECRET_ACCESS_KEY={secret_access_key} '
            # 'rclone copy --progress {src} current:{dst}'
            'rclone copy --stats-one-line --progress {src} current:{dst}'
        ).format(
            type=self.type,
            region=self.region,
            access_key_id=self.access_key_id,
            secret_access_key=self.secret_access_key,
            src=src,
            dst=dst,
        )

        job_id = self.get_next_job_id()
        self._job_status[job_id] = ''
        self._execute_interactive(command, job_id)
        return job_id


    def copy_status(self, job_id):
        return self._job_status[job_id]


    def get_next_job_id(self):
        self._latest_job_id += 1
        return self._latest_job_id


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
        process = subprocess.Popen(
            command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            shell=True,
        )

        first_start_sequence = chr(27)
        start_sequence = ''.join(chr(d) for d in (91, 50, 75, 27, 91, 48, 71))

        start = process.stdout.read(1).decode('utf-8')
        assert(start == first_start_sequence)

        while True:
            start = process.stdout.read(len(start_sequence)).decode('utf-8')
            assert(start == start_sequence)
            line = ''
            while True:
                cc = process.stdout.read(1).decode("utf-8")
                if cc == first_start_sequence:
                    break
                line += cc
            self._job_status[job_id] = line




if __name__ == '__main__':
    conection = RcloneConnection(
        type='s3',
        region=os.environ['MOTUZ_REGION'],
        access_key_id=os.environ['MOTUZ_ACCESS_KEY_ID'],
        secret_access_key=os.environ['MOTUZ_SECRET_ACCESS_KEY'],
    )

    # result = conection.ls('/fh-ctr-mofuz-test/hello/world')
    job_id = conection.copy('/tmp/motuz/blob2.bin', '/fh-ctr-mofuz-test/hello/world')
    print("Now sleeping")
    time.sleep(20)
    print("Woke up")

    while True:
        print(conection.copy_status(job_id))
        time.sleep(3)

