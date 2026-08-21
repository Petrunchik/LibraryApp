from uuid import uuid4, UUID
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import delete, func, select, case
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_depends import get_async_db
from app.models import Book, BookCopy, Review, User, Author
from app.auth.auth import get_current_reader, get_current_admin

from app.schemas.authors import AddAuthors


router = APIRouter(
    prefix="/authors",
    tags=["authors"]
)

@router.get("/")
async def get_authors(db: AsyncSession = Depends(get_async_db)):
    authors = await db.scalars(select(Author))
    return authors.all()

@router.post("/")
async def add_author(
    data: AddAuthors, 
    db: AsyncSession = Depends(get_async_db)
):
    author = await db.scalar(
        select(Author)
        .where(
            Author.first_name == data.first_name,
            Author.last_name == data.last_name,
            Author.death_year == data.death_year,
            Author.birth_year == data.birth_year,
            Author.country == data.country,
        )
    )
    if author:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Автор с такими данными уже добавлен"
        )
    author_db = Author(
        **data.model_dump()
    )
    db.add(author_db)
    await db.commit()
    await db.refresh(author_db)

    return author_db


@router.delete("/{author_id}")
async def delete_author(
    author_id: int,
    db: AsyncSession = Depends(get_async_db)
):
    author = await db.scalar(select(Author).where(Author.id == author_id))
    if author is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Автор не найден"
        )
    await db.delete(author)
    await db.commit()
    return {"message": f"Автор с ID={author_id} успешно удален"}