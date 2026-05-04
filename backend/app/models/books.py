from sqlalchemy import String, Integer, Text, SmallInteger, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from uuid import UUID

class Book(Base):
    __tablename__ = "books"
    id: Mapped[UUID] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    pages: Mapped[int] = mapped_column(Integer, nullable=False)
    author: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    year_of_release: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(200))
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default='true')
    publisher: Mapped[str] = mapped_column(String(100), server_default="Отсутствует информация об издательстве", nullable=False)
    genre: Mapped[str] = mapped_column(String(50), server_default="Отсутствует информация о жанре", nullable=False)

    bookCopy: Mapped[list["BookCopy"]] = relationship(
        "BookCopy",
        back_populates="book"
    )
    reservation: Mapped[list["Reservation"]] = relationship(
        "Reservation",
        back_populates="book"
    )
    review: Mapped[list["Review"]] = relationship(
        "Review",
        back_populates="book"
    )