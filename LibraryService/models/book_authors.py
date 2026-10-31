from uuid import UUID

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class BookAuthor(Base):
    __tablename__ = "book_authors"
    __table_args__ = (UniqueConstraint("book_id", "author_id"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    book_id: Mapped[UUID] = mapped_column(ForeignKey("books.id"))
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id"))
