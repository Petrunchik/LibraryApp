from typing import Sequence

from schemas.publishers import PublisherResponse, AddPublisher, EditPublisher

class PublisherNotFound(Exception):
    """Издатель не найден"""
    pass


class PublisherService:
    def __init__(self, publisher_repo) -> None:
        self.publisher_repo = publisher_repo


    async def get_publishers(self, skip: int, limit: int) -> Sequence[PublisherResponse | None]:
        publishers = await self.publisher_repo.get_publishers(skip, limit)
        return publishers


    async def get_publisher(self, publisher_id: int) -> PublisherResponse | None:
        publisher = await self.publisher_repo.get_publisher(publisher_id)
        if publisher is None:
            raise PublisherNotFound("Издатель не найден")
        return publisher


    async def add_publisher(self, publisher_data: AddPublisher) -> PublisherResponse:
        publisher = await self.publisher_repo.add_publisher(publisher_data.model_dump())
        return publisher


    async def edit_publisher(self, publisher_id: int, publisher_data: EditPublisher) -> PublisherResponse:
        publisher = await self.publisher_repo.edit_publisher(publisher_id, publisher_data.model_dump(exclude_none=True))
        if publisher is None:
            raise PublisherNotFound("Издатель не найден")
        return publisher


    async def delete_publisher(self, publisher_id: int) -> PublisherResponse:
        result = await self.publisher_repo.delete_publisher(publisher_id)
        if result is None:
            raise PublisherNotFound
        return result