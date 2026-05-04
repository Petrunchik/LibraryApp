import jwt
from datetime import datetime, timezone, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext
from settings import SECRET_KEY, ALGORITHM
from app.database.db_depends import get_async_db
from app.schemas.users import UserDefaultAnswer

from app.models.users import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token")


def hash_password(password: str):
    """
    Преобразует пароль в хэш
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    """
    Проверяет, соответствует ли введенный пароль хэшу
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    """
    Создает access-токен
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({
        "exp": expire,
        "token_type": "access",
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict):
    """
    Создает refresh-токен
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({
        "exp": expire,
        "token_type": "refresh",
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: AsyncSession = Depends(get_async_db)
    ):
    """
    Проверяет JWT и возвращает пользователя из базы
    """
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось подтвердить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        phone: str | None = payload.get("sub")
        token_type: str | None = payload.get("token_type")
        if phone is None or token_type != "access":
            raise credential_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise credential_exception
    user = await db.scalar(select(User).where(
        User.phone_number == phone,
        User.is_active == True
    ))
    if user is None:
        raise credential_exception
    return user


async def get_current_loggined(current_user: User = Depends(get_current_user)):
    """
    Проверяет что пользователь зарегистрирован
    """
    if current_user.role not in  ["reader", "manager", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Только зарегистрированный пользователь может выполнить это действие")
    return current_user


async def get_current_reader(current_user: User = Depends(get_current_user)):
    """
    Проверяет что пользователь имеет роль читателя
    """
    if current_user.role != "reader":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Только читатель может выполнить это действие")
    return current_user


async def get_current_manager(current_user: User = Depends(get_current_user)):
    """
    Проверяет что пользователь имеет роль менеджера
    """
    if current_user.role != "manager":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Только менеджер может выполнить это действие")
    return current_user


async def get_current_admin(current_user: User = Depends(get_current_user)):
    """
    Проверяет что пользователь имеет роль администратора
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Только адимнистратор может выполнить это действие")
    return current_user