from pydantic import BaseModel, Field, ConfigDict, EmailStr, ValidationError
from decimal import Decimal
from datetime import datetime
from typing import Annotated
from fastapi import Form
from uuid import UUID
from datetime import datetime


class UserDefaultAnswer(BaseModel):
    id: UUID = Field(..., description="ID пользователя")
    role: str = Field(..., description="Роль пользователя")
    first_name: str = Field(..., description="Имя пользователя")
    last_name: str = Field(..., description="Фамилия пользователя")
    phone_number: str = Field(..., description="Телефон пользователя")
    date_of_create: datetime = Field(..., description="Дата создания пользователя")
    date_of_update: datetime = Field(..., description="Дата обновления пользователя")
    is_active: bool = Field(..., description="Активность пользователя")


class UserAnswer(UserDefaultAnswer):
    access_token: str = Field(..., description="Токен доступа")
    token_type: str = Field(..., description="Тип токена")


class UserCreate(BaseModel):
    role: str = Field(default="reader", pattern="^(reader|manager|admin)$", description="Роль пользователя (reader | manager | admin)")
    first_name: str = Field(..., min_length=2, max_length=30, description="Имя пользователя (2-30 символов)")
    last_name: str = Field(..., min_length=2, max_length=100, description="Фамилия пользователя (2-100 символов)")
    phone_number: str = Field(..., description="Телефон пользователя")
    password: str = Field(..., min_length=8, max_length=30, description="Пароль пользователя")


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class UserPhone(BaseModel):
    phone: str = Field(..., min_length=11, max_length=11, description="Телефон пользователя")


class UserPhoneAnswer(BaseModel):
    id: UUID = Field(..., description="ID пользователя")
    last_name: str = Field(..., description="Фамилия пользователя")
    first_name: str = Field(..., description="Имя пользователя")
    phone_number: str = Field(..., description="Телефон пользователя")
    role: str = Field(..., description="Роль пользователя")
    date_of_create: datetime = Field(..., description="Дата создания")
    date_of_update: datetime = Field(..., description="Дата обновления")
    is_active: bool = Field(..., description="Активность пользователя")
    active_loans: int = Field(..., description="Активные бронирования")
    # debts: int = Field(..., description="Задолженности")


class UserReference(BaseModel):
    id: UUID | None = Field(..., description="ID пользователя")
    phone_number: str | None = Field(..., description="Телефон пользователя")