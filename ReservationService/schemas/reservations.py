from uuid import UUID
from datetime import datetime

from pydantic import BaseModel

class ReservationResponse(BaseModel):
    id: UUID
    user_public_id: str
    book_public_id: str
    book_copy_id: UUID | None
    status: None
    queue_position: int | None
    created_at: datetime
    expires_at: datetime | None


class CreateReservationRequest(BaseModel):
    book_public_id: str


class QueuePositionResponse(BaseModel):
    reservation_id: UUID
    book_public_id: str
    position: int
    waiting_count: int