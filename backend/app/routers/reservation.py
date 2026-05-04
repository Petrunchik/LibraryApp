from uuid import uuid4, UUID
from sqlalchemy import delete, func, select, case
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_depends import get_async_db
from app.models import Book, BookCopy, User, Reservation
from fastapi import APIRouter, Depends, status, HTTPException, Response, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_depends import get_async_db
from app.schemas.reservation import ReseravtionCreate
from datetime import datetime, timedelta
from app.auth.auth import get_current_manager, get_current_reader

router = APIRouter(
    prefix="/reservation",
    tags=["reservation"]
)

# статусы бронирований: 
# sent - отправлено
# accepted - подтверждено
# rejected - отклонено
# issued - выдано


@router.get("/")
async def get_all_reservation(
    db: AsyncSession = Depends(get_async_db),
    ):
    stmt = await db.execute(
        select(Reservation, Book, User)
        .join(Reservation.book)
        .join(Reservation.reader)
        .where(Reservation.status.not_in(["issued", "rejected"]))
    )
    reservations = stmt.all()
    response_answer = []
    for reservation, book, user in reservations:
        reservation_dict = {
            "id": reservation.id,
            "date_of_create": reservation.date_of_create,
            "status": reservation.status,
            "date_of_expire": reservation.date_of_expire,
            "manager_id": reservation.manager_id,
            "book_id": reservation.book_id,
            "reader_id": reservation.reader_id,
            "title": book.title,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
        response_answer.append(reservation_dict)
    return response_answer


@router.post("/")
async def create_request(
    reservation_data: ReseravtionCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_reader)):
    """
    Создает запрос на создание бронирования
    """
    reservation = await db.scalar(select(func.count(Reservation.id)).where(
        Reservation.status != "issued",
        Reservation.status != "rejected",
        Reservation.reader_id == current_user.id,
        Reservation.book_id == reservation_data.book_id,
    ))
    if reservation > 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Запрос на бронирование уже отправлен")
    if reservation == 5:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Вы не можете отправить больше 5 запросов на бронирование, дождитесь ответа на предыдущие запросы")
    book = await db.scalar(
        select(Book)
        .where(
            Book.id == reservation_data.book_id,
            Book.is_active == True
            )
        )
    reader = await db.scalar(
        select(User)
        .where(
            User.id == current_user.id,
            User.is_active == True
            )
        )
    if reader.id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Только зарегистрированный пользователь может выполнить это действие")
    if book is None or reader is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга или пользователь с таким ID не найдены")
    data = Reservation(
        id=uuid4(),
        date_of_create=datetime.now(),
        book_id=reservation_data.book_id,
        reader_id=current_user.id,
    )
    db.add(data)
    await db.commit()
    await db.refresh(data)
    return data