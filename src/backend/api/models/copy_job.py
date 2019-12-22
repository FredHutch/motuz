import datetime

from sqlalchemy.orm import relationship, backref

from ..application import db
from ..mixins.timestamp_mixin import TimestampMixin
from ..models.cloud_connection import CloudConnection


class CopyJob(db.Model, TimestampMixin):
    __tablename__ = "copy_job"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String)
    src_cloud_id = db.Column(db.Integer, db.ForeignKey('cloud_connection.id'))
    src_resource_path = db.Column(db.String)
    dst_cloud_id = db.Column(db.Integer, db.ForeignKey('cloud_connection.id'))
    dst_resource_path = db.Column(db.String)
    copy_links = db.Column(db.Boolean)
    owner = db.Column(db.String)

    progress_state = db.Column(db.String, nullable=True)
    progress_current = db.Column(db.Integer, nullable=True)
    progress_total = db.Column(db.Integer, nullable=True)
    progress_error = db.Column(db.String, nullable=True)
    progress_execution_time = db.Column(db.Integer, nullable=False, server_default="0")

    src_cloud = relationship(
        "CloudConnection",
        foreign_keys=[src_cloud_id],
        backref=backref("src_copy_jobs", cascade="all,delete"),
    )
    dst_cloud = relationship(
        "CloudConnection",
        foreign_keys=[dst_cloud_id],
        backref=backref("dst_copy_jobs", cascade="all,delete"),
    )

    def __repr__(self):
        return "<Copy Job {}>".format(self.id)
