from sqlalchemy import Date, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from datetime import date


class Author(Base):
    __tablename__ = "authors"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(30), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=True)
    birth_year: Mapped[date] = mapped_column(Date, nullable=False)
    death_year: Mapped[date | None] = mapped_column(Date)
    country: Mapped[str] = mapped_column(String(50), nullable=False)

    book: Mapped[list["Book"]] = relationship( # type: ignore
        "Book",
        secondary="book_authors",
        back_populates="authors",
    )