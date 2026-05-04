from sqlalchemy import Text, Date, ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from uuid import UUID
from datetime import datetime, date

class Notification(Base):
    __tablename__ = "notifications"
    id: Mapped[UUID] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    text: Mapped[str | None] = mapped_column(Text)
    isPosted: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    date_of_post: Mapped[date] = mapped_column(Date, default=datetime.now, nullable=False)

    author_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False)

    author: Mapped["User"] = relationship(
        "User", 
        back_populates="notification"
    )