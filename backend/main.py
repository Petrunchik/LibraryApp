from fastapi import FastAPI
from app.routers import books, users, loans, reservation
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API for LibraryApp"
)

app.include_router(router=books.router)
app.include_router(router=users.router)
app.include_router(router=loans.router)
app.include_router(router=reservation.router)

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