from pydantic import BaseModel, Field, ConfigDict, EmailStr, ValidationError
from decimal import Decimal
from datetime import datetime
from typing import Annotated
from fastapi import Form
from uuid import UUID


class DefaultBookAnswer(BaseModel):
    id: UUID = Field(..., description="ID книги")
    title: str = Field(..., min_length=1, max_length=60, description="Название книги")
    description: str = Field(..., description="Описание книги")
    pages: int = Field(..., ge=1, description="Количество страниц в книге (не менее 1)")
    author: str = Field(..., min_length=3, max_length=200, description="Автор книги (от 3 до 200 символов)")
    year_of_release: int = Field(..., ge=1500, le=2026, description="Год издания книги (с 1500 до 2027 года)")
    image_url: str | None = Field(None, description="Ссылка на изображение")
    is_active: bool = Field(..., description="Активность товара")
    publisher: str | None = Field(None, description="Издательство книги")
    genre: str | None = Field(None, description="Жанр книги")


class BookAnswer(DefaultBookAnswer):
    total: int


class BookCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=60, description="Название книги")
    description: str = Field(..., description="Описание книги")
    pages: int = Field(..., ge=1, description="Количество страниц в книге (не менее 1)")
    author: str = Field(..., min_length=3, max_length=200, description="Автор книги (от 3 до 200 символов)")
    year_of_release: int = Field(..., ge=1500, le=2026, description="Год издания книги (с 1500 до 2027 года)")
    image_url: str | None = Field(None, description="Ссылка на изображение")
    publisher: str | None = Field(None, description="Издательство книги")
    genre: str | None = Field(None, description="Жанр книги")


class EditBook(DefaultBookAnswer):
    pass