from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class Publisher(Base):
    __tablename__ = "publishers"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50))
    city: Mapped[str] = mapped_column(String(50))
    country: Mapped[str] = mapped_column(String(50))
