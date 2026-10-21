from fastapi import FastAPI

from api import reservations

app = FastAPI(
    title="ReservationService"
)

app.include_router(reservations.router)
