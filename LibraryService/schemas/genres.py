from uuid import UUID

from pydantic import BaseModel

class GenreResponse(BaseModel):
    id: UUID
    name: str


class AddGenre(BaseModel):
    name: str


class EditGenre(BaseModel):
    name: str
