import datetime

from ..application import db



class CloudConnection(db.Model):
    """ User Model for storing user related details """
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


    created_at = db.Column(db.DateTime, default=datetime.datetime.now)


    def __repr__(self):
        return "<Cloud Connection {} ({})>".format(self.name, self.type)
