
from pydantic import BaseModel

class GenreResponse(BaseModel):
    id: int
    name: str


class AddGenre(BaseModel):
    name: str


class EditGenre(BaseModel):
    name: str
