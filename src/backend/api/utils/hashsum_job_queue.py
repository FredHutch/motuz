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

class HashsumJobQueue:
    def __init__(self):
        self._job_status = defaultdict(list) # Mapping from id to list of dict

        self._job_text = {}
        self._job_error_text = defaultdict(str)
        self._job_percent = defaultdict(int)
        self._job_exitstatus = {}

        self._stop_events = {} # Mapping from id to threading.Event


    def push(self, command, env, job_id):
        if self._job_id_exists(job_id):
            raise KeyError("Job with ID {} already submitted to {}".format(job_id, self.__class__))

        self._stop_events[job_id] = threading.Event()

        try:
            self._execute_interactive(command, env, job_id)
        except subprocess.CalledProcessError as e:
            raise RcloneException(e)

        return job_id


    def hashsum_text(self, job_id):
        return self._job_status[job_id]

    def hashsum_error_text(self, job_id):
        return self._job_error_text[job_id]

    def hashsum_percent(self, job_id):
        return self._job_percent[job_id]

    def hashsum_stop(self, job_id):
        self._stop_events[job_id].set()

    def hashsum_finished(self, job_id):
        return self._stop_events[job_id].is_set()

    def hashsum_exitstatus(self, job_id):
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

        while not stop_event.is_set():
            line = process.stdout.readline().decode('utf-8')

            if len(line) == 0:
                if process.poll() is not None:
                    stop_event.set()
                else:
                    time.sleep(0.5)
                continue

            # The output of the command is 32 md5sum characters,
            # followed by 2 spaces
            # followed by the filename
            groups = re.search(
                r'^({})\s\s(.*)'.format('.' * 32), # 32 character md5sum
                line,
            )
            self._job_status[job_id].append({
                'Name': groups[2],
                'md5chksum': groups[1].strip() or None,
            })
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

        logging.info("Hashsum process exited with exit status {}".format(exitstatus))
        stop_event.set() # Just in case


    def __process_copy_status(self, job_id):
        status = self._job_status[job_id]

