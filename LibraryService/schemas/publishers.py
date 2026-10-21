from uuid import UUID

from pydantic import BaseModel

class PublisherResponse(BaseModel):
    id: UUID
    name: str
    city: str
    country: str


class AddPublisher(BaseModel):
    name: str
    city: str
    country: str


class EditPublisher(BaseModel):
    name: str
    city: str
    country: str
