from fastapi import FastAPI

from api import authors, book_copies, books, genres, loans, publishers, reviews

app = FastAPI(
    title="LibraryService"
)

app.include_router(authors.router)
app.include_router(book_copies.router)
app.include_router(books.router)
app.include_router(genres.router)
app.include_router(loans.router)
app.include_router(publishers.router)
app.include_router(reviews.router)
