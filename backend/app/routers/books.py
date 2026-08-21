from uuid import uuid4, UUID
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import func, select, case, update
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger
from app.database.db_depends import get_async_db
from app.models import Book, BookCopy, Review, User, Publisher, Genre, Author
from app.auth.auth import get_current_reader, get_current_admin
from app.schemas.review import ReviewCreate

from app.schemas.books import BookCreate, EditBook

router = APIRouter(
    prefix="/books",
    tags=["books"]
)

async def get_authors(
    author_ids: list[int],
    db: AsyncSession,
):
    authors = await db.scalars(
        select(Author)
        .where(Author.id.in_(author_ids))
    )
    return authors

async def get_genres(
    genre_ids: list[int],
    db: AsyncSession,
):
    genres = await db.scalars(
        select(Genre)
        .where(Genre.id.in_(genre_ids))
    )
    return genres

async def validate_authors_exist(author_ids: list, db: AsyncSession):
    """Проверяет, что все авторы найдены"""

    authors = await get_authors(author_ids, db)
    authors_lst = authors.all()

    if len(authors_lst) != len(author_ids):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Один или несколько авторов не найдены"
        )
    return authors_lst

async def validate_genres_exist(genre_ids: list, db: AsyncSession):
    """Проверяет, что все жанры найдены"""

    genres = await get_genres(genre_ids, db)
    genres_lst = genres.all()

    if len(genres_lst) != len(genre_ids):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Один или несколько жанров не найдены"
        )
    return genres_lst

async def validate_publisher_exist(publisher_id: int, db: AsyncSession):
    """Проверяет, что издатель существует"""

    publisher = await db.scalar(
        select(Publisher)
        .where(Publisher.id == publisher_id)
    )

    if publisher is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Издатель не найден"
        )
    return publisher

async def validate_book_exist(book_public_id: str, db: AsyncSession):
    """Проверяет, что книга существует"""

    book = await db.scalar(
        select(Book)
        .where(Book.book_public_id == book_public_id)
        .options(
            selectinload(Book.authors),
            selectinload(Book.genres)
        )
    )
    if book is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена или была удалена ранее")

    return book

