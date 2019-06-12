import datetime

from flask_restplus import Namespace, fields

from ..application import db
from ..mixins.timestamp_mixin import TimestampMixin


class CopyJob(db.Model, TimestampMixin):
    """ User Model for storing user related details """
    __tablename__ = "copy_job"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String)
    src_cloud = db.Column(db.String)
    src_resource = db.Column(db.String)
    dst_cloud = db.Column(db.String)
    dst_path = db.Column(db.String)
    owner = db.Column(db.String)

    progress_state = db.Column(db.String, nullable=True)
    progress_current = db.Column(db.Integer, nullable=True)
    progress_total = db.Column(db.Integer, nullable=True)
    progress_error = db.Column(db.String, nullable=True)


    def __repr__(self):
        return "<Copy Job {}>".format(self.id)



class CopyJobSerializer:
    api = Namespace('copy-jobs', description='CopyJob related operations')
    dto = api.model('copy-job', {
        'id': fields.Integer(readonly=True, example=1234),
        'description': fields.String(required=True, example='Task Description'),
        'src_cloud': fields.String(required=True, example='localhost'),
        'src_resource': fields.String(required=True, example='/tmp'),
        'dst_cloud': fields.String(required=True, example='localhost'),
        'dst_path': fields.String(required=True, example='/trash'),
        'owner': fields.String(required=True, example='owner'),

        'progress_state': fields.String(readonly=True, example='PENDING'),
        'progress_current': fields.Integer(readonly=True, example=45),
        'progress_total': fields.Integer(readonly=True, example=100),
        'progress_error': fields.String(readonly=True),
    })
