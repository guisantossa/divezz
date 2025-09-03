# flake8: noqa
"""add role and updated_at to memberships

Revision ID: f7a8b9c0d1e2
Revises: d4f7a1b2c3d4
Create Date: 2025-09-02 00:00:00.000000
"""

from datetime import datetime

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "f7a8b9c0d1e2"
down_revision = "d4f7a1b2c3d4"
branch_labels = None
depends_on = None


def upgrade():
    # add role (nullable)
    op.add_column(
        "memberships",
        sa.Column("role", sa.String(length=32), nullable=True),
    )

    # add updated_at nullable first
    op.add_column(
        "memberships",
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )

    # set updated_at = created_at for existing rows
    op.execute(
        "UPDATE memberships SET updated_at = created_at WHERE updated_at IS NULL"
    )

    # make updated_at NOT NULL and set server default now()
    op.alter_column(
        "memberships",
        "updated_at",
        existing_type=sa.DateTime(),
        nullable=False,
        server_default=sa.text("now()"),
    )


def downgrade():
    op.alter_column("memberships", "updated_at", nullable=True, server_default=None)
    op.drop_column("memberships", "updated_at")
    op.drop_column("memberships", "role")
