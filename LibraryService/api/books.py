from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from schemas.books import BookResponse, CreateBook, EditBook
from core.dependencies import get_books_service
from services.books import BookService, BookNotFound

router = APIRouter(
    prefix="/books",
    tags=["books"]
)

@router.get("/", response_model=List[BookResponse])
async def get_books(skip: int = 0, limit: int = 20, books_service: BookService = Depends(get_books_service)):
    """
    Функция для получения всех книг
    """
    books = await books_service.get_all_books(skip, limit)
    return books


@router.get("/info/{book_public_id}", response_model=BookResponse)
async def get_book_info(book_public_id: str, books_service: BookService = Depends(get_books_service)):
    """
    Функция для получения информации о книге
    """
    try:
        book = await books_service.get_book_by_public_id(book_public_id)
    except BookNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена")
    return book


@router.post("/add", response_model=BookResponse)
async def add_book(book_data: CreateBook, books_service: BookService = Depends(get_books_service)):
    """
    Функция для добавления книги
    """
    new_book = await books_service.add_book(book_data)
    return new_book


@router.put("/edit", response_model=BookResponse)
async def edit_book(book_public_id: str, book_data: EditBook, books_service: BookService = Depends(get_books_service)):
    """
    Функция для изменения книги
    """
    try:
        edited_book = await books_service.edit_book(book_public_id, book_data)
    except BookNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена")
    return edited_book


@router.delete("/delete")
async def delete_book(book_public_id: str, books_service: BookService = Depends(get_books_service)):
    """
    Функция для удаления книги
    """
    try:
        await books_service.delete_book(book_public_id)
    except BookNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена")
    return {"message": "Книга удалена"}


@router.get("/genre", response_model=List[BookResponse])
async def get_books_by_genre(genre_id: int, books_service: BookService = Depends(get_books_service)):
    """
    Функция для получения книг по жанру
    """
    return


@router.get("/author", response_model=List[BookResponse])
async def get_books_by_author(author_id: int, books_service: BookService = Depends(get_books_service)):
    """
    Функция для получения книг по автору
    """
    return


@router.get("/publisher", response_model=List[BookResponse])
async def get_books_by_publisher(publisher_id: int, books_service: BookService = Depends(get_books_service)):
    """
    Функция для получения книг по издателю
    """
    return
