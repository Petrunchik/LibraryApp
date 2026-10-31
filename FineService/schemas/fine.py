from decimal import Decimal
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel

from core.fine_status import FineStatus


class FineResponse(BaseModel):
    id: UUID
    loan_id: UUID
    user_id: UUID
    amount: Decimal
    currency: str
    status: FineStatus
    created_at: datetime
