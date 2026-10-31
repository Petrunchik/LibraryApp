from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text, func, text
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class Book(Base):
    __tablename__ = "books"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    book_public_id: Mapped[str] = mapped_column(String(11), unique=True)
    title: Mapped[str] = mapped_column(String(60))
    description: Mapped[str] = mapped_column(Text)
    pages: Mapped[int]
    publication_year: Mapped[int]
    image_url: Mapped[str | None] = mapped_column(String(200))
    is_active: Mapped[bool] = mapped_column(default=True, server_default=text("true"))
    language: Mapped[str] = mapped_column(String(40))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    publisher_id: Mapped[int] = mapped_column(ForeignKey("publishers.id"))
