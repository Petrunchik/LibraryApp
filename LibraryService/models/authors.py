from datetime import date

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class Author(Base):
    __tablename__ = "authors"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(30))
    last_name: Mapped[str] = mapped_column(String(100))
    birth_date: Mapped[date]
    death_date: Mapped[date | None]
    country: Mapped[str] = mapped_column(String(50))
