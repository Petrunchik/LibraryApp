from uuid import uuid4, UUID
from fastapi import APIRouter, Depends, status, HTTPException, Response, Request, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_depends import get_async_db
from app.models import User, Loan, Fines, Reservation, Book, BookCopy, Review
import jwt
from settings import SECRET_KEY, ALGORITHM
from app.schemas.users import UserAnswer, UserCreate, UserPhone, UserPhoneAnswer, UserDefaultAnswer, AddManager
from app.auth.auth import hash_password, verify_password, create_access_token, create_refresh_token, get_current_manager, get_current_loggined, get_current_reader, get_current_admin
from datetime import datetime

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# id: "123",
# lastName: "Петров",
# firstName: "Иван",
# phone: "+7 (999) 123-45-67",
# role: "Читатель",
# createdAt: "15.03.2023",
# updatedAt: "10.01.2024",
# isActive: true,
# activeLoans: 2,
# debts: 0


@router.get("/signout")
async def signout(response: Response):
    response.delete_cookie(
        key="refresh_token",
        httponly=True
    )
    return {"message": "Logged out"}


@router.get("/info", response_model=UserDefaultAnswer)
async def get_user_info(current_user: User = Depends(get_current_loggined)):
    return current_user


@router.get("/{phone}/info", response_model=UserPhoneAnswer)
async def get_user_by_phone(
    phone: str,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_manager)):
    user = await db.scalar(
        select(User)
        .where(
            User.phone_number == phone
        )
    )
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
    user_data = UserPhoneAnswer(
        id=user.id,
        role=user.role,
        first_name=user.first_name,   
        last_name=user.last_name,       
        phone_number=user.phone_number,
        date_of_create=user.date_of_create,
        date_of_update=user.date_of_update,
        is_active=user.is_active
    )
    return user_data

# статусы бронирований: 
# sent - отправлено
# accepted - подтверждено
# rejected - отклонено
# issued - выдано

@router.get("/reservations")
async def get_user_reservation(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_reader)):
    result = await db.execute(
        select(Reservation, Book)
        .where(
            Reservation.reader_id == current_user.id,
        )
        .join(Book, Reservation.book_id == Book.id)
    )
    rows = result.all()
    result = []
    for reservation, book in rows:
        result.append({
            "title": book.title,
            "author": book.author,
            "image_url": book.image_url,
            "date_of_create": reservation.date_of_create,
            "date_of_expire": reservation.date_of_expire,
            "status": reservation.status,
        })
    return result


@router.get("/history-reading/")
async def get_history_reading(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_reader)):
    result = await db.execute(
        select(
            Loan,
            Book,
            func.coalesce(func.avg(Review.grade), 0).label("rating"),
        )
        .where(
            Loan.user_id == current_user.id,
            Loan.date_of_return != None,
        )
        .join(BookCopy, Loan.bookCopy_id == BookCopy.id)
        .join(Book, BookCopy.book_id == Book.id)
        .join(Review, (Review.book_id == Book.id) and (Review.reader_id == current_user.id,), isouter=True)
        .group_by(Loan.id, Book.id)
    )
    rows = result.all()
    result = []
    for loan, book, rating in rows:
        result.append({
            "book_id": book.id,
            "title": book.title,
            "author": book.author,
            "image_url": book.image_url,
            "date_of_return": loan.date_of_return,
            "rating": rating
        })
    return result


@router.get("/manager/list", response_model=list[UserDefaultAnswer])
async def get_managers_list(
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_admin)
    ):
    """
    Возвращает список менеджеров.
    """
    managers_stmt = await db.scalars(select(User).where(
        User.is_active == True,
        User.role == "manager"
    ))
    managers = managers_stmt.all()
    return managers


@router.post("/manager/add", response_model=UserDefaultAnswer, status_code=status.HTTP_200_OK)
async def add_manager(
    data: AddManager,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Добавляет менеджера по ID или номеру телефона.
    Доступно только администратору.
    """
    if (data.phone_number is None) and (data.id is None):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Одно из полей обязательно к заполнению!")
    
    user = await db.scalar(select(User).where(
        or_(
            User.phone_number == data.phone_number if data.phone_number else False,
            User.id == data.id if data.id else False
        ),
        User.role != "admin",
        User.is_active == True,
    ))

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
    if user.role == "manager":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Пользователь уже является менеджером")
    
    user.role = "manager"
    user.date_of_update = datetime.now()
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/", response_model=UserAnswer, status_code=status.HTTP_201_CREATED)
async def add_user(user: UserCreate, response: Response, db: AsyncSession = Depends(get_async_db)):
    """
    Регистрирует нового пользователя с ролью reader
    """
    result = await db.scalar(select(User).where(User.phone_number == user.phone_number))
    if result is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Номер телефона уже зарегистрирован")
    
    user_data = user.model_dump(exclude={"password"})

    db_user = User(
        id=uuid4(),
        **user_data,
        password=hash_password(user.password)        
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)

    access_token = create_access_token(data={"sub": user.phone_number, "role": user.role, "id": str(db_user.id) })
    refresh_token = create_refresh_token(data={"sub": user.phone_number, "role": user.role, "id": str(db_user.id) })
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
    )

    return {
        "id": db_user.id,
        "phone_number": db_user.phone_number,
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "role": db_user.role,
        "is_active": db_user.is_active,
        "date_of_create": db_user.date_of_create, 
        "date_of_update": db_user.date_of_update,
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/token")
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_async_db),
    ):
    """
    Аутентифицирует пользователя и возвращает JWT
    """
    user = await db.scalar(select(User).where(
        User.phone_number == form_data.username,
        User.is_active == True
    ))
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неправильный номер телефона или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.phone_number, "role": user.role, "id": str(user.id) })
    refresh_token = create_refresh_token(data={"sub": user.phone_number, "role": user.role, "id": str(user.id) })

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/refresh-token")
async def refresh_token(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Обновляет токены, принимая refresh-токен в куках.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    old_refresh_token = request.cookies.get("refresh_token")
    try:
        payload = jwt.decode(old_refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        phone: str | None = payload.get("sub")
        token_type: str | None = payload.get("token_type")
        if phone is None or token_type != "refresh":
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        # refresh-токен истёк
        raise credentials_exception
    except jwt.PyJWTError:
        # подпись неверна или токен повреждён
        raise credentials_exception
    user = await db.scalar(select(User).where(
        User.phone_number == phone,
        User.is_active == True
    ))
    if user is None:
        raise credentials_exception
    new_refresh_token = create_refresh_token(data={
        "sub": user.phone_number, "role": user.role, "id": str(user.id)
    })
    new_access_token = create_access_token(data={
        "sub": user.phone_number, "role": user.role, "id": str(user.id)
    })
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
    )
    return {
        "access_token": new_access_token,
        "token_type": "bearer",
    }


@router.patch("/manager/demote", status_code=status.HTTP_204_NO_CONTENT)
async def demote_manager(
    phone: UserPhone,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Удаляет менеджера, присваивает роль читателя.
    Доступно только администратору. 
    """
    user = await db.scalar(select(User).where(
        User.phone_number == phone.phone,
        User.is_active == True,
        User.role == "manager",
    ))

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден.")
    
    user.role = "reader"
    user.date_of_update = datetime.now()
    db.add(user)
    await db.commit()
    return 