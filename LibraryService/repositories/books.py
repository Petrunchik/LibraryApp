from typing import Sequence
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from models.books import Book


class BookRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db


    async def get_all_books(self, skip: int, limit: int) -> Sequence[Book | None]:
        books = await self.db.scalars(select(Book).where(Book.is_active == True).offset(skip).limit(limit))
        return books.all()


    async def get_book_by_public_id(self, book_public_id: str) -> Book | None:
        book = await self.db.scalar(select(Book).where(Book.book_public_id == book_public_id, Book.is_active == True))
        if book is None:
            return None
        return book


    async def add_book(self, book_data: dict) -> Book:
        book = Book(
            id=uuid4(),
            **book_data
        )
        self.db.add(book)
        await self.db.commit()
        await self.db.refresh(book)
        return book


    async def edit_book(self, book_public_id: str, edit_book_data: dict) -> Book | None:
        book = await self.db.execute(
            update(Book)
            .where(Book.book_public_id == book_public_id, Book.is_active == True)
            .values(**edit_book_data).returning(Book)
        )
        result = book.scalar_one_or_none()
        if result is None:
            return None
        await self.db.commit()
        return result


    async def delete_book(self, book_public_id: str) -> bool | None:
        book = await self.db.scalar(select(Book).where(Book.book_public_id == book_public_id, Book.is_active == True))
        if book is None:
            return None
        book.is_active = False
        await self.db.commit()
        return True
    