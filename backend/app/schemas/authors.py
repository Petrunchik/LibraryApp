from pydantic import BaseModel, Field, ConfigDict, EmailStr, ValidationError
from decimal import Decimal
from datetime import datetime, date
from typing import Annotated
from fastapi import Form
from uuid import UUID


class AddAuthors(BaseModel):
    first_name: str
    last_name: str
    birth_year: date
    death_year: date
    country: str