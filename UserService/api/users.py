from fastapi import APIRouter

from schemas.users import UserResponse, UserRoleUpdateRequest, UserBlockRequest

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/me", response_model=UserResponse)
async def get_me():
    """
    Функция для получения информации о текущем пользователе
    """
    return


@router.get("/info", response_model=UserResponse)
async def get_user_info(user_public_id: str):
    """
    Функция для получения информации о пользователе по ID
    """
    return


@router.post("/update/role", response_model=UserResponse)
async def update_user_role(request: UserRoleUpdateRequest):
    """
    Функция для обновления роли пользователя
    """
    return


@router.post("/block", response_model=UserResponse)
async def block_user(request: UserBlockRequest):
    """
    Функция для блокировки/разблокировки пользователя по ID
    """
    return