from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import RegisterRequest, UserResponse
from app.security import hash_password


from app.config import Settings, get_settings
from app.schemas import LoginRequest, AccessTokenResponse
from app.security import verify_password
from app.tokens import create_access_token

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
):
    email = str(payload.email).strip().lower()

    existing_user = db.scalar(
        select(User.id).where(
            func.lower(User.email) == email
        )
    )

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Unable to register this email address",
        )

    user = User(
        email=email,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name.strip(),
        email_verified=False,
    )

    db.add(user)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Unable to register this email address",
        )

    db.refresh(user)
    return user


@router.post("/login", response_model=AccessTokenResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    email = str(payload.email).strip().lower()

    user = db.scalar(
        select(User).where(func.lower(User.email) == email)
    )

    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if user is None or user.password_hash is None or not user.is_active:
        raise invalid_credentials

    if not verify_password(payload.password, user.password_hash):
        raise invalid_credentials

    token = create_access_token(user.id, settings)

    return AccessTokenResponse(
        access_token=token,
        expires_in=settings.access_token_minutes * 60,
    )


from app.google_identity import GoogleIdentity, verify_google_identity
from app.models import AuthIdentity


@router.post("/google", response_model=AccessTokenResponse)
def google_login(
    identity: GoogleIdentity = Depends(verify_google_identity),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    existing_identity = db.scalar(
        select(AuthIdentity).where(
            AuthIdentity.provider == "google",
            AuthIdentity.provider_subject == identity.subject,
        )
    )

    if existing_identity is not None:
        user = db.get(User, existing_identity.user_id)

        if user is None or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account unavailable",
            )
    else:
        existing_email = db.scalar(
            select(User.id).where(
                func.lower(User.email) == identity.email
            )
        )

        if existing_email is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Account already exists. Sign in to link Google.",
            )

        user = User(
            email=identity.email,
            full_name=identity.full_name,
            password_hash=None,
            email_verified=True,
        )

        db.add(user)

        try:
            db.flush()

            db.add(
                AuthIdentity(
                    user_id=user.id,
                    provider="google",
                    provider_subject=identity.subject,
                )
            )

            db.commit()
        except IntegrityError as exc:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Account registration conflict. Please retry.",
            ) from exc

        db.refresh(user)

    token = create_access_token(user.id, settings)

    return AccessTokenResponse(
        access_token=token,
        expires_in=settings.access_token_minutes * 60,
    )
