import json
import uuid
import datetime

from ..application import db
from ..models import CloudConnection
from ..exceptions import *



def list():
    cloud_connections = CloudConnection.query.all()
    return cloud_connections



def create(data):
    cloud_connection = CloudConnection(**data)
    _save_changes(cloud_connection)

    return cloud_connection



def retrieve(id):
    cloud_connection = CloudConnection.query.get(id)

    if cloud_connection is None:
        raise HTTP_404_NOT_FOUND()

    return cloud_connection



def _save_changes(data):
    db.session.add(data)
    db.session.commit()


