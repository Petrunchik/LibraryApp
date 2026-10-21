from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

class BookResponse(BaseModel):
    id: UUID
    book_public_id: str
    title: str
    description: str
    pages: int
    publication_year: int
    image_url: str | None
    is_active: bool
    language: str
    created_at: datetime
    updated_at: datetime
    publisher_id: int


class CreateBook(BaseModel):
    id: UUID
    book_public_id: str
    title: str
    description: str
    pages: int
    publication_year: int
    image_url: str | None
    is_active: bool
    language: str
    created_at: datetime
    updated_at: datetime
    publisher_id: int


class EditBook(BaseModel):
    id: UUID
    book_public_id: str
    title: str
    description: str
    pages: int
    publication_year: int
    image_url: str | None
    is_active: bool
    language: str
    created_at: datetime
    updated_at: datetime
    publisher_id: int
