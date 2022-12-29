"""empty message

Revision ID: 8fe5bba87f26
Revises: 1d453219803e
Create Date: 2022-07-13 10:18:07.463698

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8fe5bba87f26'
down_revision = '1d453219803e'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('hashsum_job', sa.Column('hpc_job_id', sa.String(), nullable=True))
    op.add_column('copy_job', sa.Column('hpc_job_id', sa.String(), nullable=True))


def downgrade():
    op.drop_column('hashsum_job', 'hpc_job_id')
    op.drop_column('copy_job', 'hpc_job_id')
