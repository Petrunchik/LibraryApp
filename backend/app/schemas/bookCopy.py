from pydantic import BaseModel, Field, ConfigDict, EmailStr, ValidationError
from decimal import Decimal
from datetime import datetime
from typing import Annotated
from fastapi import Form
from uuid import UUID


class CreateBookCopy(BaseModel):
    book_id: UUID = Field(..., description="ID книги")
    status: str = Field(..., description="Статус книги")