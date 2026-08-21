from pydantic import BaseModel, Field, ConfigDict, EmailStr, ValidationError
from decimal import Decimal
from datetime import datetime
from typing import Annotated
from fastapi import Form
from uuid import UUID


class DefaultBookAnswer(BaseModel):
    id: UUID = Field(..., description="ID книги")
    book_public_id: str = Field(..., description="Публичный id книги")
    title: str = Field(..., min_length=1, max_length=60, description="Название книги")
    description: str = Field(..., description="Описание книги")
    pages: int = Field(..., ge=1, description="Количество страниц в книге (не менее 1)")
    year_of_release: int = Field(..., ge=1500, le=2026, description="Год издания книги (с 1500 до 2026 года)")
    image_url: str | None = Field(None, description="Ссылка на обложку книги")
    is_active: bool = Field(..., description="Доступность книги")
    language: str | None = Field(None, max_length=40, description="Язык книги")
    publisher_id: str | list | None = Field(None, ge=1, description="Издательство книги")
    age_restriction: int | None = Field(..., description="Возрастное ограничение")


class BookAnswer(DefaultBookAnswer):
    total: int
    authors: str = Field(..., min_length=3, max_length=200, description="Автор книги (от 3 до 200 символов)")
    genres: str | list | None = Field(None, description="Жанр книги")


class BookCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=60, description="Название книги")
    description: str = Field(..., description="Описание книги")
    pages: int = Field(..., ge=1, description="Количество страниц в книге (не менее 1)")
    author_ids: list[int] = Field(..., min_length=1, description="ID автора / авторов книги")
    year_of_release: int = Field(..., ge=1500, le=2026, description="Год издания книги (с 1500 до 2026 года)")
    image_url: str | None = Field(None, description="Ссылка на обложку книги")
    language: str | None = Field(None, max_length=40, description="Язык книги")
    publisher_id: int = Field(..., ge=1, description="ID издательства книги")
    genre_ids: list[int] = Field(..., min_length=1, description="ID жанра / жанров книги")
    age_restriction: int | None = Field(None, description="Возрастное ограничение")


class EditBook(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=60, description="Название книги")
    description: str | None = Field(None, description="Описание книги")
    pages: int | None = Field(None, ge=1, description="Количество страниц в книге (не менее 1)")
    author_ids: list[int] | None = Field(None, description="ID автора / авторов книги")
    year_of_release: int | None = Field(None, ge=1500, le=2026, description="Год издания книги (с 1500 до 2026 года)")
    image_url: str | None = Field(None, description="Ссылка на обложку книги")
    language: str | None = Field(None, max_length=40, description="Язык книги")
    publisher_id: int | None = Field(None, ge=1, description="ID издательства книги")
    genre_ids: list[int] | None = Field(None, description="ID жанра / жанров книги")
    age_restriction: int | None = Field(None, description="Возрастное ограничение")