from typing import List
from uuid import UUID

from fastapi import APIRouter

from schemas.loans import LoanResponse

router = APIRouter(
    prefix="/loans",
    tags=["loans"]
)

@router.get("/user", response_model=List[LoanResponse])
async def get_user_loans(user_public_id: str):
    """
    Функция для получения выдач пользователя
    """
    return


@router.get("/info", response_model=LoanResponse)
async def get_loan_info(loan_id: int):
    """
    Функция для получения информации о выдаче
    """
    return


@router.post("/issue", response_model=LoanResponse)
async def issue_book(book_copy_id: UUID, user_public_id: str):
    """
    Функция для выдачи книги пользователю
    """
    return


@router.post("/return", response_model=LoanResponse)
async def return_book(book_copy_id: UUID):
    """
    Функция для возврата книги
    """
    return
