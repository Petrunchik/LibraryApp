from pydantic import BaseModel, Field, ConfigDict, EmailStr, ValidationError
from decimal import Decimal
from datetime import datetime
from typing import Annotated
from fastapi import Form
from uuid import UUID
from datetime import datetime


class ReseravtionCreate(BaseModel):
    book_id: UUID = Field(..., description="ID книги")