from sqlalchemy import Date, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from datetime import date


class Genre(Base):
    __tablename__ = "genres"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(30), nullable=False)

    book: Mapped[list["Book"]] = relationship( # type: ignore
        "Book",
        secondary="book_genres",
        back_populates="genres",
    )