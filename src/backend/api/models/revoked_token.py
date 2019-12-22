import datetime

from ..application import db


class RevokedToken(db.Model):
    """
    Token Model for storing revoked JWT tokens
    """
    __tablename__ = 'revoked_token'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    jti = db.Column(db.String, unique=True, nullable=False)
    type = db.Column(db.String, nullable=False)
    identity = db.Column(db.String, nullable=False)
    exp = db.Column(db.DateTime, nullable=False)

    def __init__(self, jti, exp, type):
        self.jti = jti
        self.exp = exp
        self.identity = identity
        self.type = type

    def __repr__(self):
        return '<jti: {}>'.format(self.jti)
