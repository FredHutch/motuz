"""empty message

Revision ID: 80ce05699ec9
Revises: ea775e9f7dc2
Create Date: 2019-07-03 17:08:27.640151

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '80ce05699ec9'
down_revision = 'ea775e9f7dc2'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('cloud_connection', 'bucket', nullable=True, new_column_name='s3_bucket')
    op.alter_column('cloud_connection', 'region', nullable=True, new_column_name='s3_region')
    op.alter_column('cloud_connection', 'access_key_id', nullable=True, new_column_name='s3_access_key_id')
    op.alter_column('cloud_connection', 'access_key_secret', nullable=True, new_column_name='s3_secret_access_key')


def downgrade():
    op.alter_column('cloud_connection', 's3_bucket', nullable=True, new_column_name='bucket')
    op.alter_column('cloud_connection', 's3_region', nullable=True, new_column_name='region')
    op.alter_column('cloud_connection', 's3_access_key_id', nullable=True, new_column_name='access_key_id')
    op.alter_column('cloud_connection', 's3_secret_access_key', nullable=True, new_column_name='access_key_secret')
