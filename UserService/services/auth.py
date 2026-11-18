from schemas.users import UserResponse
from schemas.auth import UserRegisterRequest, UserAuthResponse, UserLoginRequest

from core.security import hash_password, verify_password, create_access_token, create_refresh_token, update_tokens, get_token_claims

class PhoneNumberAlreadyExists(Exception):
    """Номер телефона уже зарегистрирован"""
    pass


class WrongPassword(Exception):
    """Неправильный пароль"""
    pass


class UserIsBLocked(Exception):
    """Пользователь заблокирован"""
    pass


class UserIsInactive(Exception):
    """Пользователь неактивен"""
    pass


class UserNotFound(Exception):
    """Пользователь не найден или заблокирован"""
    pass


class AuthService:
    def __init__(self, user_repo) -> None:
        self._user_repo = user_repo


    async def register_user(self, user_data: UserRegisterRequest) -> tuple[UserAuthResponse, str]:
        exist_user = await self._user_repo.get_user_by_phone_number(user_data.phone_number)
        if exist_user is not None:
            raise PhoneNumberAlreadyExists("Номер телефона уже зарегистрирован")

        hashed_password = hash_password(user_data.password)
        user_data.password = hashed_password
        
        user = await self._user_repo.register(user_data.model_dump())
        access_token = create_access_token(user.user_public_id, user.role)
        refresh_token = create_refresh_token(user.user_public_id, user.role)
        user.access_token = access_token
        return UserAuthResponse.model_validate(user), refresh_token


    async def get_user_by_phone_number(self, phone_number: str) -> UserResponse | None:
        user = await self._user_repo.get_user_by_phone_number(phone_number)
        return user


    async def login_user(self, user_data: UserLoginRequest) -> tuple[UserAuthResponse, str]:
        user = await self._user_repo.get_user_by_phone_number(user_data.phone_number)
        if user is None:
            raise UserNotFound("Пользователь не найден")
        if not verify_password(user_data.password, user.password):
            raise WrongPassword("Неправильный пароль")
        if user.is_blocked is True:
            raise UserIsBLocked("Пользователь заблокирован")
        if user.is_active is not True:
            raise UserIsInactive("Пользователь неактивен")
        access_token = create_access_token(user.user_public_id, user.role)
        refresh_token = create_refresh_token(user.user_public_id, user.role)
        user.access_token = access_token
        return UserAuthResponse.model_validate(user), refresh_token


    async def refresh_tokens(self, refresh_token: str):
        user_public_id = get_token_claims(refresh_token)["sub"]
        user = await self._user_repo.get_user_by_public_id(user_public_id)
        if user is None:
            raise UserNotFound("Пользователь не найден или заблокирован")
        tokens = update_tokens(refresh_token, user)
        return tokens