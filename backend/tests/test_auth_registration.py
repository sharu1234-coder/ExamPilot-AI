import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.database import get_db
from app.main import create_app
from app.models import Base


@pytest.fixture
def client():
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)

    def override_get_db():
        with Session(engine) as session:
            yield session

    app = create_app()
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    engine.dispose()


def test_student_registration(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "Student@Example.com",
            "password": "SecureStudentPassword@2026",
            "full_name": "Test Student",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "student@example.com"
    assert data["full_name"] == "Test Student"
    assert data["email_verified"] is False
    assert "password" not in data
    assert "password_hash" not in data


def test_duplicate_email_is_rejected(client):
    payload = {
        "email": "student@example.com",
        "password": "SecureStudentPassword@2026",
        "full_name": "Test Student",
    }

    first = client.post("/api/v1/auth/register", json=payload)
    assert first.status_code == 201

    payload["email"] = "STUDENT@example.com"
    second = client.post("/api/v1/auth/register", json=payload)

    assert second.status_code == 409


def test_weak_password_is_rejected(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "student@example.com",
            "password": "123",
            "full_name": "Test Student",
        },
    )

    assert response.status_code == 422
