import uuid
import datetime

from ..application import db
from ..models import User


def create(data):
    return {}, 200
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        new_user = User(
            public_id=str(uuid.uuid4()),
            email=data['email'],
            username=data['username'],
            password=data['password'],
            registered_on=datetime.datetime.utcnow()
        )
        save_changes(new_user)
        return generate_token(new_user)
    else:
        response_object = {
            'status': 'fail',
            'message': 'User already exists. Please Log in.',
        }
        return response_object, 409


def list():
    return []
    return User.query.all()


def retrieve(id):
    return {}
    return User.query.filter_by(id=id).first()


def save_changes(data):
    db.session.add(data)
    db.session.commit()


