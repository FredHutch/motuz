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

class CopyJobQueue:
    def __init__(self):
        self._job_status = defaultdict(functools.partial(defaultdict, str)) # Mapping from id to status dict

        self._job_text = defaultdict(str)
        self._job_error_text = defaultdict(str)
        self._job_percent = defaultdict(int)
        self._job_exitstatus = {}

        self._stop_events = {} # Mapping from id to threading.Event
        self._latest_job_id = 0


    def push(self, command, env, job_id):
        if self._job_id_exists(job_id):
            raise KeyError("Job with ID {} already submitted to {}".format(job_id, self.__class__))

        self._stop_events[job_id] = threading.Event()

        try:
            self._execute_interactive(command, env, job_id)
        except subprocess.CalledProcessError as e:
            raise RcloneException(e)

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



    def _job_id_exists(self, job_id):
        return job_id in self._job_status


    def _execute_interactive(self, command, env, job_id):
        thread = threading.Thread(target=self.__execute_interactive, kwargs={
            'command': command,
            'env': env,
            'job_id': job_id,
        })
        thread.daemon = True
        thread.start()


    def __execute_interactive(self, command, env, job_id):
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
                # Restrict size to 10000 characters
                self._job_error_text[job_id] = self._job_error_text[job_id][-10000:]
                continue

            match = re.search(r'([A-Za-z ]+):\s*(.*)', line)
            if match is None:
                logging.info("No match in {}".format(line))
                time.sleep(0.5)
                continue

            key, value = match.groups()
            self._job_status[job_id][key] = value
            self.__process_copy_status(job_id)

        self._job_percent[job_id] = 100
        self.__process_copy_status(job_id)

        exitstatus = process.poll()
        self._job_exitstatus[job_id] = exitstatus

        for _ in range(100000):
            line = process.stderr.readline().decode('utf-8')
            if len(line) == 0:
                break
            line = line.strip()
            self._job_error_text[job_id] += line
            self._job_error_text[job_id] += '\n'
            # Restrict size to 10000 characters
            self._job_error_text[job_id] = self._job_error_text[job_id][-10000:]


        logging.info("Copy process exited with exit status {}".format(exitstatus))
        stop_event.set() # Just in case


    def __process_copy_status(self, job_id):
        self.__process_copy_text(job_id)
        self.__process_copy_percent(job_id)


    def __process_copy_text(self, job_id):
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


    def __process_copy_percent(self, job_id):
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
