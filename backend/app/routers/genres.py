from uuid import uuid4, UUID
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import delete, func, select, case
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_depends import get_async_db
from app.models import Book, BookCopy, Review, User, Genre
from app.auth.auth import get_current_reader, get_current_admin
from app.schemas.review import ReviewCreate

from app.schemas.genres import GenreBase, CreateGenre


router = APIRouter(
    prefix="/genres",
    tags=["genres"]
)


@router.get("/")
async def get_all_genres(db: AsyncSession = Depends(get_async_db)):
    """Возвращает все жанры"""
    result = await db.scalars(select(Genre))
    return result.all()


@router.post("/", response_model=GenreBase)
async def add_new_genre(
    genre_name: CreateGenre,
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.scalar(select(Genre).where(Genre.name == genre_name.name))
    if result:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Указанный жанр уже существует.")
    genre = Genre(**genre_name.model_dump())

    db.add(genre)
    await db.commit()
    await db.refresh(genre)

    return genre


@router.delete("/{genre_id}")
async def delete_genre(
    genre_id: int,
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.scalar(select(Genre).where(Genre.id == genre_id))
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Жанр с ID={genre_id} не найден.")

    await db.delete(result)
    await db.commit()

    return {"message": f"Жанр с ID={genre_id} успешно удален"}