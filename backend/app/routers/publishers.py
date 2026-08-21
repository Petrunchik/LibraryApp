from uuid import uuid4, UUID
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import delete, func, select, case
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_depends import get_async_db
from app.models import Book, BookCopy, Review, User, Genre, Publisher
from app.auth.auth import get_current_reader, get_current_admin
from app.schemas.publishers import AddPublisher

from app.schemas.genres import GenreBase, CreateGenre

router = APIRouter(
    prefix="/publishers",
    tags=["publishers"]
)


@router.get("/")
async def get_publishers(db: AsyncSession = Depends(get_async_db)):
    result = await db.scalars(select(Publisher))
    return result.all()


@router.post("/")
async def add_publisher(
    publisher_data: AddPublisher,
    db: AsyncSession = Depends(get_async_db)
):
    publisher_check = await db.scalar(select(Publisher).where(Publisher.name == publisher_data.name))
    if publisher_check:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Издательство с таким названием уже существует.")

    publisher = Publisher(
        **publisher_data.model_dump()
    )

    db.add(publisher)
    await db.commit()
    await db.refresh(publisher)

    return publisher


@router.delete("/{publisher_id}")
async def delete_publisher(
    publisher_id: int, 
    db: AsyncSession = Depends(get_async_db)
):
    publisher = await db.scalar(select(Publisher).where(Publisher.id == publisher_id))

    if publisher is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Издатель с таким id не найден.")

    await db.delete(publisher)
    await db.commit()

    return {"message": f"Издатель с ID={publisher_id} успешно удален"}