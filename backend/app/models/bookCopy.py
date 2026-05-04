from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from uuid import UUID

class BookCopy(Base):
    __tablename__ = "book_copy"
    id: Mapped[UUID] = mapped_column(primary_key=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    inventory_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    book_id: Mapped[UUID] = mapped_column(ForeignKey("books.id"), nullable=False)

    book: Mapped["Book"] = relationship(
        "Book",
        back_populates="bookCopy"
    )
    
    loan: Mapped["Loan"] = relationship(
        "Loan",
        back_populates="bookCopy"
    )