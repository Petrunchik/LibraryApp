from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, func, Text
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base
from models.reservations import ReservationStatus, reservation_status_type


class ReservationHistory(Base):
    __tablename__ = "reservation_history"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    reservation_id: Mapped[UUID] = mapped_column(ForeignKey("reservations.id"), index=True)
    old_status: Mapped[ReservationStatus] = mapped_column(reservation_status_type)
    new_status: Mapped[ReservationStatus] = mapped_column(reservation_status_type)
    changed_at: Mapped[datetime] = mapped_column(server_default=func.now())
    reason: Mapped[str] = mapped_column(Text)