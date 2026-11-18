from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from schemas.authors import AuthorResponse, AddAuthor, EditAuthor
from core.dependencies import get_author_service
from services.authors import AuthorService, AuthorNotFound

router = APIRouter(
    prefix="/authors",
    tags=["authors"]
)

@router.get("/", response_model=List[AuthorResponse])
async def get_authors(skip: int = 0, limit: int = 20, author_service: AuthorService = Depends(get_author_service)):
    """
    Функция для получения всех авторов
    """
    authors = await author_service.get_authors(skip, limit)
    return authors


@router.get("/info/{author_id}", response_model=AuthorResponse)
async def get_author(author_id: int, author_service: AuthorService = Depends(get_author_service)):
    """
    Функция для получения информации об авторе
    """
    try:
        author = await author_service.get_author(author_id)
    except AuthorNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Автор не найден")
    return author


@router.post("/add", response_model=AuthorResponse)
async def add_author(author_data: AddAuthor, author_service: AuthorService = Depends(get_author_service)):
    """
    Функция для добавления автора
    """
    try:
        author = await author_service.add_author(author_data)
    except AuthorNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Автор не найден")
    return author


@router.put("/edit/{author_id}", response_model=AuthorResponse)
async def edit_author(author_id: int, author_data: EditAuthor, author_service: AuthorService = Depends(get_author_service)):
    """
    Функция для изменения автора
    """
    try:
        author = await author_service.edit_author(author_id, author_data)
    except AuthorNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Автор не найден")
    return author


@router.delete("/delete")
async def delete_author(author_id: int, author_service: AuthorService = Depends(get_author_service)):
    """
    Функция для удаления автора
    """
    author_not_found = HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Автор не найден")
    try:
        author = await author_service.delete_author(author_id)
        if author is False:
            raise author_not_found
    except AuthorNotFound:
        raise author_not_found
    return {"message": "Автор удален"}
