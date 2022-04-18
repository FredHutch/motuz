from sqlalchemy.orm import relationship, backref

from ..application import db
from ..mixins.timestamp_mixin import TimestampMixin


class HashsumJob(db.Model, TimestampMixin):
    __tablename__ = "hashsum_job"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    src_cloud_id = db.Column(db.Integer, db.ForeignKey('cloud_connection.id'))
    src_resource_path = db.Column(db.String)
    dst_cloud_id = db.Column(db.Integer, db.ForeignKey('cloud_connection.id'))
    dst_resource_path = db.Column(db.String)

    # Options
    option_download = db.Column(db.Boolean, nullable=False, server_default="f")
    notification_email = db.Column(db.String)

    owner = db.Column(db.String)

    progress_state = db.Column(db.String, nullable=True)
    progress_current = db.Column(db.Integer, nullable=True)
    progress_total = db.Column(db.Integer, nullable=True)
    progress_execution_time = db.Column(db.Integer, nullable=False, server_default="0")
    progress_error = db.Column(db.String, nullable=True)

    progress_src_tree = db.Column(db.String, nullable=True, server_default="[]")
    progress_dst_tree = db.Column(db.String, nullable=True, server_default="[]")
    progress_src_error = db.Column(db.String, nullable=True)
    progress_dst_error = db.Column(db.String, nullable=True)

    src_cloud = relationship(
        "CloudConnection",
        foreign_keys=[src_cloud_id],
        backref=backref("src_hashsum_jobs", cascade="all,delete"),
    )

    dst_cloud = relationship(
        "CloudConnection",
        foreign_keys=[dst_cloud_id],
        backref=backref("dst_hashsum_jobs", cascade="all,delete"),
    )

    def __repr__(self):
        return "<Hashsum Job {}>".format(self.id)
