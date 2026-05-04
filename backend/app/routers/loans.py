from uuid import uuid4, UUID
from sqlalchemy import delete, func, select, case
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_depends import get_async_db
from app.models import Book, BookCopy
from fastapi import APIRouter, Depends, status, HTTPException, Response, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_depends import get_async_db
from app.schemas.loans import LoanCreate, ReturnBook, LoanAnswer
from app.models.loan import Loan
from datetime import datetime, timedelta, date
from app.models.users import User
from app.auth.auth import get_current_reader

router = APIRouter(
    prefix="/loans",
    tags=["loans"]
)

# @router.get("/", response_model=list[LoanAnswer])
@router.get("/")
async def get_user_loans(
    user: User = Depends(get_current_reader),
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(
        select(Loan, Book)
        .where(Loan.user_id == user.id, Loan.date_of_return == None)
        .join(BookCopy, Loan.bookCopy_id == BookCopy.id)
        .join(Book, BookCopy.book_id == Book.id)
    )
    rows = result.all()
    res = []
    for loan, book in rows:
        res.append({
            "book_id" : book.id,
            "date_of_loan": loan.date_of_loan,
            "date_of_expected_return": loan.date_of_expected_return,
            "book_title" : book.title,
            "book_author" : book.author,
            "image_url": book.image_url,
            "days_before_return": (loan.date_of_expected_return - date.today()).days
        })

    return res


@router.post("/")
async def add_issue(data: LoanCreate, db: AsyncSession = Depends(get_async_db)):
    book_copy = await db.scalar(select(BookCopy).where(
        BookCopy.id == data.book_copy_id,
        BookCopy.status == "доступна"
    ))
    if book_copy is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Книга не найдена или уже выдана")
    current_book = await db.scalar(select(Book).where(
        Book.id == book_copy.book_id,
        Book.is_active == True
    ))
    reader = await db.scalar(select(User).where(
        User.id == data.user_id,
        User.is_active == True
    ))
    if current_book is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Книга не найдена или уже выдана")
    if reader is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пользователь не найден")
    
    issue = Loan(
        id = uuid4(),
        date_of_loan = datetime.now(),
        date_of_expected_return = datetime.now() + timedelta(days=data.days),
        user_id=data.user_id,
        bookCopy_id=data.book_copy_id,
    )
    book_copy.status = "выдана"
    db.add(issue, book_copy)
    await db.commit()
    await db.refresh(issue)
    return issue


@router.post("/return_book")
async def return_book(
    data: ReturnBook,
    db: AsyncSession = Depends(get_async_db)):
    book_copy = await db.scalar(select(BookCopy).where(
        BookCopy.id == data.book_copy_id,
        BookCopy.status == "выдана"
    ))
    refund = await db.scalar(select(Loan).where(Loan.bookCopy_id == data.book_copy_id))
    if book_copy is None or refund is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена или уже выдана")
    refund.date_of_return = datetime.now()
    refund.comment = data.comment or None
    book_copy.status = "доступна"
    db.add(refund, book_copy)
    await db.commit()
    return {"status": "ok"}