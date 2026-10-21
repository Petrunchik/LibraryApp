from fastapi import APIRouter

from schemas.auth import UserAuthResponse, UserLoginRequest, UserRegisterRequest, TokenResponse

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/register", response_model=UserAuthResponse)
async def register(request: UserRegisterRequest):
    """
    Функция для регистрации нового пользователя
    """
    return


@router.post("/login", response_model=UserAuthResponse)
async def login(request: UserLoginRequest):
    """
    Функция для входа уже зарегистрированного пользователя
    """
    return


@router.post("/refresh", response_model=TokenResponse)
async def refresh(refresh_token: str):
    """
    Функция для обновления токенов
    """
    return