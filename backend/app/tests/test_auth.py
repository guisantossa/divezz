from app.api.v1.routers.auth import router as auth_router
from app.core.config import settings
from app.db.session import get_db
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(settings.DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()
app.include_router(auth_router)


@app.dependency_overrides[get_db]
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


client = TestClient(app)


def test_register_user():
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "password"},
    )
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"


def test_login_user():
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "password"},
    )
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "test@example.com", "password": "password"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_invalid_user():
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "invalid@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"
