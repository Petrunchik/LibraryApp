from datetime import datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID, uuid4

from sqlalchemy import String, Numeric, func, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


payment_status_type = SAEnum(
    PaymentStatus,
    name="payment_status",
    values_callable=lambda statuses: [status.value for status in statuses],
    metadata=Base.metadata,
)


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(nullable=False)
    fine_id: Mapped[UUID] = mapped_column(nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(
        payment_status_type,
        default=PaymentStatus.PENDING,
        server_default=PaymentStatus.PENDING.value,
    )
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    paid_at: Mapped[datetime | None]