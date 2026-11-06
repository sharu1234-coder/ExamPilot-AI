from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import create_app


def test_liveness_returns_ok() -> None:
    client = TestClient(create_app())
    response = client.get("/health/live")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "exampilot-api"}


def test_readiness_fails_closed_without_exposing_details() -> None:
    with patch("app.main.database_is_ready", return_value=False):
        client = TestClient(create_app())
        response = client.get("/health/ready")
    assert response.status_code == 503
    assert response.json() == {"status": "not_ready"}


def test_readiness_succeeds_with_database() -> None:
    with patch("app.main.database_is_ready", return_value=True):
        client = TestClient(create_app())
        response = client.get("/health/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ready"}

