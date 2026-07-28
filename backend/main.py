from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.routers import books, users, loans, reservation, bookCopy
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from logging_config import setup_logging

setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("The service is running!")
    try:
        yield
    except Exception as ex:
        logger.error(f"The server is not running, the error: {ex}")
    finally:
        logger.info("The server is stopped!")

app = FastAPI(
    title="API for LibraryApp",
    lifespan=lifespan
)

app.include_router(router=books.router)
app.include_router(router=users.router)
app.include_router(router=loans.router)
app.include_router(router=reservation.router)
app.include_router(router=bookCopy.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def welcome():
    return {"message": "Все работает"}