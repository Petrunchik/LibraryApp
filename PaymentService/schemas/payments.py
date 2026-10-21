from uuid import UUID
from decimal import Decimal
from datetime import datetime
from enum import Enum

from pydantic import BaseModel

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class PaymentResponse(BaseModel):
    id: UUID
    fine_id: UUID
    amount: Decimal
    user_id: UUID
    status: PaymentStatus
    created_at: datetime
    paid_at: datetime | None
    currency: str

class CreatePaymentRequest(BaseModel):
    fine_id: UUID
    amount: Decimal
    currency: str

class WebhookPaymentObject(BaseModel):
    id: str
    status: str
    paid: bool
    amount: Decimal
    currency: str

class WebhookRequest(BaseModel):
    type: str
    event: str
    object: WebhookPaymentObject