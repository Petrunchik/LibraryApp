from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.users import User

class UserRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db


    async def get_user_by_phone_number(self, phone_number: str) -> User | None:
        user = await self.db.scalar(select(User).where(User.phone_number == phone_number))
        if user is None:
            return None
        return user


    async def get_user_by_public_id(self, user_public_id: str):
        user = await self.db.scalar(
            select(User).where(
                User.user_public_id == user_public_id, 
                User.is_active == True,
                User.is_blocked == False,
            )
        )
        if user is None:
            return None
        return user
    

    async def register(self, user_data: dict) -> User:
        user = User(**user_data)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user