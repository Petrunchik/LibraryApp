from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from settings import get_settings


class Base(DeclarativeBase):
    pass


async_engine = create_async_engine(get_settings().database_url)
async_session_maker = async_sessionmaker(async_engine, expire_on_commit=False)
