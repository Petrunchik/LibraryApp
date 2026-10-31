from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, String, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base
from models.payments import PaymentStatus, payment_status_type


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    payment_id: Mapped[UUID] = mapped_column(ForeignKey("payments.id"), index=True)
    provider: Mapped[str] = mapped_column(String(50), nullable=False)
    provider_transaction_id: Mapped[UUID] = mapped_column(nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(payment_status_type)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    completed_at: Mapped[datetime | None]
    error_code: Mapped[int | None]
    error_message: Mapped[str | None]