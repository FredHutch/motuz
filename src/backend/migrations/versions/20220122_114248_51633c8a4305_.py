"""add column

Revision ID: 51633c8a4305
Revises: 1d453219803e
Create Date: 2022-01-22 11:42:48.734440

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '51633c8a4305'
down_revision = '1d453219803e'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('cloud_connection', sa.Column('s3_session_token', sa.String(), nullable=True))


def downgrade():
    op.drop_column('cloud_connection', 's3_session_token')
