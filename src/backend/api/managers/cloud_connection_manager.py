import json
import uuid
import datetime

from flask import request

from ..application import db
from ..models import CloudConnection
from ..exceptions import *
from ..utils.rclone_connection import RcloneConnection
from ..managers.auth_manager import token_required, get_logged_in_user


@token_required
def list():
    owner = get_logged_in_user(request)

    cloud_connections = (CloudConnection.query
        .filter_by(owner=owner)
        .order_by(CloudConnection.id.asc())
        .all()
    )
    return cloud_connections


@token_required
def create(data):
    owner = get_logged_in_user(request)

    cloud_connection = CloudConnection(**data)
    cloud_connection.owner = owner

    db.session.add(cloud_connection)
    db.session.commit()

    return cloud_connection



@token_required
def retrieve(id):
    cloud_connection = CloudConnection.query.get(id)

    if cloud_connection is None:
        raise HTTP_404_NOT_FOUND('Cloud Connection with id {} not found'.format(id))

    owner = get_logged_in_user(request)

    if cloud_connection.owner != owner:
        raise HTTP_404_NOT_FOUND('Cloud Connection with id {} not found'.format(id))

    return cloud_connection


@token_required
def update(id, data):
    cloud_connection = retrieve(id)

    for key, value in data.items():
        setattr(cloud_connection, key, value)

    db.session.commit()
    return cloud_connection


@token_required
def delete(id):
    cloud_connection = retrieve(id)

    db.session.delete(cloud_connection)
    db.session.commit()

    return cloud_connection



@token_required
def verify(data):
    owner = get_logged_in_user(request)
    cloud_connection = CloudConnection(**data)
    cloud_connection.owner = owner

    rclone = RcloneConnection()
    return rclone.verify(cloud_connection)
