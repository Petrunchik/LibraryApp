import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from aiormq.exceptions import AMQPConnectionError

from api import auth, users
from services.RabbitMQ import RabbitMQService
from settings import get_settings


settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    rabbitmq = RabbitMQService(settings.rabbitmq_url)
    app.state.rabbitmq = rabbitmq
    consumer_task = None

    try:
        await rabbitmq.setup_notification_queue()
        yield
    except AMQPConnectionError as ex:
        logging.error(ex.reason)
        raise Exception("Не удалось подключиться к RabbitMQ")
    finally:
        if consumer_task is not None:
            consumer_task.cancel()
        await rabbitmq.close()


app = FastAPI(
    title="UserService",
    lifespan=lifespan
)

app.include_router(auth.router)
app.include_router(users.router)