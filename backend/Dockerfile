FROM python:3.11-slim

# Prevent Python from writing .pyc files and enable stdout/stderr without buffering
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_HOME="/opt/poetry" \
    PATH="/opt/poetry/bin:$PATH"

WORKDIR /app

# system deps required to build some wheels
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
  && rm -rf /var/lib/apt/lists/*

# install Poetry
RUN curl -sSL https://install.python-poetry.org | python -

# copy lock files first to leverage layer cache
COPY pyproject.toml poetry.lock* /app/

# install dependencies (no dev)
RUN poetry install --no-interaction --no-ansi --no-dev

# copy application code
COPY . /app

# expose uvicorn port
EXPOSE 8000

# run the app via poetry (do not use --reload in production)
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]