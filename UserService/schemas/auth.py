from uuid import UUID
from datetime import datetime

from pydantic import BaseModel
from core.user_role import UserRole as UserRoleScheme

class UserRegisterRequest(BaseModel):
    first_name: str
    last_name: str
    phone: str
    email: str
    password: str

class UserLoginRequest(BaseModel):
    phone: str
    password: str

class UserAuthResponse(BaseModel):
    id: UUID
    user_public_id: str
    phone_number: str
    email: str
    first_name: str
    last_name: str
    role: UserRoleScheme
    is_active: bool
    is_blocked: bool
    reason: str | None
    created_at: datetime
    updated_at: datetime
    access_token: str
    refresh_token: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
