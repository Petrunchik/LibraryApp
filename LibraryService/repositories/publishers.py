from typing import Sequence

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from models.publishers import Publisher

class PublisherRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db


    async def get_publishers(self, skip: int, limit: int) -> Sequence[Publisher | None]:
        publishers = await self.db.scalars(select(Publisher).offset(skip).limit(limit))
        return publishers.all()


    async def get_publisher(self, publisher_id: int) -> Publisher | None:
        publisher = await self.db.scalar(select(Publisher).where(Publisher.id == publisher_id))
        if publisher is None:
            return None
        return publisher


    async def add_publisher(self, publisher_data: dict) -> Publisher:
        publisher = Publisher(**publisher_data)
        self.db.add(publisher)
        await self.db.commit()
        await self.db.refresh(publisher)
        return publisher


    async def edit_publisher(self, publisher_id: int, publisher_data: dict) -> Publisher | None:
        publisher = await self.db.execute(
            update(Publisher)
            .where(Publisher.id == publisher_id)
            .values(**publisher_data)
            .returning(Publisher)
        )
        result = publisher.scalar_one_or_none()
        if result is None:
            return None
        await self.db.commit()
        return result


    async def delete_publisher(self, publisher_id: int) -> bool:
        result = await self.db.execute(delete(Publisher).where(Publisher.id == publisher_id).returning(Publisher))
        await self.db.commit()
        return result.scalar_one_or_none() is not None