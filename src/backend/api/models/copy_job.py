import datetime

from ..application import db



class CopyJob(db.Model):
    """ User Model for storing user related details """
    __tablename__ = "copy_job"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now)
    src_cloud = db.Column(db.String)
    src_resource = db.Column(db.String)
    dst_cloud = db.Column(db.String)
    dst_path = db.Column(db.String)
    owner = db.Column(db.String)

    status = db.Column(db.String, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)


    def __repr__(self):
        return "<Copy Job {}>".format(self.id)

