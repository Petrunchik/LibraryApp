from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database.database import Base
from uuid import UUID

class BookAndAuthor(Base):
    __tablename__ = "book_authors"

    book_id: Mapped[UUID] = mapped_column(ForeignKey("books.id"), primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id"), primary_key=True)