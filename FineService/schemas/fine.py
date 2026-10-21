from decimal import Decimal
from uuid import UUID
from datetime import datetime
from enum import Enum

from pydantic import BaseModel

class FineStatus(str, Enum):
    UNPAID = "unpaid"
    PAID = "paid"
    CANCELLED = "cancelled"


class FineResponse(BaseModel):
    id: UUID
    loan_id: UUID
    user_id: UUID
    amount: Decimal
    currency: str
    status: FineStatus
    created_at: datetime