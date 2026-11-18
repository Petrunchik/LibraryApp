from typing import Sequence

from schemas.authors import AuthorResponse, AddAuthor, EditAuthor


class AuthorNotFound(Exception):
    """Автор не найден"""
    pass


class AuthorService:
    def __init__(self, author_repo) -> None:
        self.author_repo = author_repo


    async def get_authors(self, skip: int, limit: int) -> Sequence[AuthorResponse]:
        authors = await self.author_repo.get_authors(skip, limit)
        return authors


    async def get_author(self, author_id: int) -> AuthorResponse:
        author = await self.author_repo.get_author(author_id)
        if author is None:
            raise AuthorNotFound("Автор не найден")
        return author


    async def add_author(self, author_data: AddAuthor) -> AuthorResponse:
        author = await self.author_repo.add_author(author_data.model_dump())
        return author


    async def edit_author(self, author_id: int, update_author_data: EditAuthor) -> AuthorResponse:
        author = await self.author_repo.edit_author(author_id, update_author_data.model_dump(exclude_none=True))
        if author is None:
            raise AuthorNotFound("Автор не найден")
        return author


    async def delete_author(self, author_id: int) -> bool:
        author = await self.author_repo.delete_author(author_id)
        if author is False:
            raise AuthorNotFound("Автор не найден")
        return author