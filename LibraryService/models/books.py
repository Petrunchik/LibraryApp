from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text, func, text, Sequence
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


book_public_id_seq = Sequence(
    "book_public_id_seq",
    start=1,
    increment=1,
    metadata=Base.metadata,
)


class Book(Base):
    __tablename__ = "books"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    book_public_id: Mapped[str] = mapped_column(
        String(12),
        server_default=text(
            "'book_' || LPAD(nextval('book_public_id_seq')::text, 6, '0')"
        ),
        unique=True,
        nullable=False,
    )
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
