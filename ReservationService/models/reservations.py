from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from sqlalchemy import String, func, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class ReservationStatus(str, Enum):
    WAITING = "waiting"
    READY = "ready"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    COMPLETED = "completed"


reservation_status_type = SAEnum(
    ReservationStatus,
    name="reservation_status",
    values_callable=lambda statuses: [status.value for status in statuses],
    metadata=Base.metadata,
)


class Reservation(Base):
    __tablename__ = "reservations"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_public_id: Mapped[str] = mapped_column(String(40), nullable=False)
    book_public_id: Mapped[str] = mapped_column(String(40), nullable=False)
    book_copy_id: Mapped[UUID | None]
    status: Mapped[ReservationStatus] = mapped_column(
        reservation_status_type,
        default=ReservationStatus.WAITING,
        server_default=ReservationStatus.WAITING.value
    )
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    expires_at: Mapped[datetime | None]
    assigned_at: Mapped[datetime | None] 
    cancelled_at: Mapped[datetime | None] 
    updated_at: Mapped[datetime | None] = mapped_column(onupdate=func.now())