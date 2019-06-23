import datetime
from functools import wraps
import pwd
import json

from flask import request
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

from ..config import key
from ..models import InvalidToken
from ..application import db
from ..exceptions import *
from ..utils.pam import pam


def login_user(data):
    username = data['username']
    password = data['password']

    # if username == 'aicioara2':
    #     auth_token = encode_auth_token(username)
    #     return {
    #         'status': 'success',
    #         'message': 'Successfully logged in.',
    #         'access': auth_token,
    #         'refresh': auth_token, # TODO: Make this one different
    #     }


    # TODO: remove this to avoid side-channel attacks
    try:
        pwd.getpwnam(username)
    except KeyError:
        raise HTTP_401_UNAUTHORIZED('No match for Username and Password.')

    auth_token = None

    user_authentication = pam()
    user_authentication.authenticate(username, password)

    if user_authentication.code == 0:
        auth_token = encode_auth_token(username)


    if auth_token:
        return {
            'status': 'success',
            'message': 'Successfully logged in.',
            'access': auth_token,
            'refresh': auth_token, # TODO: Make this one different
        }
    else:
        raise HTTP_401_UNAUTHORIZED('No match for Username and Password.')



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


def get_logged_in_user(new_request):
    response, status = _get_logged_in_user(request)
    return response['data']['username']


def _get_logged_in_user(new_request):
    authorization = new_request.headers.get('Authorization')
    if authorization is None:
        auth_token = None
    else:
        parts = authorization.split(' ')
        if len(parts) != 2:
            raise HTTP_401_UNAUTHORIZED('Provide Authorization header in the form `Bearer TOKEN`')
        _, auth_token = parts

    if not auth_token:
        raise HTTP_401_UNAUTHORIZED('Provide a valid auth token.')

    resp = decode_auth_token(auth_token)
    if isinstance(resp, str):
        raise HTTP_401_UNAUTHORIZED(resp)

    username = resp['username']
    response_object = {
        'status': 'success',
        'data': {
            'username': username,
        }
    }
    return response_object, 200


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



def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        data, status = _get_logged_in_user(request)
        token = data.get('data')

        if not token:
            return data, status

        return f(*args, **kwargs)

    return decorated



def admin_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        data, status = _get_logged_in_user(request)
        token = data.get('data')

        if not token:
            return data, status

        admin = token.get('admin')
        if not admin:
            response_object = {
                'status': 'fail',
                'message': 'admin token required'
            }
            return response_object, 401

        return f(*args, **kwargs)

    return decorated




def encode_auth_token(user_id):
    """
    Generates the Auth Token
    :return: string
    """
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1, seconds=5),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            key,
            algorithm='HS256'
        ).decode('utf-8')
    except Exception as e:
        return e


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
    except Exception:
        return 'Unknown exception.'
