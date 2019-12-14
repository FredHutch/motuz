"""empty message

Revision ID: f67d1772b513
Revises: 62d05dee22b9
Create Date: 2019-12-11 20:20:54.151790

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f67d1772b513'
down_revision = '62d05dee22b9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('cloud_connection', sa.Column('dropbox_token', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('cloud_connection', 'dropbox_token')
    # ### end Alembic commands ###