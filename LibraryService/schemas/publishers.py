
from pydantic import BaseModel

class PublisherResponse(BaseModel):
    id: int
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
