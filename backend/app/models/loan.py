from sqlalchemy import Text, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from uuid import UUID
from datetime import datetime, date

class Loan(Base):
    __tablename__ = "loans"
    id: Mapped[UUID] = mapped_column(primary_key=True)
    date_of_loan: Mapped[date] = mapped_column(Date, default=datetime.now, nullable=False)
    date_of_expected_return: Mapped[date] = mapped_column(Date, nullable=False)
    date_of_return: Mapped[date | None] = mapped_column(Date)
    comment: Mapped[str | None] = mapped_column(Text)
    
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    bookCopy_id: Mapped[UUID] = mapped_column(ForeignKey("book_copy.id"), nullable=False, index=True)

    user: Mapped["User"] = relationship(
        "User",
        back_populates="loan"
    )

    bookCopy: Mapped["BookCopy"] = relationship(
        "BookCopy",
        back_populates="loan"
    )
    fine: Mapped["Fines"] = relationship(
        "Fines",
        back_populates="loan",
        uselist=False
    )