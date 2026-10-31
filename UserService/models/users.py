from uuid import UUID, uuid4
from datetime import datetime

from sqlalchemy import String, Sequence, text, func
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


user_public_id_seq = Sequence(
    "user_public_id_seq",
    start=1,
    increment=1
)


class User(Base):
    __tablename__ = "users"
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_public_id: Mapped[str] = mapped_column(
        String(12),
        Sequence("user_public_id_seq", start=1, increment=1),
        server_default=text("'user_' || LPAD(nextval('user_public_id_seq')::text, 6, '0')"),
        unique=True,
        nullable=False
    )
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), unique=True)
    password: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str | None] = mapped_column(unique=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())
    is_blocked: Mapped[bool] = mapped_column(default=False)
    reason: Mapped[str | None]