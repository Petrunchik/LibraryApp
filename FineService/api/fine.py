from uuid import UUID
from typing import List

from fastapi import APIRouter

from schemas.fine import FineResponse

router = APIRouter(
    prefix="/fines",
    tags=["fines"]
)

@router.get("/", response_model=FineResponse)
async def get_fine(fine_id: UUID):
    """
    Функция для получения информации о штрафе
    """
    return


@router.get("/my", response_model=List[FineResponse])
async def get_user_fines():
    """
    Функция для получения штрафов пользователя
    """
    return