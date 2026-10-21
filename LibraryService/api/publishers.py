from typing import List

from fastapi import APIRouter

from schemas.publishers import PublisherResponse, AddPublisher, EditPublisher

router = APIRouter(
    prefix="/publishers",
    tags=["publishers"]
)

@router.get("/", response_model=List[PublisherResponse])
async def get_publishers():
    """
    Функция для получения всех издателей
    """
    return


@router.get("/info", response_model=PublisherResponse)
async def get_publisher(publisher_id: int):
    """
    Функция для получения информации об издателе
    """
    return


@router.post("/add", response_model=PublisherResponse)
async def add_publisher(publisher_data: AddPublisher):
    """
    Функция для добавления издателя
    """
    return


@router.put("/edit", response_model=PublisherResponse)
async def edit_publisher(publisher_data: EditPublisher):
    """
    Функция для изменения издателя
    """
    return


@router.delete("/delete")
async def delete_publisher(publisher_id: int):
    """
    Функция для удаления издателя
    """
    return
