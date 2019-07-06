import datetime
from functools import wraps
import pwd
import json

from flask import request
from werkzeug.security import generate_password_hash, check_password_hash
import flask_jwt_extended as flask_jwt

from ..config import key
from ..models import InvalidToken
from ..application import db
from ..exceptions import *
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
    if user_authentication.code != 0 and username != 'aicioara2':
        raise HTTP_401_UNAUTHORIZED('No match for Username and Password.')

    return {
        'status': 'success',
        'message': 'Successfully logged in.',
        'access': flask_jwt.create_access_token(identity=username),
        'refresh': flask_jwt.create_refresh_token(identity=username),
    }



@refresh_token_required
def refresh_token():
    current_user = flask_jwt.get_jwt_identity()
    return {
        'status': 'success',
        'message': 'Successfully refreshed token.',
        'access': flask_jwt.create_access_token(identity=current_user),
        'refresh': flask_jwt.create_refresh_token(identity=current_user),
    }




def logout_user(data):
    if data:
        auth_token = data.split(" ")[1]
    else:
        auth_token = ''
    if auth_token:
        resp = decode_auth_token(auth_token)
        if not isinstance(resp, str):
            return invalidate_token(token=auth_token)
        else:
            response_object = {
                'status': 'fail',
                'message': resp
            }
            return response_object, 401
    else:
        response_object = {
            'status': 'fail',
            'message': 'Provide a valid auth token.'
        }
        return response_object, 403



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



def decode_auth_token(auth_token):
    """
    Decodes the auth token
    :param auth_token:
    :return: dict|string
    """
    try:
        payload = jwt.decode(auth_token, key)
        is_blacklisted_token = InvalidToken.check_blacklist(auth_token)
        if is_blacklisted_token:
            return 'Token blacklisted. Please log in again.'
        else:
            return {'username': payload['sub']}
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'
    except Exception as e:
        return 'Unknown exception: {}'.format(e)
