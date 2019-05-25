import datetime

from ..application import db



class CopyJob(db.Model):
    """ User Model for storing user related details """
    __tablename__ = "copy_job"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now)

    def __repr__(self):
        return "<Copy Job '{}'>".format(self.id)

