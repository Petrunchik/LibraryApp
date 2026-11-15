import jwt

from fastapi import Depends, HTTPException, status
from datetime import datetime, timedelta, timezone
from pathlib import Path
from jwt.exceptions import InvalidTokenError

from pwdlib import PasswordHash
from settings import get_settings


password_hash = PasswordHash.recommended()

private_key = Path("keys/jwt-private.pem").read_text()
public_key = Path("keys/jwt-public.pem").read_text()

settings = get_settings()


def get_token_claims(token: str):
    try:
        return jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            issuer="library-user-service",
            audience="library-platform",
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный или просроченный токен",
        )

    
def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


def create_access_token(user_public_id: str, user_role: str) -> str:
    now = datetime.now(timezone.utc)

    payload = {
        "sub": user_public_id,
        "role": user_role,
        "iss": "library-user-service",
        "aud": "library-platform",
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_expire_minutes),
        "token_type": "access",
    }
    return jwt.encode(
        payload,
        private_key,
        algorithm="RS256",
    )


def create_refresh_token(user_public_id: str, user_role: str) -> str:
    now = datetime.now(timezone.utc)

    payload = {
        "sub": user_public_id,
        "role": user_role,
        "iss": "library-user-service",
        "aud": "library-platform",
        "iat": now,
        "exp": now + timedelta(days=settings.refresh_token_expire_days),
        "token_type": "refresh",
    }
    return jwt.encode(
        payload,
        private_key,
        algorithm="RS256",
    )


def update_tokens(refresh_token: str, user) -> tuple[str,str]:
    claims = get_token_claims(refresh_token)
    if claims["token_type"] != "refresh":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Передан невалидный refresh-токен")
    
    access_token = create_access_token(user.user_public_id, user.role)
    refresh_token = create_refresh_token(user.user_public_id, user.role)

    return access_token, refresh_token