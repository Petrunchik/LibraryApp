from sqlalchemy import String, Numeric, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from uuid import UUID
from datetime import datetime, date
from decimal import Decimal

class Fines(Base):
    __tablename__ = "fines"
    id: Mapped[UUID] = mapped_column(primary_key=True)
    summ: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    reason: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="sended", nullable=False)
    date_of_create: Mapped[date] = mapped_column(default=datetime.now, nullable=False)
    date_of_pay: Mapped[date | None] = mapped_column(Date)

    reader_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    loan_id: Mapped[UUID] = mapped_column(ForeignKey("loans.id"), unique=True, nullable=False)
    manager_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False)

    reader: Mapped["User"] = relationship(
        "User",
        foreign_keys=[reader_id],
        back_populates="fines_reader"
    )
    manager: Mapped["User"] = relationship(
        "User",
        foreign_keys=[manager_id], 
        back_populates="fines_manager"
    )
    loan: Mapped["Loan"] = relationship(
        "Loan",
        back_populates="fine",
        uselist=False
    )