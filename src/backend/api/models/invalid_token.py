import datetime

from ..application import db


class InvalidToken(db.Model):
    """
    Token Model for storing JWT tokens
    """
    __tablename__ = 'invalid_token'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    blacklisted_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, token):
        self.token = token
        self.blacklisted_on = datetime.datetime.now()

    def __repr__(self):
        return '<token: {}>'.format(self.token)

    @staticmethod
    def check_blacklist(auth_token):
        """
        Check whether auth token has been blacklisted
        """
        res = InvalidToken.query.filter_by(token=str(auth_token)).first()
        if res:
            return True
        else:
            return False
