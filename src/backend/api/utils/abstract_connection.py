import subprocess
import os


class AbstractConnection:
    """
    A symmetric API for rclone_connection to be used locally
    """

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


class RcloneException(Exception):
    pass

