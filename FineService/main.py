from fastapi import FastAPI

from api import fine

app = FastAPI(
    title="FineService"
)

app.include_router(fine.router)
