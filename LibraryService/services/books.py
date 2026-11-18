from typing import List

from schemas.books import BookResponse, EditBook, CreateBook


class BookNotFound(Exception):
    """Книга не найдена"""
    pass


class BookService:
    def __init__(self, book_repo) -> None:
        self.book_repo = book_repo


    async def get_all_books(self, skip: int, limit: int) -> List[BookResponse | None]:
        books = await self.book_repo.get_all_books(skip, limit)
        return books


    async def get_book_by_public_id(self, book_public_id: str) -> BookResponse | None:
        book = await self.book_repo.get_book_by_public_id(book_public_id)
        if book is None:
            raise BookNotFound("Книга не найдена")
        return book


    async def add_book(self, book_data: CreateBook) -> BookResponse:
        new_book = await self.book_repo.add_book(book_data.model_dump())
        return new_book


    async def edit_book(self, book_public_id: str, book_data: EditBook) -> BookResponse:
        book = await self.book_repo.get_book_by_public_id(book_public_id) 
        if book is None:
            raise BookNotFound("Книга не найдена")
        edited_book = await self.book_repo.edit_book(book_public_id, book_data.model_dump(exclude_none=True))
        return edited_book


    async def delete_book(self, book_public_id: str) -> bool:
        book = await self.book_repo.get_book_by_public_id(book_public_id)
        if book is None:
            raise BookNotFound("Книга не найдена")
        await self.book_repo.delete_book(book_public_id)
        return True