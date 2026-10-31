from datetime import date

from pydantic import BaseModel

class AuthorResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    birth_date: date
    death_date: date | None
    country: str


class AddAuthor(BaseModel):
    first_name: str
    last_name: str
    birth_date: date
    death_date: date | None
    country: str


class EditAuthor(BaseModel):
    first_name: str
    last_name: str
    birth_date: date
    death_date: date | None
    country: str
