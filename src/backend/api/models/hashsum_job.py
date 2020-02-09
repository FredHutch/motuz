import datetime

from sqlalchemy.orm import relationship, backref

from ..application import db
from ..mixins.timestamp_mixin import TimestampMixin


class HashsumJob(db.Model, TimestampMixin):
    __tablename__ = "hashsum_job"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cloud_id = db.Column(db.Integer, db.ForeignKey('cloud_connection.id'))
    resource_path = db.Column(db.String)
    owner = db.Column(db.String)

    progress_state = db.Column(db.String, nullable=True)
    progress_current = db.Column(db.Integer, nullable=True)
    progress_total = db.Column(db.Integer, nullable=True)
    progress_error = db.Column(db.String, nullable=True)
    progress_execution_time = db.Column(db.Integer, nullable=False, server_default="0")

    cloud = relationship(
        "CloudConnection",
        foreign_keys=[cloud_id],
        backref=backref("hashsum_jobs", cascade="all,delete"),
    )

    def __repr__(self):
        return "<Hashsum Job {}>".format(self.id)
