import uuid
from datetime import datetime, timedelta, timezone

import jwt

from app.config import Settings


ISSUER = "exampilot-ai-api"
AUDIENCE = "exampilot-mobile"


def require_jwt_secret(settings: Settings) -> str:
    secret = settings.jwt_secret_key
    if not secret or len(secret) < 32:
        raise RuntimeError("A secure JWT_SECRET_KEY must be configured")
    return secret


def create_access_token(user_id: uuid.UUID, settings: Settings) -> str:
    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(user_id),
        "iss": ISSUER,
        "aud": AUDIENCE,
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_minutes),
        "token_use": "access",
    }

    return jwt.encode(
        payload,
        require_jwt_secret(settings),
        algorithm="HS256",
    )


def decode_access_token(token: str, settings: Settings) -> uuid.UUID | None:
    try:
        payload = jwt.decode(
            token,
            require_jwt_secret(settings),
            algorithms=["HS256"],
            issuer=ISSUER,
            audience=AUDIENCE,
            options={"require": ["sub", "exp", "iat", "iss", "aud"]},
        )

        if payload.get("token_use") != "access":
            return None

        return uuid.UUID(payload["sub"])

    except (jwt.PyJWTError, ValueError, TypeError, KeyError):
        return None
