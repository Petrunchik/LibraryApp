from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class Loan(Base):
    __tablename__ = "loans"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    loaned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    book_copy_id: Mapped[UUID] = mapped_column(ForeignKey("book_copies.id"))
    returned_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    user_id: Mapped[UUID]
    issued_by: Mapped[UUID]
    accepted_by: Mapped[UUID | None]
