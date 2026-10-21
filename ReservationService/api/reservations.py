from typing import List
from uuid import UUID

from fastapi import APIRouter

from schemas.reservations import ReservationResponse, CreateReservationRequest, QueuePositionResponse

router = APIRouter(
    prefix="/reservations",
    tags=["reservations"]
)

@router.get("/my", response_model=List[ReservationResponse])
async def get_my_reservation():
    """
    Функция для получения бронирований пользователя
    """
    return


@router.get("/queue/position", response_model=QueuePositionResponse)
async def get_queue_position(reservation_id: UUID):
    """
    Функция для получения номера в очереди на бронирование
    """
    return


@router.post("/create", response_model=ReservationResponse)
async def create_reservation(request: CreateReservationRequest):
    """
    Функция для создания бронирования
    """
    return


@router.delete("/cancel", response_model=ReservationResponse)
async def cancel_reservation(reservation_id: UUID):
    """
    Функция для отмены бронирования
    """
    return