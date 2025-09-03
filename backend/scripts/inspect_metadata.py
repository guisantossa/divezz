import os
import sys

import sqlalchemy as sa
from app.db.base import Base

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT)

# try to load .env if present (optional dependency)
try:
    from dotenv import load_dotenv  # type: ignore

    dotenv_path = os.path.join(ROOT, ".env")
    if os.path.exists(dotenv_path):
        load_dotenv(dotenv_path)
except Exception:
    pass


# force import models and report import issues
models = ("user", "group", "membership", "expense", "payment", "settlement")
for m in models:
    try:
        __import__(f"app.db.models.{m}")
    except Exception as e:
        print(f"Import warning for {m}: {e}")

tables = sorted(list(Base.metadata.tables.keys()))
print("Tables registered in metadata:", tables)

# Require DATABASE_URL from environment (no default)
db_url = os.environ.get("DATABASE_URL")
if not db_url:
    print(
        "ERROR: DATABASE_URL is not set in the environment. Please set it or add it to .env"
    )
    sys.exit(1)

print("Using DATABASE_URL:", db_url)
try:
    eng = sa.create_engine(db_url)
    with eng.connect() as conn:
        print("DB connection OK")
except Exception as e:
    print("DB connection error:", e)
    sys.exit(2)
