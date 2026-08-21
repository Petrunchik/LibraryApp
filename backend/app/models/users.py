from sqlalchemy import String, Boolean, DateTime, Sequence, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from uuid import UUID
from datetime import datetime, date


user_public_id_seq = Sequence(
    "user_public_id_seq",
    start=1,
    increment=1
)

class User(Base):
    __tablename__ = "users"
    id: Mapped[UUID] = mapped_column(primary_key=True)
    public_id: Mapped[str] = mapped_column(
        String(11),
        unique=True,
        nullable=False,
        server_default=text(
            "'user_' || LPAD(nextval('user_public_id_seq')::text, 6, '0')"
        ))
    role: Mapped[str] = mapped_column(String(20), default="reader", nullable=False)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(100), nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    date_of_create: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, nullable=False)
    date_of_update: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    reservation: Mapped[list["Reservation"]] = relationship(
        "Reservation",
        foreign_keys="Reservation.reader_id",
        back_populates="reader",
    )
    reservation_manager: Mapped[list["Reservation"]] = relationship(
        "Reservation",
        foreign_keys="Reservation.manager_id",
        back_populates="manager",
    )

    loan: Mapped[list["Loan"]] = relationship(
        "Loan",
        back_populates="user"
    )

    fines_reader: Mapped[list["Fines"]] = relationship(
        "Fines",
        foreign_keys="Fines.reader_id",
        back_populates="reader"
    )
    fines_manager: Mapped[list["Fines"]] = relationship(
        "Fines",
        foreign_keys="Fines.manager_id",
        back_populates="manager"
    )
    review: Mapped[list["Review"]] = relationship(
        "Review",
        back_populates="user"
    )
    notification: Mapped[list["Notification"]] = relationship(
        "Notification", 
        back_populates="author"
    )
