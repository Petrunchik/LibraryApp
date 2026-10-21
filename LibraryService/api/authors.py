from typing import List

from fastapi import APIRouter

from schemas.authors import AuthorResponse, AddAuthor, EditAuthor

router = APIRouter(
    prefix="/authors",
    tags=["authors"]
)

@router.get("/", response_model=List[AuthorResponse])
async def get_authors():
    """
    Функция для получения всех авторов
    """
    return


@router.get("/info", response_model=AuthorResponse)
async def get_author(author_id: int):
    """
    Функция для получения информации об авторе
    """
    return


@router.post("/add", response_model=AuthorResponse)
async def add_author(author_data: AddAuthor):
    """
    Функция для добавления автора
    """
    return


@router.put("/edit", response_model=AuthorResponse)
async def edit_author(author_data: EditAuthor):
    """
    Функция для изменения автора
    """
    return


@router.delete("/delete")
async def delete_author(author_id: int):
    """
    Функция для удаления автора
    """
    return
