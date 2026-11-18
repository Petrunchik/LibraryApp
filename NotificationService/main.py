import asyncio, logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from aiormq.exceptions import AMQPConnectionError

from services.RabbitMQ import RabbitMQService
from settings import get_settings


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    rabbitmq = RabbitMQService(settings.rabbitmq_url)
    app.state.rabbitmq = rabbitmq
    consumer_task = None
    logging.warning("Сервис запущен")

    try:
        await rabbitmq.setup_notification_queue()
        consumer_task = asyncio.create_task(rabbitmq.consume_message())
        app.state.consumer_task = consumer_task
        logging.warning("Прослушивание запущено")
        yield
    except AMQPConnectionError as ex:
        logging.error(ex.reason)
        raise Exception("Не удалось подключиться к RabbitMQ")
    finally:
        if consumer_task is not None:
            consumer_task.cancel()
            try:
                await consumer_task
            except asyncio.CancelledError:
                pass
        await rabbitmq.close()


app = FastAPI(title="NotificationService", lifespan=lifespan)