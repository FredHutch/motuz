import datetime

from flask_restplus import Namespace, fields

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
        'progress': fields.Nested(api.model('copy-job-progress', {
            'state': fields.String(example='PENDING'),
            'current': fields.Integer(example=45),
            'total': fields.Integer(example=100),
            'status': fields.String(),
            'error': fields.String(),
        }), readonly=True),
    })
