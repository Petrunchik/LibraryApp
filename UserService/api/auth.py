from fastapi import APIRouter, Depends, HTTPException, status, Response, Request

from core.dependencies import get_auth_service
from schemas.auth import UserAuthResponse, UserLoginRequest, UserRegisterRequest
from services.auth import AuthService, PhoneNumberAlreadyExists, UserNotFound, WrongPassword, UserIsInactive, UserIsBLocked, UserNotFound

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/register", response_model=UserAuthResponse)
async def register(user_data: UserRegisterRequest, response: Response, auth_service: AuthService = Depends(get_auth_service)):
    """
    Функция для регистрации нового пользователя
    """
    try:
        user, refresh_token = await auth_service.register_user(user_data)
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=60 * 60 * 24 * 30,
        )
    except PhoneNumberAlreadyExists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Номер телефона уже зарегистрирован")
    return user


@router.post("/login", response_model=UserAuthResponse)
async def login(user_data: UserLoginRequest, response: Response, auth_service: AuthService = Depends(get_auth_service)):
    """
    Функция для входа уже зарегистрированного пользователя
    """
    try:
        user, refresh_token = await auth_service.login_user(user_data)
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=60 * 60 * 24 * 30,
        )
    except UserNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден или заблокирован")
    except WrongPassword:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неправильный пароль")
    except UserIsBLocked:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Пользователь заблокирован")
    except UserIsInactive:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Пользователь неактивен")
    return user


@router.post("/refresh")
async def refresh(request: Request, response: Response, auth_service: AuthService = Depends(get_auth_service)):
    """
    Функция для обновления токенов
    """
    try:
        old_refresh_token = request.cookies.get("refresh_token")
        if old_refresh_token is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh-токен не найден")
        access_token, refresh_token = await auth_service.refresh_tokens(old_refresh_token)
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=60 * 60 * 24 * 30,
        )
        return {"access_token": access_token}
    except UserNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден или заблокирован")