"""add invited_email and status to memberships

Revision ID: d4f7a1b2c3d4
Revises: c3f1b2a9d4e5
Create Date: 2025-09-02 00:00:00.000000
"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "d4f7a1b2c3d4"
down_revision = "c3f1b2a9d4e5"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "memberships",
        sa.Column("invited_email", sa.String(length=255), nullable=True),
    )
    op.add_column(
        "memberships",
        sa.Column(
            "status", sa.String(length=20), nullable=False, server_default="pending"
        ),
    )
    # optional: create index on invited_email for lookups
    op.create_index(
        op.f("ix_memberships_invited_email"),
        "memberships",
        ["invited_email"],
        unique=False,
    )


def downgrade():
    op.drop_index(op.f("ix_memberships_invited_email"), table_name="memberships")
    op.drop_column("memberships", "status")
    op.drop_column("memberships", "invited_email")
