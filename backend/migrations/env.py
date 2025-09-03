from __future__ import annotations

import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# allow importing app package
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT_DIR)

# this is the Alembic Config object, which provides access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Try to load .env if present (optional dependency: python-dotenv)
try:
    from dotenv import load_dotenv  # type: ignore

    dotenv_path = os.path.join(ROOT_DIR, ".env")
    if os.path.exists(dotenv_path):
        load_dotenv(dotenv_path)
except Exception:
    # python-dotenv not installed or .env missing — continue
    pass

# Import your SQLAlchemy Base metadata here and force import of all models so metadata is populated.
try:
    from app.db.base import Base  # type: ignore

    # Force-import model modules to ensure their Table objects are registered on Base.metadata.
    # Adjust module names if your models live elsewhere.
    try:
        import app.db.models.user  # noqa: F401
    except Exception as e:
        print("Warning importing app.db.models.user:", e)
    try:
        import app.db.models.group  # noqa: F401
    except Exception as e:
        print("Warning importing app.db.models.group:", e)
    try:
        import app.db.models.membership  # noqa: F401
    except Exception as e:
        print("Warning importing app.db.models.membership:", e)
    try:
        import app.db.models.expense  # noqa: F401
    except Exception as e:
        print("Warning importing app.db.models.expense:", e)
    try:
        import app.db.models.payment  # noqa: F401
    except Exception as e:
        print("Warning importing app.db.models.payment:", e)
    try:
        import app.db.models.settlement  # noqa: F401
    except Exception as e:
        print("Warning importing app.db.models.settlement:", e)

    target_metadata = Base.metadata
except Exception as exc:
    target_metadata = None
    print("Warning: could not import Base.metadata from app.db.base:", exc)


def get_url() -> str:
    # Prefer explicit config in app/core/config if available
    try:
        from app.core.config import DATABASE_URL  # type: ignore

        if DATABASE_URL:
            return DATABASE_URL
    except Exception:
        pass

    # Then environment variable (possibly loaded from .env above)
    env_url = os.environ.get("DATABASE_URL")
    if env_url:
        return env_url

    # Fallback default (change if needed)
    return "postgresql://postgres:password@localhost:5432/splitwise"


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    configuration = config.get_section(config.config_ini_section) or {}
    configuration["sqlalchemy.url"] = get_url()

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
