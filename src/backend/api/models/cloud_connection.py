import datetime

from ..application import db



class CloudConnection(db.Model):
    """ User Model for storing user related details """
    __tablename__ = "cloud_connection"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String)
    name = db.Column(db.String)
    bucket = db.Column(db.String)
    region = db.Column(db.String)
    access_key_id = db.Column(db.String)
    access_key_secret = db.Column(db.String)

    created_at = db.Column(db.DateTime, default=datetime.datetime.now)


    def __repr__(self):
        return "<Cloud Connection {}>".format(self.name)
