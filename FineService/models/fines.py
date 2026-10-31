from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Enum as SAEnum, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base
from core.fine_status import FineStatus


fine_status_type = SAEnum(
    FineStatus,
    name="fine_status",
    values_callable=lambda statuses: [status.value for status in statuses],
    metadata=Base.metadata,
)


class Fine(Base):
    __tablename__ = "fines"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    loan_id: Mapped[UUID] = mapped_column(index=True)
    user_id: Mapped[UUID] = mapped_column(index=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3))
    status: Mapped[FineStatus] = mapped_column(
        fine_status_type,
        default=FineStatus.UNPAID,
        server_default=FineStatus.UNPAID.value,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
