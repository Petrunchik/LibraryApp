from uuid import UUID, uuid4
from datetime import datetime

from sqlalchemy import Enum as SAEnum, String, Sequence, text, func
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base
from core.user_role import UserRole


user_public_id_seq = Sequence(
    "user_public_id_seq",
    start=1,
    increment=1,
    metadata=Base.metadata,
)


user_role_type = SAEnum(
    UserRole,
    name="user_role",
    values_callable=lambda roles: [role.value for role in roles],
    metadata=Base.metadata,
)


class User(Base):
    __tablename__ = "users"
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_public_id: Mapped[str] = mapped_column(
        String(12),
        server_default=text(
            "'user_' || LPAD(nextval('user_public_id_seq')::text, 6, '0')"
        ),
        unique=True,
        nullable=False,
    )
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), unique=True)
    password: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str | None] = mapped_column(unique=True)
    role: Mapped[UserRole] = mapped_column(
        user_role_type,
        default=UserRole.READER,
        server_default=UserRole.READER.value,
    )
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())
    is_blocked: Mapped[bool] = mapped_column(default=False)
    reason: Mapped[str | None]
