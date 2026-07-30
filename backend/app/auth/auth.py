import jwt
from datetime import datetime, timezone, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext
from loguru import logger
from ..database.db_depends import get_async_db
from ..schemas.users import UserDefaultAnswer
from settings import Settings, get_settings

from ..models.users import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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


def create_access_token(data: dict, settings: Settings):
    """
    Создает access-токен
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({
        "exp": expire,
        "token_type": "access",
    })
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def create_refresh_token(data: dict, settings: Settings):
    """
    Создает refresh-токен
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    to_encode.update({
        "exp": expire,
        "token_type": "refresh",
    })
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


async def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: AsyncSession = Depends(get_async_db),
        settings: Settings = Depends(get_settings),
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
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
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

    if current_user.role not in ["manager", "admin"]:
        logger.warning(f"Попытка входа в систему менеджера: Имя: {current_user.first_name}, Фамилия: {current_user.last_name}, ID: {current_user.id}, Роль: {current_user.role}, Дата регистрации: {current_user.date_of_create}, Статус: {current_user.is_active}")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Только менеджер может выполнить это действие")
    logger.info(f"Роль: {current_user.role}, ID: {current_user.id}, {current_user.first_name} {current_user.last_name} вошел в систему.")
    return current_user


async def get_current_admin(current_user: User = Depends(get_current_user)):
    """
    Проверяет что пользователь имеет роль администратора
    """
    if current_user.role != "admin":
        logger.warning(f"Попытка входа в систему администратора: Имя: {current_user.first_name}, Фамилия: {current_user.last_name}, ID: {current_user.id}, Роль: {current_user.role}, Дата регистрации: {current_user.date_of_create}, Статус: {current_user.is_active}")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Только адимнистратор может выполнить это действие")
    logger.info(f"Роль: {current_user.role}, ID: {current_user.id}, {current_user.first_name} {current_user.last_name} вошел в систему.")
    return current_user