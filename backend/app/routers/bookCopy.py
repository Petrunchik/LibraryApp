from uuid import uuid4, UUID
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import delete, func, select, case
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_depends import get_async_db
from app.models import Book, BookCopy, Review, User
from app.auth.auth import get_current_reader, get_current_admin
from app.schemas.review import ReviewCreate

from app.schemas.books import BookAnswer, BookCreate, DefaultBookAnswer
from app.schemas.bookCopy import CreateBookCopy


router = APIRouter(
    prefix="/bookCopy",
    tags=["bookCopy"]
)

async def generate_inventory_number(book_id: UUID, db: AsyncSession):
    counter = await db.scalar(select(func.count(BookCopy.id)))
    current_book_counter = await db.scalar(select(func.count(BookCopy.id)).where(BookCopy.book_id == book_id))
    return "INV-"  + str(f'{counter:04d}') + '-' + str(f'{current_book_counter:04d}')


@router.get("/")
async def get_all_book_copy(db: AsyncSession = Depends(get_async_db)):
    response = await db.scalars(select(BookCopy))
    books = response.all()
    return books


@router.post("/")
async def add_book_copy(
    data: CreateBookCopy,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_admin)
    ):
    id = uuid4()
    inventory_number = await generate_inventory_number(data.book_id, db)
    new_book_copy = BookCopy(
        id=id,
        inventory_number=inventory_number,
        status=data.status,
        book_id=data.book_id,

    )
    db.add(new_book_copy)
    await db.commit()
    await db.refresh(new_book_copy)
    
    return new_book_copy