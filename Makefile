# Makefile

.PHONY: install run migrate test

install:
	pip install -r backend/requirements.txt

run:
	uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

migrate:
	alembic upgrade head

test:
	pytest backend/app/tests