from uuid import UUID
from datetime import datetime
from typing import TypeVar, Generic

from pydantic import BaseModel, Field


T = TypeVar("T")

class DefaultMessage(BaseModel, Generic[T]):
    event_id: UUID
    occurred_at: datetime = Field(default_factory=datetime.now)
    payload: T