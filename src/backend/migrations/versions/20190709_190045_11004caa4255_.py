"""empty message

Revision ID: 11004caa4255
Revises: 847966058a76
Create Date: 2019-07-09 19:00:45.850152

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '11004caa4255'
down_revision = '847966058a76'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('copy_job', 'src_resource', new_column_name='src_resource_path')
    op.alter_column('copy_job', 'dst_path', new_column_name='dst_resource_path')


def downgrade():
    op.alter_column('copy_job', 'src_resource_path', new_column_name='src_resource')
    op.alter_column('copy_job', 'dst_resource_path', new_column_name='dst_path')
