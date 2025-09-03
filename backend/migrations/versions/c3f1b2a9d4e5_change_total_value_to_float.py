"""change total_value to float

Revision ID: c3f1b2a9d4e5
Revises: 9063b316f0ea
Create Date: 2025-09-02 00:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "c3f1b2a9d4e5"
down_revision = "9063b316f0ea"
branch_labels = None
depends_on = None


def upgrade():
    # Postgres: cast integer -> double precision
    op.alter_column(
        "expenses",
        "total_value",
        type_=sa.Float(),
        postgresql_using="total_value::double precision",
        existing_type=sa.Integer(),
        nullable=False,
    )


def downgrade():
    # Revert float -> integer (may truncate fractional part)
    op.alter_column(
        "expenses",
        "total_value",
        type_=sa.Integer(),
        postgresql_using="CAST(total_value AS integer)",
        existing_type=sa.Float(),
        nullable=False,
    )
