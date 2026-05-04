from uuid import uuid4, UUID
from fastapi import APIRouter, Depends, status, HTTPException, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db_depends import get_async_db
from app.models import User, Loan, Fines, Reservation, Book, BookCopy
import jwt
from settings import SECRET_KEY, ALGORITHM
from app.schemas.users import UserAnswer, UserCreate, UserPhone, UserPhoneAnswer, UserDefaultAnswer
from app.auth.auth import hash_password, verify_password, create_access_token, create_refresh_token, get_current_manager, get_current_loggined, get_current_reader

router = APIRouter(
    prefix="/rating",
    tags=["rating"]
)