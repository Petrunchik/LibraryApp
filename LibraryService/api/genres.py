from typing import List

from fastapi import APIRouter

from schemas.genres import GenreResponse, AddGenre, EditGenre

router = APIRouter(
    prefix="/genres",
    tags=["genres"]
)

@router.get("/", response_model=List[GenreResponse])
async def get_genres():
    """
    Функция для получения всех жанров
    """
    return


@router.get("/info", response_model=GenreResponse)
async def get_genre(genre_id: int):
    """
    Функция для получения информации о жанре
    """
    return


@router.post("/add", response_model=GenreResponse)
async def add_genre(genre_data: AddGenre):
    """
    Функция для добавления жанра
    """
    return


@router.put("/edit", response_model=GenreResponse)
async def edit_genre(genre_data: EditGenre):
    """
    Функция для изменения жанра
    """
    return


@router.delete("/delete")
async def delete_genre(genre_id: int):
    """
    Функция для удаления жанра
    """
    return
