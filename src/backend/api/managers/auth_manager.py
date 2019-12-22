import logging
import datetime
import time
from functools import wraps

from sqlalchemy.exc import IntegrityError
import flask_jwt_extended as flask_jwt

from ..models import RevokedToken
from ..application import db, jwt
from ..utils.pam import pam
from ..exceptions import *



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



@jwt.token_in_blacklist_loader
def _check_if_token_in_blacklist(token):
    """
    This function is automatically loaded and it does not need to be called.
    https://flask-jwt-extended.readthedocs.io/en/stable/blacklist_and_token_revoking/
    """
    return token_is_revoked(token)



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
    token = flask_jwt.get_raw_jwt()
    message = revoke_token(token)
    clean_token_database()
    return message



def revoke_token(token):
    try:
        revoked_token = RevokedToken(
            jti=token['jti'],
            type=token['type'],
            identity=token['identity'],
            exp=token['exp'],
        )
        db.session.add(revoked_token)
        db.session.commit()
        return {
            'status': 'success',
            'message': 'Successfully logged out.',
        }
    except IntegrityError as e:
        return {
            'status': 'fail',
            'message': 'Already logged out',
        }
    except Exception as e:
        return {
            'status': 'fail',
            'message': str(e),
        }



def token_is_revoked(token):
    """
    Check whether auth token has been blacklisted
    """
    if 'jti' not in token:
        return True

    res = RevokedToken.query.filter_by(jti=str(token['jti'])).first()
    if res:
        return True
    else:
        return False



def clean_token_database():
    now_ts = int(time.time())

    try:
        # Opting for this version for performance (single round-trip)
        query = RevokedToken.__table__.delete().where(RevokedToken.exp < now_ts)
        db.session.execute(query)
        db.session.commit()
    except Exception as e:
        logging.error("Could not clean up the token database")
        logging.exception(e)
