"""add role to memberships

Revision ID: e1f2a3b4c5d6
Revises: d4f7a1b2c3d4
Create Date: 2025-09-02 00:00:00.000000
"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "e1f2a3b4c5d6"
down_revision = "d4f7a1b2c3d4"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "memberships",
        sa.Column("role", sa.String(length=32), nullable=True),
    )


def downgrade():
    op.drop_column("memberships", "role")
