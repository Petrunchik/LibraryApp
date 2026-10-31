from uuid import UUID

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class BookGenre(Base):
    __tablename__ = "book_genres"
    __table_args__ = (UniqueConstraint("book_id", "genre_id"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    book_id: Mapped[UUID] = mapped_column(ForeignKey("books.id"))
    genre_id: Mapped[int] = mapped_column(ForeignKey("genres.id"))
