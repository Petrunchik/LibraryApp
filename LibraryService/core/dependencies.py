from collections.abc import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .database import async_session_maker
from repositories.books import BookRepository
from services.books import BookService

from repositories.publishers import PublisherRepository
from services.publishers import PublisherService


async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Предоставляет асинхронную сессию SQLAlchemy для работы с базой данных PostgreSQL.
    """
    async with async_session_maker() as session:
        yield session


async def get_books_repo(db: AsyncSession = Depends(get_async_db)) -> BookRepository:
    return BookRepository(db=db)


async def get_books_service(book_repo: AsyncSession = Depends(get_books_repo)) -> BookService:
    return BookService(book_repo=book_repo)


async def get_publishers_repo(db: AsyncSession = Depends(get_async_db)) -> PublisherRepository:
    return PublisherRepository(db=db)


async def get_publishers_service(publisher_repo: PublisherRepository = Depends(get_publishers_repo)) -> PublisherService:
    return PublisherService(publisher_repo=publisher_repo)