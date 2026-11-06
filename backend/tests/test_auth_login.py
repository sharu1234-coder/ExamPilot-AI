from datetime import datetime, timedelta, timezone

import jwt
import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.config import Settings, get_settings
from app.database import get_db
from app.main import create_app
from app.models import Base, User
from app.tokens import AUDIENCE, ISSUER


PASSWORD = "SecureStudentPassword@2026"


@pytest.fixture
def environment():
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)

    settings = Settings(
        jwt_secret_key="test-only-secret-key-with-more-than-32-characters",
        access_token_minutes=15,
    )

    def override_get_db():
        with Session(engine) as session:
            yield session

    app = create_app()
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_settings] = lambda: settings

    with TestClient(app) as client:
        yield client, engine, settings

    engine.dispose()


def register(client, email="student@example.com"):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": PASSWORD,
            "full_name": "Test Student",
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


def login(client, email="student@example.com", password=PASSWORD):
    return client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )


def test_registration_login_and_profile(environment):
    client, _, _ = environment
    user = register(client)

    response = login(client)
    assert response.status_code == 200, response.text

    token = response.json()["access_token"]
    assert response.json()["token_type"] == "bearer"

    profile = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert profile.status_code == 200
    assert profile.json()["id"] == user["id"]
    assert profile.json()["email"] == "student@example.com"
    assert "password_hash" not in profile.json()


def test_wrong_password_is_rejected(environment):
    client, _, _ = environment
    register(client)

    response = login(client, password="IncorrectPassword123")
    assert response.status_code == 401


def test_unknown_email_is_rejected(environment):
    client, _, _ = environment

    response = login(client, email="unknown@example.com")
    assert response.status_code == 401


def test_profile_requires_authentication(environment):
    client, _, _ = environment

    response = client.get("/api/v1/users/me")
    assert response.status_code == 401


def test_invalid_token_is_rejected(environment):
    client, _, _ = environment
    register(client)

    response = client.get(
        "/api/v1/users/me",
        headers={"Authorization": "Bearer invalid.jwt.token"},
    )

    assert response.status_code == 401


def test_expired_token_is_rejected(environment):
    client, _, settings = environment
    user = register(client)

    now = datetime.now(timezone.utc)

    expired_token = jwt.encode(
        {
            "sub": user["id"],
            "iss": ISSUER,
            "aud": AUDIENCE,
            "iat": now - timedelta(minutes=30),
            "exp": now - timedelta(minutes=15),
            "token_use": "access",
        },
        settings.jwt_secret_key,
        algorithm="HS256",
    )

    response = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {expired_token}"},
    )

    assert response.status_code == 401


def test_disabled_account_is_rejected(environment):
    client, engine, _ = environment
    register(client)

    response = login(client)
    assert response.status_code == 200
    token = response.json()["access_token"]

    with Session(engine) as session:
        user = session.scalar(
            select(User).where(User.email == "student@example.com")
        )
        user.is_active = False
        session.commit()

    profile = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert profile.status_code == 401
    assert login(client).status_code == 401


def test_google_only_account_cannot_use_password(environment):
    client, engine, _ = environment

    with Session(engine) as session:
        session.add(
            User(
                email="google@example.com",
                password_hash=None,
                email_verified=True,
            )
        )
        session.commit()

    response = login(client, email="google@example.com")
    assert response.status_code == 401


def test_user_token_returns_only_own_profile(environment):
    client, _, _ = environment

    first = register(client, "first@example.com")
    second = register(client, "second@example.com")

    response = login(client, email="first@example.com")
    assert response.status_code == 200

    token = response.json()["access_token"]

    profile = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert profile.status_code == 200
    assert profile.json()["id"] == first["id"]
    assert profile.json()["id"] != second["id"]
