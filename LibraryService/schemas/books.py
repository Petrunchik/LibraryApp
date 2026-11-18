from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


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
    title: str
    description: str
    pages: int
    publication_year: int
    image_url: str | None
    is_active: bool
    language: str
    publisher_id: int = Field(ge=1, description="ID издателя (не менее 1)")


class EditBook(BaseModel):
    title: str | None
    description: str | None
    pages: int | None
    publication_year: int | None
    image_url: str | None
    is_active: bool | None
    language: str | None
    publisher_id: int | None = Field(ge=1, description="ID издателя (не менее 1)")
