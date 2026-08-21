from pydantic import BaseModel, Field, ConfigDict, EmailStr, ValidationError, field_validator
from decimal import Decimal
from datetime import datetime
from typing import Annotated
from fastapi import Form
from uuid import UUID


class GenreBase(BaseModel):
    id: int = Field(..., description="ID жанра")
    name: str = Field(..., max_length=30, description="Название жанра (не более 30 символов)")


class CreateGenre(BaseModel):
    name: str = Field(..., max_length=30, description="Название жанра (не более 30 символов)")