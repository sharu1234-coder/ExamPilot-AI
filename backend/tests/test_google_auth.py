from unittest.mock import patch

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.config import Settings, get_settings
from app.database import get_db
from app.google_identity import GoogleIdentity, verify_google_identity
from app.main import create_app
from app.models import AuthIdentity, Base, User
from app.schemas import GoogleTokenRequest


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
        google_web_client_id="test-client.apps.googleusercontent.com",
    )

    identity = {
        "value": GoogleIdentity(
            subject="google-subject-123",
            email="google@example.com",
            full_name="Google Student",
        )
    }

    def override_get_db():
        with Session(engine) as session:
            yield session

    def override_google_identity():
        return identity["value"]

    app = create_app()
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_settings] = lambda: settings
    app.dependency_overrides[verify_google_identity] = (
        override_google_identity
    )

    with TestClient(app) as client:
        yield client, engine, identity

    engine.dispose()


def sign_in(client):
    return client.post(
        "/api/v1/auth/google",
        json={"id_token": "mock-google-id-token-for-tests"},
    )


def test_google_creates_student_account(environment):
    client, engine, _ = environment

    response = sign_in(client)

    assert response.status_code == 200, response.text
    assert response.json()["access_token"]

    with Session(engine) as session:
        user = session.scalar(select(User))
        identity = session.scalar(select(AuthIdentity))

        assert user.email == "google@example.com"
        assert user.password_hash is None
        assert user.email_verified is True
        assert identity.user_id == user.id
        assert identity.provider_subject == "google-subject-123"


def test_repeat_google_login_reuses_same_account(environment):
    client, engine, _ = environment

    assert sign_in(client).status_code == 200
    assert sign_in(client).status_code == 200

    with Session(engine) as session:
        assert session.scalar(
            select(func.count()).select_from(User)
        ) == 1
        assert session.scalar(
            select(func.count()).select_from(AuthIdentity)
        ) == 1


def test_existing_password_account_is_not_auto_linked(environment):
    client, engine, _ = environment

    with Session(engine) as session:
        session.add(
            User(
                email="google@example.com",
                password_hash="existing-password-hash",
            )
        )
        session.commit()

    response = sign_in(client)

    assert response.status_code == 409

    with Session(engine) as session:
        assert session.scalar(
            select(func.count()).select_from(AuthIdentity)
        ) == 0


def test_different_google_subject_cannot_take_existing_email(environment):
    client, engine, identity = environment

    assert sign_in(client).status_code == 200

    identity["value"] = GoogleIdentity(
        subject="different-google-subject",
        email="google@example.com",
        full_name="Another Account",
    )

    assert sign_in(client).status_code == 409


def test_disabled_google_user_cannot_login(environment):
    client, engine, _ = environment

    assert sign_in(client).status_code == 200

    with Session(engine) as session:
        user = session.scalar(select(User))
        user.is_active = False
        session.commit()

    assert sign_in(client).status_code == 401


def test_google_verifier_accepts_valid_claims():
    settings = Settings(
        google_web_client_id="test-client.apps.googleusercontent.com"
    )

    verified_claims = {
        "sub": "google-subject-123",
        "email": "Google@Example.com",
        "email_verified": True,
        "name": "Google Student",
    }

    with patch(
        "app.google_identity.id_token.verify_oauth2_token",
        return_value=verified_claims,
    ) as verifier:
        identity = verify_google_identity(
            GoogleTokenRequest(id_token="mock-token-for-unit-testing"),
            settings,
        )

    assert identity.subject == "google-subject-123"
    assert identity.email == "google@example.com"
    assert identity.full_name == "Google Student"
    assert verifier.call_args.args[2] == settings.google_web_client_id


def test_google_verifier_rejects_invalid_token():
    settings = Settings(
        google_web_client_id="test-client.apps.googleusercontent.com"
    )

    with patch(
        "app.google_identity.id_token.verify_oauth2_token",
        side_effect=ValueError("Invalid signature or audience"),
    ):
        with pytest.raises(HTTPException) as error:
            verify_google_identity(
                GoogleTokenRequest(id_token="invalid-google-token-for-test"),
                settings,
            )

    assert error.value.status_code == 401


def test_google_verifier_rejects_unverified_email():
    settings = Settings(
        google_web_client_id="test-client.apps.googleusercontent.com"
    )

    with patch(
        "app.google_identity.id_token.verify_oauth2_token",
        return_value={
            "sub": "google-subject-123",
            "email": "google@example.com",
            "email_verified": False,
        },
    ):
        with pytest.raises(HTTPException) as error:
            verify_google_identity(
                GoogleTokenRequest(id_token="mock-token-for-unit-testing"),
                settings,
            )

    assert error.value.status_code == 401


def test_google_verifier_requires_configuration():
    settings = Settings(google_web_client_id=None)

    with pytest.raises(HTTPException) as error:
        verify_google_identity(
            GoogleTokenRequest(id_token="mock-token-for-unit-testing"),
            settings,
        )

    assert error.value.status_code == 503
