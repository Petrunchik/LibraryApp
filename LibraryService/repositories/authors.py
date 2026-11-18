from typing import Sequence

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from models.authors import Author


class AuthorsRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db


    async def get_authors(self, skip: int, limit: int) -> Sequence[Author | None]:
        authors = await self.db.scalars(select(Author).offset(skip).limit(limit))
        return authors.all()


    async def get_author(self, author_id: int) -> Author | None:
        author = await self.db.scalar(select(Author).where(Author.id == author_id))
        if author is None:
            return None
        return author


    async def add_author(self, author_data: dict) -> Author | None:
        author = Author(**author_data)
        self.db.add(author)
        await self.db.commit()
        await self.db.refresh(author)
        return author


    async def edit_author(self, author_id: int, update_author_data: dict) -> Author | None:
        author = await self.db.execute(
            update(Author)
            .where(Author.id == author_id)
            .values(update_author_data)
            .returning(Author)
        )
        result = author.scalar_one_or_none()
        if result is None:
            return None
        await self.db.commit()
        return result


    async def delete_author(self, author_id: int) -> bool:
        author = await self.db.execute(delete(Author).where(Author.id == author_id).returning(Author))
        await self.db.commit()
        return author.scalar_one_or_none() is not None