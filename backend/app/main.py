from __future__ import annotations

import typing as t

from app.api.v1 import router
from app.core.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


# ensure ALLOW_ORIGINS is a list[str] — allow comma-separated string in .env
def parse_allow_origins(value: t.Union[str, t.List[str], None]) -> t.List[str]:
    if not value:
        return []
    if isinstance(value, list):
        return value
    # split comma-separated string and strip
    return [v.strip() for v in value.split(",") if v.strip()]


allowed_origins = parse_allow_origins(settings.ALLOW_ORIGINS)
# for local dev you can use ["*"] if needed, but prefer explicit origins
print("CORS allow_origins =", allowed_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "healthy"}


app.include_router(router, prefix="/api/v1")
