import functools
import json
import logging
import os
import subprocess
from collections import defaultdict

import boto3
from botocore.exceptions import ClientError

from .abstract_connection import AbstractConnection, RcloneException
from .copy_job_queue import CopyJobQueue
from .hashsum_job_queue import HashsumJobQueue


class RcloneConnection(AbstractConnection):
    def __init__(self):
        self._hashsum_job_queue = HashsumJobQueue()
        self._copy_job_queue = CopyJobQueue()

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
            '/usr/local/bin/rclone',
            '--config=/dev/null',
            'lsjson',
            'current:{}'.format(bucket),
        ]

        self._log_command(command, credentials)

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
            '/usr/local/bin/rclone',
            '--config=/dev/null',
            'lsjson',
            'current:{}'.format(path),
        ]

        self._log_command(command, credentials)

        try:
            result = self._execute(command, credentials)
            files = json.loads(result)
            return {
                'files': files,
                'path': path,
            }
        except subprocess.CalledProcessError as e:
            raise RcloneException(str(e))



    def mkdir(self, data, path):
        credentials = self._formatCredentials(data, name='current')
        user = data.owner
        command = [
            'sudo',
            '-E',
            '-u', user,
            '/usr/local/bin/rclone',
            '--config=/dev/null',
            '--s3-no-check-bucket',
            '--s3-acl',
            'bucket-owner-full-control',
            'touch',
            'current:{}/.motuz_keep'.format(path),
        ]

        self._log_command(command, credentials)

        try:
            result = self._execute(command, credentials)
            return {
                'message': 'Success',
            }
        except subprocess.CalledProcessError as e:
            raise RcloneException(str(e))

    # TODO move this to a utility module (along w/its imports)
    # it does not need to be a class method.
    def check_kms_encryption(self, credentials, bucket_raw):
        """
        Check if kms encryption is used on destination bucket.

        See issue #443.

        In rclone if you are copying to a bucket that is encrypted with a KMS key,
        as opposed to one that has AWS managed encryption (SSE, the default),
        then you have to pass `--s3-server-side-encryption=aws:kms` in your rclone
        copy command. But if the bucket is *not* KMS-encrypted, you must NOT pass that
        flag. (The AWS CLI does not have this issue.)

        This function will detect whether or not the bucket is KMS-encrypted.
        rclone apparently has no way to determine this, so we have to use boto3,
        which is not ideal.

        This seems to work, but a potential issue is if the user has permission
        to list and upload, but not to call GetBucketEncryption.
        I saw this happen once but could not reproduce it.
        So we need to return False instead of re-raising the exception
        below, and hope that that was a good guess. Maybe there's a better way?

        NOTE: Oddly, it seems like we do not need the `--s3-server-side-encryption=aws:kms`
        when using `rclone touch` to create an empty file (in order to create a
        "folder"), even when the bucket uses KMS encryption.
        So I have not modified mkdir() at all.

        """

        bucket = bucket_raw.split("/")[1]

        # This is a horrendous hack but it solves an immediate problem while 
        # we figure out why it is necessary. 
        # New buckets that will be used with Halo will always have '-eco-halo'
        # in the name and will all use KMS encryption.
        if bucket.startswith("fh-div-sr-exhi-eco") or "-eco-halo" in bucket:
            return True

        if not 'RCLONE_CONFIG_DST_TYPE' in credentials:
            return False
        if credentials['RCLONE_CONFIG_DST_TYPE'] != 's3':
            # If we are not copying to S3, we can bail.
            return False
        # boto3 uses different environment variables; set them here:
        os.environ['AWS_ACCESS_KEY_ID'] = credentials['RCLONE_CONFIG_DST_ACCESS_KEY_ID']
        os.environ['AWS_SECRET_ACCESS_KEY'] = credentials['RCLONE_CONFIG_DST_SECRET_ACCESS_KEY']
        os.environ['AWS_DEFAULT_REGION'] = credentials['RCLONE_CONFIG_DST_REGION']
        if "RCLONE_CONFIG_DST_SESSION_TOKEN" in credentials:
            os.environ['AWS_SESSION_TOKEN'] = credentials['RCLONE_CONFIG_DST_SESSION_TOKEN']
        s3 = boto3.client("s3")
        try:
            resp = s3.get_bucket_encryption(Bucket=bucket)
        except ClientError as e:
            if e.response["Error"]["Code"] == "ServerSideEncryptionConfigurationNotFoundError":
                return False          # no default encryption at all
            elif e.response["Error"]["Code"] == "AccessDenied":
                # User does not have permission to know about the bucket's encryption.
                # Most newer buckets are encrypted by default and I am not sure
                # you can remove encryption from a bucket, so fingers crossed.
                # This might be an incorrect guess, but we have to do something.
                logging.warning("No access to get_bucket_encryption; guessing kms not used.")
                return False
            raise  # genuine failure — re‑raise. Or should we return False?
        rules = resp["ServerSideEncryptionConfiguration"]["Rules"]
        return any(
            r.get("ApplyServerSideEncryptionByDefault", {}).get("SSEAlgorithm") == "aws:kms"
            for r in rules
        )

    def copy(self,
            src_data,
            src_resource_path,
            dst_data,
            dst_resource_path,
            user,
            copy_links,
            job_id
    ):
        credentials = {}
        option_exclude_dot_snapshot = '' # HACKHACK: remove once https://github.com/rclone/rclone/issues/2425 is addressed
        kms_encryption = ''

        if src_data is None: # Local
            src = src_resource_path
            if os.path.isdir(src):
                option_exclude_dot_snapshot = '--exclude=\\.snapshot/'
        else:
            credentials.update(self._formatCredentials(src_data, name='src'))
            src = 'src:{}'.format(src_resource_path)

        if dst_data is None: # Local
            dst = dst_resource_path
        else:
            credentials.update(self._formatCredentials(dst_data, name='dst'))
            dst = 'dst:{}'.format(dst_resource_path)

        if self.check_kms_encryption(credentials, dst):
            kms_encryption = "--s3-server-side-encryption=aws:kms"

        if copy_links:
            option_copy_links = '--copy-links'
        else:
            option_copy_links = ''

        command = [
            'sudo',
            '-E',
            '-u', user,
            '/usr/local/bin/rclone',
            '--config=/dev/null',
            '--s3-disable-checksum',
            '--s3-no-check-bucket',
            kms_encryption,
            '--s3-acl',
            'bucket-owner-full-control',
            option_exclude_dot_snapshot,
            '--contimeout=5m',
            'copyto',
            src,
            dst,
            option_copy_links,
            '--progress',
            '--stats', '2s',
        ]

        command = [cmd for cmd in command if len(cmd) > 0]

        self._log_command(command, credentials)

        try:
            self._copy_job_queue.push(command, credentials, job_id)
        except RcloneException as e:
            raise RcloneException(str(e))

        return job_id


    def copy_text(self, job_id):
        return self._copy_job_queue.copy_text(job_id)

    def copy_error_text(self, job_id):
        return self._copy_job_queue.copy_error_text(job_id)

    def copy_percent(self, job_id):
        return self._copy_job_queue.copy_percent(job_id)

    def copy_stop(self, job_id):
        self._copy_job_queue.copy_stop(job_id)

    def copy_finished(self, job_id):
        return self._copy_job_queue.copy_finished(job_id)

    def copy_exitstatus(self, job_id):
        return self._copy_job_queue.copy_exitstatus(job_id)


    def md5sum(self,
            data,
            resource_path,
            user,
            job_id,
            download=False,
    ):
        credentials = {}
        option_exclude_dot_snapshot = '' # HACKHACK: remove once https://github.com/rclone/rclone/issues/2425 is addressed
        option_download = ''

        if data is None: # Local
            src = resource_path
            download = False
            if os.path.isdir(src):
                option_exclude_dot_snapshot = '--exclude=\\.snapshot/'
        else:
            credentials.update(self._formatCredentials(data, name='src'))
            src = 'src:{}'.format(resource_path)

        if download:
            option_download = '--download'

        command = [
            'sudo',
            '-E',
            '-u', user,
            '/usr/local/bin/rclone',
            '--config=/dev/null',
            'md5sum',
            src,
            option_exclude_dot_snapshot,
            option_download
        ]

        command = [cmd for cmd in command if len(cmd) > 0]

        self._log_command(command, credentials)

        try:
            self._hashsum_job_queue.push(command, credentials, job_id)
        except RcloneException as e:
            raise RcloneException(str(e))

        return job_id


    def hashsum_text(self, job_id):
        return self._hashsum_job_queue.hashsum_text(job_id)

    def hashsum_error_text(self, job_id):
        return self._hashsum_job_queue.hashsum_error_text(job_id)

    def hashsum_percent(self, job_id):
        return self._hashsum_job_queue.hashsum_percent(job_id)

    def hashsum_stop(self, job_id):
        self._hashsum_job_queue.hashsum_stop(job_id)

    def hashsum_finished(self, job_id):
        return self._hashsum_job_queue.hashsum_finished(job_id)

    def hashsum_exitstatus(self, job_id):
        return self._hashsum_job_queue.hashsum_exitstatus(job_id)

    def hashsum_delete(self, job_id):
        return self._hashsum_job_queue.hashsum_delete(job_id)


    def _log_command(self, command, credentials):
        sanitized_credentials = {}
        for key, value in credentials.items():
            if should_log_full_credential(key):
                sanitized_credentials[key] = value
            elif should_log_partial_credential(key):
                sanitized_credentials[key] = '***' + value[-4:]
            else:
                sanitized_credentials[key] = '***'

        bash_command = "{} {}".format(
            ' '.join("{}='{}'".format(key, value) for key, value in sanitized_credentials.items()),
            ' '.join(command),
        )
        logging.info(bash_command)
        return bash_command


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
            if data.subtype == 'sts':
                _addCredential(
                    '{}_SESSION_TOKEN'.format(prefix),
                    's3_session_token'
                )

            _addCredential(
                '{}_ENDPOINT'.format(prefix),
                's3_endpoint'
            )
            _addCredential(
                '{}_V2_AUTH'.format(prefix),
                's3_v2_auth'
            )
            if data.s3_endpoint is None:
                credentials['{}_PROVIDER'.format(prefix)] = 'AWS'
            else:
                credentials['{}_PROVIDER'.format(prefix)] = 'Other'

        elif data.type == 'azureblob':
            if data.subtype == 'sas':
                _addCredential(
                    '{}_SAS_URL'.format(prefix),
                    'azure_sas_url'
                )
            else:
                _addCredential(
                    '{}_ACCOUNT'.format(prefix),
                    'azure_account'
                )
                _addCredential(
                    '{}_KEY'.format(prefix),
                    'azure_key'
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
            _addCredential(
                '{}_KEY_FILE'.format(prefix),
                'sftp_key_file',
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


    def _job_id_exists(self, job_id):
        return job_id in self._job_status


    def _obscure(self, password):
        """
        Calls `rclone obscure password` and returns the result
        """
        return self._execute(["rclone", "obscure", password])


    def _execute(self, command, env=None):
        if env is None:
            env = {}

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


def should_log_full_credential(key):
    """
    Returns true if we should log the value of the credential given the key (name) of the credential
    For robustness, prefer an allowlist over a blocklist
    """

    suffix_allowlist = [
        # generic
        '_TYPE',

        # s3
        '_REGION',
        '_ENDPOINT',
        '_V2_AUTH',

        # azureblob
        '_ACCOUNT',

        # swift
        '_USER',
        '_AUTH',
        '_TENANT',

        # google cloud storage
        '_PROJECT_NUMBER',
        '_OBJECT_ACL',
        '_BUCKET_ACL',

        # sftp
        '_HOST',
        '_PORT',
        '_USER',
        '_KEY_FILE',

        # dropbox

        # onedrive
        '_DRIVE_ID',
        '_DRIVE_TYPE',

        # webdav
        '_URL',
        '_USER',
    ]

    return any(key.endswith(suffix) for suffix in suffix_allowlist)


def should_log_partial_credential(key):
    """
    Returns true if we should log the last 4 characters the value of the credential
    given the key (name) of the credential.
    For robustness, prefer an allowlist over a blocklist
    """

    suffix_allowlist = [
        # s3
        '_ACCESS_KEY_ID',

        # google cloud storage
        '_CLIENT_ID',
    ]

    return any(key.endswith(suffix) for suffix in suffix_allowlist)



def main():
    """
    Can run as
    export MOTUZ_REGION='<add-here>'
    export MOTUZ_ACCESS_KEY_ID='<add-here>'
    export MOTUZ_SECRET_ACCESS_KEY='<add-here>'

    python -m utils.rclone_connection
    """

    import time
    import os

    class CloudConnection:
        pass

    data = CloudConnection()
    data.__dict__ = {
        'type': 's3',
        'owner': 'aicioara',
        's3_region': os.environ['MOTUZ_REGION'],
        's3_access_key_id': os.environ['MOTUZ_ACCESS_KEY_ID'],
        's3_secret_access_key': os.environ['MOTUZ_SECRET_ACCESS_KEY'],
    }

    connection = RcloneConnection()

    # result = connection.ls(data, '/motuz-test/')
    # print(result)
    # return

    import random
    import json
    id = connection.md5sum(
        data,
        'motuz-test/test/',
        'aicioara',
        random.randint(1, 10000000),
        download=True,
    )
    while not connection.hashsum_finished(id):
        print(json.dumps(connection.hashsum_text(id)))
        time.sleep(1)
    print(json.dumps(connection.hashsum_text(id)))

    # connection.copy(
    #     src_data=None, # Local
    #     src_resource_path='/tmp/motuz/mb_blob.bin',
    #     dst_data=data,
    #     dst_resource_path='/fh-ctr-mofuz-test/hello/world/{}'.format(random.randint(10, 10000)),
    # )

    # while not connection.copy_finished(job_id):
    #     print(connection.copy_percent(job_id))
    #     time.sleep(0.1)



if __name__ == '__main__':
    main()
