import datetime

from ..application import db



class CloudConnection(db.Model):
    __tablename__ = "cloud_connection"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    name = db.Column(db.String)
    owner = db.Column(db.String)

    type = db.Column(db.String)
    bucket = db.Column(db.String, nullable=True)

    # S3 fields
    s3_access_key_id = db.Column(db.String, nullable=True)
    s3_secret_access_key = db.Column(db.String, nullable=True)
    s3_region = db.Column(db.String, nullable=True)

    # S3 compatible fields
    s3_endpoint = db.Column(db.String, nullable=True)
    s3_v2_auth = db.Column(db.String, nullable=True)

    # Azure fields
    azure_account = db.Column(db.String, nullable=True)
    azure_key = db.Column(db.String, nullable=True)
    azure_sas_url = db.Column(db.String, nullable=True)

    # Swift V1 fields
    swift_user = db.Column(db.String, nullable=True)
    swift_key = db.Column(db.String, nullable=True)
    swift_auth = db.Column(db.String, nullable=True)

    # Swift V2 additional fields
    swift_tenant = db.Column(db.String, nullable=True)

    # Google Cloud Services fields
    gcp_client_id = db.Column(db.String, nullable=True)
    gcp_service_account_credentials = db.Column(db.String, nullable=True)
    gcp_project_number = db.Column(db.String, nullable=True)
    gcp_object_acl = db.Column(db.String, nullable=True)
    gcp_bucket_acl = db.Column(db.String, nullable=True)

    # SFTP
    sftp_host = db.Column(db.String, nullable=True)
    sftp_port = db.Column(db.String, nullable=True)
    sftp_user = db.Column(db.String, nullable=True)
    sftp_pass = db.Column(db.String, nullable=True)
    sftp_key_file = db.Column(db.String, nullable=True)

    # Dropbox
    dropbox_token = db.Column(db.String, nullable=True)

    # Microsoft OneDrive
    onedrive_token = db.Column(db.String, nullable=True)
    onedrive_drive_id = db.Column(db.String, nullable=True)
    onedrive_drive_type = db.Column(db.String, nullable=True)

    # WebDAV
    webdav_url = db.Column(db.String, nullable=True)
    webdav_user = db.Column(db.String, nullable=True)
    webdav_pass = db.Column(db.String, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.datetime.now)


    def __repr__(self):
        return "<Cloud Connection {} ({})>".format(self.name, self.type)
