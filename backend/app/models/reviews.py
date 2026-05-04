from sqlalchemy import Text, Date, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from uuid import UUID


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[UUID] = mapped_column(primary_key=True)
    grade: Mapped[int] = mapped_column(Integer, nullable=False)

    reader_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    book_id: Mapped[UUID] = mapped_column(ForeignKey("books.id"), nullable=False, index=True)

    book: Mapped["Book"] = relationship(
        "Book",
        back_populates="review"
    )
    user: Mapped["User"] = relationship(
        "User",
        back_populates="review"
    )