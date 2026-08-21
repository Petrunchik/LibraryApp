from sqlalchemy import String, Integer, Text, SmallInteger, Boolean, ForeignKey, Sequence, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from uuid import UUID


book_public_id_seq = Sequence(
    "book_public_id_seq",
    start=1,
    increment=1
)

    
class Book(Base):
    __tablename__ = "books"
    id: Mapped[UUID] = mapped_column(primary_key=True)
    book_public_id: Mapped[str] = mapped_column(
        String(11),
        unique=True,
        nullable=False,
        server_default=text(
            "'book_' || LPAD(nextval('book_public_id_seq')::text, 6, '0')"
    ))
    title: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    pages: Mapped[int] = mapped_column(Integer, nullable=False)
    year_of_release: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(200))
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default='true')
    language: Mapped[str | None] = mapped_column(String(40))
    age_restriction: Mapped[int | None] = mapped_column(SmallInteger)
    publisher_id: Mapped[int] = mapped_column(ForeignKey("publishers.id"), nullable=False)

    publisher: Mapped["Publisher"] = relationship(  # type: ignore
        "Publisher",
        back_populates="book"
    )

    authors: Mapped[list["Author"]] = relationship( # type: ignore
        "Author",
        secondary="book_authors",
        back_populates="book",
    )

    genres: Mapped[list["Genre"]] = relationship( # type: ignore
        "Genre",
        secondary="book_genres",
        back_populates="book",
    )

    bookCopy: Mapped[list["BookCopy"]] = relationship(  # type: ignore
        "BookCopy",
        back_populates="book"
    )
    reservation: Mapped[list["Reservation"]] = relationship(  # type: ignore
        "Reservation",
        back_populates="book"
    )
    review: Mapped[list["Review"]] = relationship(  # type: ignore
        "Review",
        back_populates="book"
    )