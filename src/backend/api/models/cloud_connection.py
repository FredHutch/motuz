import datetime

from flask_restplus import Namespace, fields

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
    owner = db.Column(db.String)

    created_at = db.Column(db.DateTime, default=datetime.datetime.now)


    def __repr__(self):
        return "<Cloud Connection {}>".format(self.name)



class CloudConnectionSerializer:
    api = Namespace('connections', description='Connection related operations')
    dto = api.model('connection', {
        'id': fields.Integer(readonly=True, example=1),
        'type': fields.String(required=True, example='S3'),
        'name': fields.String(required=True, example='arbitrary-unique-name'),
        'bucket': fields.String(required=True, example='my-bucket-name'),
        'region': fields.String(required=True, example='us-west-2'),
        'access_key_id': fields.String(required=True, example='KJRHJKHWEIUJDSJKDC2J'),
        'access_key_secret': fields.String(required=True, example='jksldASDLASdak+asdSDASDKjasldkjadASDAasd'),
        # access_key examples above have the correct length, but characters are made up
    })

