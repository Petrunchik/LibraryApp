from fastapi import FastAPI

from api import payments

app = FastAPI(
    title="PaymentService"
)

app.include_router(payments.router)
