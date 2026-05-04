from uuid import uuid4, UUID
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import delete, func, select, case
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_depends import get_async_db
from app.models import Book, BookCopy, Review, User
from app.auth.auth import get_current_reader
from app.schemas.review import ReviewCreate

from app.schemas.books import BookAnswer, BookCreate

router = APIRouter(
    prefix="/books",
    tags=["books"]
)

@router.get("/")
async def get_all_books(db: AsyncSession = Depends(get_async_db)):
    """
    Функция возвращает все книги
    """
    result = await db.execute(
        select(
            Book,
            func.count(BookCopy.id).label("total"),
            func.sum(case((BookCopy.status == "доступна", 1), else_=0)).label("available_copies"),
            func.coalesce(func.avg(Review.grade), 0).label("rating"),
            func.count(func.distinct(Review.id)).label("total_rating_count"),
        )
        .join(BookCopy, BookCopy.book_id == Book.id)
        .join(Review, Review.book_id == Book.id, isouter=True)
        .where(Book.is_active == True)
        .group_by(Book.id)
    )
    books = result.all()
    response_books = []
    for book, total, available_copies, review, total_rating_count in books:
        book_dict = {
            "id": book.id,
            "title": book.title,
            "description": book.description,
            "pages": book.pages,
            "author": book.author,
            "year_of_release": book.year_of_release,
            "image_url": book.image_url,
            "is_active": book.is_active,
            "publisher": book.publisher,
            "genre": book.genre,
            "total": total,
            "borrowed_copies": total - available_copies,
            "available_copies": available_copies,
            "rating": float(review) if review else 0,
            "total_rating_count": total_rating_count,
        }
        response_books.append(book_dict)

    return response_books


@router.post("/", response_model=BookAnswer)
async def add_book(
    new_book: BookCreate,
    db: AsyncSession = Depends(get_async_db)
    ):
    id = uuid4()
    book = Book(
        **new_book.model_dump(),
        id=id
    )
    db.add(book)
    await db.commit()
    await db.refresh(book)
    return book


@router.post("/add-grade", status_code=status.HTTP_201_CREATED)
async def add_grade(
    data: ReviewCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_reader)
    ):
    old_user_grade = await db.scalar(select(Review).where(
        Review.reader_id == current_user.id,
        Review.book_id == data.book_id
    ))
    if old_user_grade:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Оценка уже была поставлена")
    grade = Review(
        **data.model_dump(),
        id = uuid4(),
        reader_id = current_user.id,
    )
    db.add(grade)
    await db.commit()
    await db.refresh(grade)
    return grade


@router.delete("/{book_id}", status_code=status.HTTP_200_OK)
async def delete_book_by_id(
    book_id: UUID,
    db: AsyncSession = Depends(get_async_db)
    ):
    book = await db.scalar(select(Book).where(Book.id == book_id))
    if book is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена или была удалена ранее")
    book.is_active = False
    await db.commit()
    await db.refresh(book)
    return book