from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from settings import get_settings

settings = get_settings()
async_engine = create_async_engine(settings.database_url)

async_session_maker = async_sessionmaker(async_engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def create_db_and_tables():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)