from pydantic import BaseModel, Field, ConfigDict, EmailStr, ValidationError, field_validator
from decimal import Decimal
from datetime import datetime
from typing import Annotated
from fastapi import Form
from uuid import UUID


class BasePublisher(BaseModel):
    pass


class AddPublisher(BaseModel):
    name: str = Field(..., max_length=50, description="Название издательства.")
    city: str = Field(..., max_length=50, description="Город издательства.")
    country: str = Field(..., max_length=50, description="Страна издательства.")