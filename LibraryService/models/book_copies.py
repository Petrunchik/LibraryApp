from enum import Enum
from uuid import UUID, uuid4

from sqlalchemy import Enum as SAEnum
from sqlalchemy import ForeignKey, String, text
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class BookCopyStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    LOANED = "LOANED"
    LOST = "LOST"


book_copy_status_type = SAEnum(
    BookCopyStatus,
    name="book_copy_status",
    values_callable=lambda statuses: [status.value for status in statuses],
    metadata=Base.metadata,
)


class BookCopy(Base):
    __tablename__ = "book_copies"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    status: Mapped[BookCopyStatus] = mapped_column(
        book_copy_status_type,
        default=BookCopyStatus.AVAILABLE,
        server_default=BookCopyStatus.AVAILABLE.value,
    )
    inventory_number: Mapped[str] = mapped_column(String(15), unique=True)
    book_id: Mapped[UUID] = mapped_column(ForeignKey("books.id"))
    is_active: Mapped[bool] = mapped_column(default=True, server_default=text("true"))
