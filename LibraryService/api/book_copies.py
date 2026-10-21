from typing import List
from uuid import UUID

from fastapi import APIRouter

from schemas.book_copies import BookCopyResponse, AddBookCopy, EditBookCopy

router = APIRouter(
    prefix="/book-copies",
    tags=["book-copies"]
)

@router.get("/", response_model=List[BookCopyResponse])
async def get_book_copies():
    """
    Функция для получения всех экземпляров книг
    """
    return


@router.get("/book", response_model=List[BookCopyResponse])
async def get_book_copies_by_book(book_public_id: str):
    """
    Функция для получения экземпляров книги
    """
    return


@router.post("/add", response_model=BookCopyResponse)
async def add_book_copy(book_data: AddBookCopy):
    """
    Функция для добавления экземпляра книги
    """
    return


@router.put("/edit", response_model=BookCopyResponse)
async def edit_book_copy(book_data: EditBookCopy):
    """
    Функция для изменения экземпляра книги
    """
    return


@router.delete("/delete")
async def delete_book_copy(book_copy_id: UUID):
    """
    Функция для удаления экземпляра книги
    """
    return
