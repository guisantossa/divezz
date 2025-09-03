import os
import sys

from app.db.base import Base

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT)


# force-import all models
try:
    import app.db.models  # noqa: F401
except Exception as e:
    print("Import models error:", e)

print("Metadata tables:", sorted(Base.metadata.tables.keys()))
print("Mapped classes:", [m.class_.__name__ for m in Base.registry.mappers])
