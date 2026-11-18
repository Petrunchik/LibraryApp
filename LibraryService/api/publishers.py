from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from schemas.publishers import PublisherResponse, AddPublisher, EditPublisher
from core.dependencies import get_publishers_service
from services.publishers import PublisherService, PublisherNotFound

router = APIRouter(
    prefix="/publishers",
    tags=["publishers"]
)

@router.get("/", response_model=List[PublisherResponse])
async def get_publishers(
    skip: int = 0, 
    limit: int = 20, 
    publishers_service: PublisherService = Depends(get_publishers_service)
):
    """
    Функция для получения всех издателей
    """
    publishers = await publishers_service.get_publishers(skip, limit)
    return publishers


@router.get("/info/{publisher_id}", response_model=PublisherResponse)
async def get_publisher(publisher_id: int, publishers_service: PublisherService = Depends(get_publishers_service)):
    """
    Функция для получения информации об издателе
    """
    try:
        publisher = await publishers_service.get_publisher(publisher_id)
    except PublisherNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Издатель не найден")
    return publisher


@router.post("/add", response_model=PublisherResponse)
async def add_publisher(publisher_data: AddPublisher, publishers_service: PublisherService = Depends(get_publishers_service)):
    """
    Функция для добавления издателя
    """
    publisher = await publishers_service.add_publisher(publisher_data)
    return publisher


@router.put("/edit/{publisher_id}", response_model=PublisherResponse)
async def edit_publisher(
    publisher_id: int,
    publisher_data: EditPublisher,
    publishers_service: PublisherService = Depends(get_publishers_service)
):
    """
    Функция для изменения издателя
    """
    try:
        publisher = await publishers_service.edit_publisher(publisher_id, publisher_data)
    except PublisherNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Издатель не найден")
    return publisher


@router.delete("/delete/{publisher_id}", status_code=status.HTTP_200_OK)
async def delete_publisher(publisher_id: int, publishers_service: PublisherService = Depends(get_publishers_service)):
    """
    Функция для удаления издателя
    """
    try:
        publisher = await publishers_service.delete_publisher(publisher_id)
        if publisher is False:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Издатель не найден")
    except PublisherNotFound:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Издатель не найден")
    return {"message": "Издатель удален"}
