from uuid import UUID, uuid4

from sqlalchemy import CheckConstraint, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (CheckConstraint("grade BETWEEN 1 AND 5", name="grade_range"),)

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    grade: Mapped[int]
    reader_id: Mapped[UUID]
    book_id: Mapped[UUID] = mapped_column(ForeignKey("books.id"))
