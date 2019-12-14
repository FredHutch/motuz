"""empty message

Revision ID: 749eb9900744
Revises: be6b24ca2267
Create Date: 2019-12-14 13:46:14.013477

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '749eb9900744'
down_revision = 'be6b24ca2267'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('cloud_connection', sa.Column('onedrive_drive_id', sa.String(), nullable=True))
    op.add_column('cloud_connection', sa.Column('onedrive_drive_type', sa.String(), nullable=True))
    op.add_column('cloud_connection', sa.Column('onedrive_token', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('cloud_connection', 'onedrive_token')
    op.drop_column('cloud_connection', 'onedrive_drive_type')
    op.drop_column('cloud_connection', 'onedrive_drive_id')
    # ### end Alembic commands ###