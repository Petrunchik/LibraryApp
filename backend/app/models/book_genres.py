from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database.database import Base
from uuid import UUID

class BookAndGenre(Base):
    __tablename__ = "book_genres"

    book_id: Mapped[UUID] = mapped_column(ForeignKey("books.id"), primary_key=True)
    genre_id: Mapped[int] = mapped_column(ForeignKey("genres.id"), primary_key=True)