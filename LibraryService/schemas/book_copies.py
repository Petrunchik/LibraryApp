from enum import Enum
from uuid import UUID

from pydantic import BaseModel

class BookCopyStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    LOANED = "LOANED"
    LOST = "LOST"


class BookCopyResponse(BaseModel):
    id: UUID
    status: BookCopyStatus
    inventory_number: str
    book_id: UUID
    is_active: bool


class AddBookCopy(BaseModel):
    status: BookCopyStatus
    book_id: UUID


class EditBookCopy(BaseModel):
    status: BookCopyStatus
    book_id: UUID
