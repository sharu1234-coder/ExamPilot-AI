import pytest
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import AuthIdentity, Base, User


def make_test_engine():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(engine)
    return engine


def test_email_uniqueness_is_case_insensitive():
    engine = make_test_engine()

    with Session(engine) as session:
        session.add(User(
            email="Student@Example.com",
            password_hash="test-hash",
        ))
        session.commit()

        session.add(User(
            email="student@example.com",
            password_hash="another-hash",
        ))

        with pytest.raises(IntegrityError):
            session.commit()

        session.rollback()

    engine.dispose()


def test_google_identity_cannot_be_duplicated():
    engine = make_test_engine()

    with Session(engine) as session:
        first_user = User(email="first@example.com")
        second_user = User(email="second@example.com")

        session.add_all([first_user, second_user])
        session.flush()

        session.add(AuthIdentity(
            user_id=first_user.id,
            provider="google",
            provider_subject="google-user-123",
        ))
        session.commit()

        session.add(AuthIdentity(
            user_id=second_user.id,
            provider="google",
            provider_subject="google-user-123",
        ))

        with pytest.raises(IntegrityError):
            session.commit()

        session.rollback()

    engine.dispose()
