from pydantic import BaseModel, Field, ConfigDict, EmailStr, ValidationError
from decimal import Decimal
from datetime import datetime
from fastapi import Form
from uuid import UUID
from datetime import datetime, date


class LoanCreate(BaseModel):
    user_id: UUID = Field(..., description="ID пользователя")
    book_copy_id: UUID = Field(..., description="ID конкретной книги")
    days: int = Field(..., ge=1, description="Количество дней на прочтение")


class ReturnBook(BaseModel):
    book_copy_id: UUID = Field(..., description="ID конкретной книги")
    comment: str | None = Field(default='', description="Комментарий")


class LoanAnswer(BaseModel):
    id: UUID = Field(..., description="ID операции")
    date_of_loan: date = Field(..., description="Дата выдачи")
    date_of_expected_return: date = Field(..., description="Ожидаемая дата возврата")
    date_of_return: date | None = Field(..., description="Дата возврата")
    user_id: UUID = Field(..., description="ID пользователя")
    bookCopy_id: UUID = Field(..., description="ID конкретной книги")
    comment: str | None = Field(..., description="Комментарий")