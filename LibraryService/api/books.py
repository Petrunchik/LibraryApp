from typing import List
from uuid import UUID

from fastapi import APIRouter

from schemas.books import BookResponse, CreateBook, EditBook

router = APIRouter(
    prefix="/books",
    tags=["books"]
)

@router.get("/", response_model=List[BookResponse])
async def get_books():
    """
    Функция для получения всех книг
    """
    return


@router.get("/info", response_model=BookResponse)
async def get_book_info(book_public_id: UUID):
    """
    Функция для получения информации о книге
    """
    return


@router.post("/add", response_model=BookResponse)
async def add_book(book_data: CreateBook):
    """
    Функция для добавления книги
    """
    return


@router.put("/edit", response_model=BookResponse)
async def edit_book(book_data: EditBook):
    """
    Функция для изменения книги
    """
    return


@router.delete("/delete")
async def delete_book(book_public_id: str):
    """
    Функция для удаления книги
    """
    return


@router.get("/genre", response_model=List[BookResponse])
async def get_books_by_genre(genre_id: int):
    """
    Функция для получения книг по жанру
    """
    return


@router.get("/author", response_model=List[BookResponse])
async def get_books_by_author(author_id: int):
    """
    Функция для получения книг по автору
    """
    return


@router.get("/publisher", response_model=List[BookResponse])
async def get_books_by_publisher(publisher_id: int):
    """
    Функция для получения книг по издателю
    """
    return
