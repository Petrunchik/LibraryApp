from typing import List
from uuid import UUID

from fastapi import APIRouter

from schemas.reviews import ReviewResponse, EditReview, AddReview

router = APIRouter(
    prefix="/reviews",
    tags=["reviews"]
)

@router.get("/user", response_model=List[ReviewResponse])
async def get_user_grade(user_public_id: str):
    """
    Функция для получения оценок пользователя
    """
    return


@router.get("/book", response_model=List[ReviewResponse])
async def get_book_grade(book_public_id: str):
    """
    Функция для получения оценок книги
    """
    return


@router.post("/add", response_model=ReviewResponse)
async def add_grade(grade_data: AddReview):
    """
    Функция для добавления оценки
    """
    return


@router.put("/edit", response_model=ReviewResponse)
async def edit_grade(grade_data: EditReview):
    """
    Функция для изменения оценки
    """
    return


@router.delete("/delete")
async def delete_grade(grade_id: UUID):
    """
    Функция для удаления оценки
    """
    return
