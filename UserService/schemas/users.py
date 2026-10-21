from uuid import UUID
from datetime import datetime

from pydantic import BaseModel

from schemas.auth import UserRoleScheme

class UserResponse(BaseModel):
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


class UserRoleUpdateRequest(BaseModel):
    user_public_id: str
    role: UserRoleScheme


class UserBlockRequest(BaseModel):
    user_public_id: str
    is_blocked: bool
    reason: str
