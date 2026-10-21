from uuid import UUID

from pydantic import BaseModel

class ReviewResponse(BaseModel):
    id: UUID
    grade: int
    reader_id: int
    book_id: UUID


class AddReview(BaseModel):
    grade: int
    book_id: UUID


class EditReview(BaseModel):
    grade: int