from typing import List
from uuid import UUID

from fastapi import APIRouter, status

from schemas.payments import PaymentResponse, CreatePaymentRequest, WebhookRequest

router = APIRouter(
    prefix="/payments",
    tags=["payments"]
)

@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(payment_id: UUID):
    """
    Функция для получения информации о платеже
    """
    return


@router.get("/user", response_model=List[PaymentResponse])
async def get_user_payments():
    """
    Функция для получения платежей пользователя
    """
    return


@router.post("/create", response_model=PaymentResponse)
async def create_payment(request: CreatePaymentRequest):
    """
    Функция для создания платежа
    """
    return


@router.get("/webhook", status_code=status.HTTP_200_OK)
async def payment_webhook(data: WebhookRequest):
    """
    Функция для обработки webhook платежа
    """
    return
