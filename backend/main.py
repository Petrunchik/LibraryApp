from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.routers import books, users, loans, reservation, bookCopy, genres, publishers
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from logging_config import setup_logging
import traceback

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
app.include_router(router=genres.router)
app.include_router(router=publishers.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Error at {request.url.path}: {exc}\n")
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})

@app.get("/")
async def welcome():
    return {"message": "Все работает"}