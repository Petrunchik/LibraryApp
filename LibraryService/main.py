from fastapi import FastAPI, APIRouter

from api import authors, book_copies, books, genres, loans, publishers, reviews

app = FastAPI(
    title="LibraryService"
)

library_router = APIRouter(
    prefix="/library"
)

library_router.include_router(authors.router)
library_router.include_router(book_copies.router)
library_router.include_router(books.router)
library_router.include_router(genres.router)
library_router.include_router(loans.router)
library_router.include_router(publishers.router)
library_router.include_router(reviews.router)

app.include_router(library_router)