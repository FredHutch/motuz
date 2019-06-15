from functools import wraps
import pwd
import json

from flask import request

from ..models import User, InvalidToken
from ..application import db
from ..exceptions import *
from ..utils.pam import pam


def login_user(data):
    username = data['username']
    password = data['password']

    # TODO: remove this to avoid side-channel attacks
    try:
        pwd.getpwnam(username)
    except KeyError:
        raise HTTP_401_UNAUTHORIZED('No match for Username and Password.')

    auth_token = None

    # TODO: Remove
    # Backdoor for local testing. User aicioara should not exist in AWS.
    if username == 'aicioara' and password == 'RemoveThisASAP':
        auth_token = User.encode_auth_token(username)

    user_authentication = pam()
    user_authentication.authenticate(username, password)

    if user_authentication.code == 0:
        auth_token = User.encode_auth_token(username)


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
        resp = User.decode_auth_token(auth_token)
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

        resp = User.decode_auth_token(auth_token)
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

        data, status = get_logged_in_user(request)
        token = data.get('data')

        if not token:
            return data, status

        return f(*args, **kwargs)

    return decorated



def admin_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        data, status = get_logged_in_user(request)
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
