from pydantic import BaseModel, Field, ConfigDict, EmailStr, ValidationError
from decimal import Decimal
from datetime import datetime
from typing import Annotated
from fastapi import Form
from uuid import UUID


class ReviewCreate(BaseModel):
    book_id: UUID = Field(..., description="ID книги")
    grade: int = Field(..., ge=1, le=5, description="Оценка (от 1 до 5)")