from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from google.auth.exceptions import GoogleAuthError
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from pydantic import EmailStr, TypeAdapter, ValidationError
from requests.exceptions import RequestException

from app.config import Settings, get_settings
from app.schemas import GoogleTokenRequest


@dataclass(frozen=True)
class GoogleIdentity:
    subject: str
    email: str
    full_name: str | None


def verify_google_identity(
    payload: GoogleTokenRequest,
    settings: Settings = Depends(get_settings),
) -> GoogleIdentity:
    if not settings.google_web_client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google Sign-In is not configured",
        )

    try:
        claims = id_token.verify_oauth2_token(
            payload.id_token,
            Request(),
            settings.google_web_client_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google ID token",
        ) from exc
    except (GoogleAuthError, RequestException) as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google authentication temporarily unavailable",
        ) from exc

    subject = claims.get("sub")

    if (
        not isinstance(subject, str)
        or not subject
        or len(subject) > 255
        or claims.get("email_verified") is not True
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account verification failed",
        )

    try:
        email = TypeAdapter(EmailStr).validate_python(
            claims.get("email")
        ).strip().lower()
    except (ValidationError, TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account email is invalid",
        ) from exc

    name = claims.get("name")
    full_name = (
        name.strip()[:150]
        if isinstance(name, str) and name.strip()
        else None
    )

    return GoogleIdentity(
        subject=subject,
        email=email,
        full_name=full_name,
    )
