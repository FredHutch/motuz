import datetime

from ..application import db



class CloudConnection(db.Model):
    """ User Model for storing user related details """
    __tablename__ = "cloud_connection"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    name = db.Column(db.String)
    owner = db.Column(db.String)

    type = db.Column(db.String)

    s3_bucket = db.Column(db.String)
    s3_region = db.Column(db.String)
    s3_access_key_id = db.Column(db.String)
    s3_secret_access_key = db.Column(db.String)

    created_at = db.Column(db.DateTime, default=datetime.datetime.now)


    def __repr__(self):
        return "<Cloud Connection {}>".format(self.name)
