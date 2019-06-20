import logging
import subprocess
import threading


class RcloneConnection:
    def __init__(self, type, region, access_key_id, secret_access_key):
        self.type = type
        self.region = region
        self.access_key_id = access_key_id
        self.secret_access_key = secret_access_key

        self._job_status = {} # Mapping from id to status string
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
            '--stats-one-line --progress '
            '--stats 2s '
        ).format(
            type=self.type,
            region=self.region,
            access_key_id=self.access_key_id,
            secret_access_key=self.secret_access_key,
            src=src,
            dst=dst,
        )

        logging.info(command)

        if job_id is None:
            job_id = self._get_next_job_id()
        else:
            if self._job_id_exists(job_id):
                raise ValueError('rclone copy job with ID {} already exists'.fromat(job_id))

        self._job_status[job_id] = ''
        self._stop_events[job_id] = threading.Event()
        self._execute_interactive(command, job_id)
        return job_id


    def copy_status(self, job_id):
        return self._job_status[job_id]

    def copy_stop(self, job_id):
        from pprint import pprint as pp
        pp(self._stop_events)
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

        first_start_sequence = chr(27)
        start_sequence = ''.join(chr(d) for d in (91, 50, 75, 27, 91, 48, 71))

        start = process.stdout.read(1).decode('utf-8')
        if not start == first_start_sequence:
            logging.error("Start character chr({}) is not as expected chr({}) ".format(
                ord(start), ord(first_start_sequence))
            )
            txt = start
            for _ in range(1000):
                txt += process.stdout.read(1).decode('utf-8')
            logging.info(txt)
            stop_event.set()

        while not stop_event.is_set():
            start = process.stdout.read(len(start_sequence)).decode('utf-8')
            if not start == start_sequence:
                logging.error("Start sequence chr({}) is not as expected chr({}) ".format(
                    map(ord, start), map(ord, first_start_sequence)
                ))
                stop_event.set()
                continue

            line = ''
            while True:
                cc = process.stdout.read(1).decode("utf-8")
                if cc == first_start_sequence:
                    break
                line += cc
            self._job_status[job_id] = line

        stop_event.set()



def main():
    import time
    import os

    conection = RcloneConnection(
        type='s3',
        region=os.environ['MOTUZ_REGION'],
        access_key_id=os.environ['MOTUZ_ACCESS_KEY_ID'],
        secret_access_key=os.environ['MOTUZ_SECRET_ACCESS_KEY'],
    )

    # result = conection.ls('/fh-ctr-mofuz-test/hello/world')
    job_id = conection.copy('/tmp/motuz/blob2.bin', '/fh-ctr-mofuz-test/hello/world')
    print("Now sleeping")

    time.sleep(10)
    print(connection.copy_status(job_id))
    connection.copy_stop(job_id)

    time.sleep(1)


if __name__ == '__main__':
    main()
