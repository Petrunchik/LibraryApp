from sqlalchemy import String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from uuid import UUID
from datetime import datetime, date


class Reservation(Base):
    __tablename__="reservation"
    id: Mapped[UUID] = mapped_column(primary_key=True)
    date_of_create: Mapped[date] = mapped_column(Date, default=datetime.now, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="sent", nullable=False)
    date_of_expire: Mapped[date | None] = mapped_column(Date)
    
    manager_id: Mapped[UUID | None] = mapped_column(ForeignKey("users.id"))
    book_id: Mapped[UUID] = mapped_column(ForeignKey("books.id"), nullable=False)
    reader_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False)

    book: Mapped["Book"] = relationship(
        "Book",
        back_populates="reservation"
    )

    reader: Mapped["User"] = relationship(
        "User",
        foreign_keys=[reader_id],
        back_populates="reservation"
    )

    manager: Mapped["User"] = relationship(
        "User",
        foreign_keys=[manager_id],
        back_populates="reservation_manager"
    )