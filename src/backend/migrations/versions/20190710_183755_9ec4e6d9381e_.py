"""empty message

Revision ID: 9ec4e6d9381e
Revises: 11004caa4255
Create Date: 2019-07-10 18:37:55.417211

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9ec4e6d9381e'
down_revision = '11004caa4255'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('cloud_connection', 's3_bucket', new_column_name='bucket')


def downgrade():
    op.alter_column('cloud_connection', 'bucket', new_column_name='s3_bucket')
