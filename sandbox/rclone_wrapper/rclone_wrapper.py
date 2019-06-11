import sys
import os
import subprocess


class Rclone:
    def __init__(self, type, region, access_key_id, secret_access_key):
        self.type = type
        self.region = region
        self.access_key_id = access_key_id
        self.secret_access_key = secret_access_key


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
            'rclone lsjson current:{path}'
        ).format(
            type=self.type,
            path=self.path,
            region=self.region,
            access_key_id=self.access_key_id,
            secret_access_key=self.secret_access_key,
        )




    def _execute(self, command):
        byteOutput = subprocess.check_output(command, shell=True)
        output = byteOutput.decode('UTF-8').rstrip()
        return output



if __name__ == '__main__':
    conection = Rclone(
        type='s3',
        region=os.environ['MOTUZ_REGION'],
        access_key_id=os.environ['MOTUZ_ACCESS_KEY_ID'],
        secret_access_key=os.environ['MOTUZ_SECRET_ACCESS_KEY'],
    )

    result = conection.ls('/fh-ctr-mofuz-test/hello/world')
    print(result)
