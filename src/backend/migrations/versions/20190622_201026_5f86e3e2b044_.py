"""empty message

Revision ID: 5f86e3e2b044
Revises: 4a40191fc890
Create Date: 2019-06-22 20:10:26.664893

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5f86e3e2b044'
down_revision = '4a40191fc890'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('cloud_connection', sa.Column('owner', sa.String(), server_default='legacy', nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('cloud_connection', 'owner')
    # ### end Alembic commands ###
