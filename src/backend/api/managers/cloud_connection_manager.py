import json
import uuid
import datetime

from ..application import db
from ..models import CloudConnection
from ..exceptions import *
from ..managers.auth_manager import token_required


@token_required
def list():
    cloud_connections = CloudConnection.query.all()
    return cloud_connections


@token_required
def create(data):
    cloud_connection = CloudConnection(**data)

    db.session.add(cloud_connection)
    db.session.commit()

    return cloud_connection


@token_required
def retrieve(id):
    cloud_connection = CloudConnection.query.get(id)

    if cloud_connection is None:
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