@router.get("/")
async def get_all_books(
    skip: int = 0,
    limit: int = 30,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Функция возвращает все книги
    """
    result = await db.execute(
        select(
            Book,
            func.count(BookCopy.id).label("total"),
            func.sum(case((BookCopy.status == "В наличии", 1), else_=0)).label("available_copies"),
            func.coalesce(func.avg(Review.grade), 0).label("rating"),
            func.count(func.distinct(Review.id)).label("total_rating_count"),
            Publisher
        )
        .options(selectinload(Book.authors))
        .options(selectinload(Book.genres))
        .join(BookCopy, BookCopy.book_id == Book.id, isouter=True)
        .join(Review, Review.book_id == Book.id, isouter=True)
        .join(Publisher, Publisher.id == Book.publisher_id, isouter=True)
        .where(Book.is_active == True)
        .group_by(Book.id, Publisher.id)
        .offset(skip)
        .limit(limit)
    )
    books = result.all()
    response_books = []
    for book, total, available_copies, review, total_rating_count, publisher in books:
        book_dict = {
            "id": book.id,
            "book_public_id": book.book_public_id,
            "title": book.title,
            "description": book.description,
            "pages": book.pages,
            "authors": book.authors,
            "year_of_release": book.year_of_release,
            "image_url": book.image_url,
            "is_active": book.is_active,
            "publisher": publisher,
            "genres": book.genres,
            "total": total if total else 0,
            "borrowed_copies": total - available_copies,
            "available_copies": available_copies,
            "rating": float(review) if review else 0,
            "total_rating_count": total_rating_count,
            "language": book.language,
            "age_restriction": book.age_restriction,
        }
        response_books.append(book_dict)

    return response_books


@router.get("/{book_id}/info")
async def get_book_info(book_id: UUID, db: AsyncSession = Depends(get_async_db)):
    """
    Функция для получения информации о конкретной книге по ее ID.
    """
    result = await db.execute(
        select(
            Book,
            func.count(BookCopy.id).label("total"),
            func.sum(case((BookCopy.status == "В наличии", 1), else_=0)).label("available_copies"),
            func.coalesce(func.avg(Review.grade), 0).label("rating"),
            func.count(func.distinct(Review.id)).label("total_rating_count"),
            Publisher
        )
        .options(selectinload(Book.authors))
        .options(selectinload(Book.genres))
        .join(BookCopy, BookCopy.book_id == Book.id, isouter=True)
        .join(Review, Review.book_id == Book.id, isouter=True)
        .where(Book.is_active == True, Book.id == book_id)
        .group_by(Book.id, Publisher.id)
    )
    books = result.first()
    
    book, total, available_copies, rating, total_rating_count, publisher = books # type: ignore

    book_dict = {
        "id": book.id,
        "book_public_id": book.book_public_id,
        "title": book.title,
        "description": book.description,
        "pages": book.pages,
        "authors": book.authors,
        "year_of_release": book.year_of_release,
        "image_url": book.image_url,
        "is_active": book.is_active,
        "publisher": publisher,
        "genres": book.genres,
        "total": total if total else 0,
        "borrowed_copies": total - available_copies,
        "available_copies": available_copies,
        "rating": float(rating) if rating else 0,
        "total_rating_count": total_rating_count,
        "language": book.language,
        "age_restriction": book.age_restriction,
    }
    return book_dict


@router.post("/")
async def add_book(
    data: BookCreate,
    db: AsyncSession = Depends(get_async_db),
    # current_user: User = Depends(get_current_admin)
    ):
    """
    Функция для добавления новой книги в базу данных.
    Доступно только администратору.
    """
    if data.author_ids == []:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не указан автор книги"
        )
    
    authors_lst = await validate_authors_exist(data.author_ids, db)
    genres_lst = await validate_genres_exist(data.genre_ids, db)
    await validate_publisher_exist(data.publisher_id, db)
    
    book_data = data.model_dump(
        exclude={"author_ids", "genre_ids"}
    )

    book = Book(
        **book_data,
        id=uuid4(),
        is_active=True,
    )

    book.authors = authors_lst # type: ignore
    book.genres = genres_lst # type: ignore

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
    """
    Функция для добавления оценки книги текущим пользователем.
    Доступно только авторизованным пользователям.
    """
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


@router.put("/{book_public_id}", status_code=status.HTTP_204_NO_CONTENT)
async def edit_book(
    book_public_id: str,
    data: EditBook,
    db: AsyncSession = Depends(get_async_db),
    # current_user: User = Depends(get_current_admin)
    ):
    """
    Функция для редактирования информации о книге.
    Доступно только администратору.
    """
    book = await validate_book_exist(book_public_id, db)
    
    book_data = data.model_dump(
        exclude_unset=True,
        exclude_none=True,
        exclude_defaults=True,
        exclude={"author_ids", "genre_ids"},
    )

    if book_data:
        await db.execute(update(Book).where(
            Book.book_public_id == book_public_id
        ).values(**book_data))

    if data.author_ids:
        authors_lst = await validate_authors_exist(data.author_ids, db)
        book.authors = authors_lst # type:ignore
    if data.genre_ids:
        genres_lst = await validate_genres_exist(data.genre_ids, db)
        book.genres = genres_lst # type:ignore

    await db.commit()
    return


@router.delete("/{book_id}", status_code=status.HTTP_200_OK)
async def delete_book_by_id(
    book_public_id: str,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_admin),
    ):
    """
    Функция удаляет книгу по ID.
    Доступно только администратору.
    """
    book = await validate_book_exist(book_public_id, db)

    book.is_active = False
    await db.commit()
    await db.refresh(book)

    logger.info(f"Книга {book} удалена")
    
    return book


@router.get("/genres/{genre_id}")
async def get_books_by_genre(
    genre_id: int,
    skip: int = 0,
    limit: int = 30,
    db: AsyncSession = Depends(get_async_db)
):
    await validate_genres_exist([genre_id], db)
    
    result = await db.scalars(
        select(Book)
        .join(Book.genres)
        .where(Genre.id == genre_id)
        .options(
            selectinload(Book.publisher),
            selectinload(Book.authors)
        )
        .distinct()
        .order_by(Book.title)
        .offset(skip)
        .limit(limit)
    )

    books = result.all()

    return books


@router.get("/publisher/{publisher_id}")
async def get_books_by_publisher(
    publisher_id: int,
    skip: int = 0,
    limit: int = 30,
    db: AsyncSession = Depends(get_async_db),
):
    await validate_publisher_exist(publisher_id, db)

    result = await db.scalars(
        select(Book)
        .join(Book.publisher)
        .where(Publisher.id == publisher_id)
        .options(
            selectinload(Book.authors)
        )
        .offset(skip)
        .limit(limit)
    )

    books = result.all()

    return books