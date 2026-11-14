import asyncio, logging

import aio_pika, aio_pika.abc

from schemas.events import DefaultMessage


class RabbitMQService:
    def __init__(self, url: str) -> None:
        self.url = url
        self.connection: aio_pika.abc.AbstractRobustConnection | None = None
        self.channel: aio_pika.abc.AbstractChannel | None = None
        self.queue: aio_pika.abc.AbstractQueue | None = None
        self._lock = asyncio.Lock()


    async def connect(self) -> aio_pika.abc.AbstractChannel:
        async with self._lock:
            if self.connection is None:
                self.connection = await aio_pika.connect_robust(self.url)
                self.channel = None
            if self.channel is None:
                self.channel = await self.connection.channel()
            return self.channel


    async def setup_notification_queue(self, durable: bool = True) -> None:
        channel = await self.connect()

        exchange = await channel.declare_exchange(
            "library.events",
            aio_pika.ExchangeType.TOPIC,
            durable=True,
        )

        queue = await channel.declare_queue("notification-service.events", durable=durable)
        for routing_key in (
            "user.registered",
        ):
            await queue.bind(exchange, routing_key)
        self.queue = queue


    async def publish_message(self, message: DefaultMessage, routing_key: str) -> None:
        channel = await self.connect()

        exchange = await channel.declare_exchange("library.events", aio_pika.ExchangeType.TOPIC, durable=True)

        logging.warning(f"message: {message.model_dump_json().encode()}, routing_key: {routing_key}")
        
        await exchange.publish(
            aio_pika.Message(
                body=message.model_dump_json().encode(),
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT
            ),
            routing_key=routing_key # ключ маршрутизации
        )
        logging.info(f"RabbitMQ: Сообщение опубликовано: {message}")


    async def consume_message(self) -> None:
        async with self.queue.iterator() as queue_iter:
            async for message in queue_iter:
                try:
                    body = message.body.decode()
                    logging.info(f"Получено: {body}")

                    # Здесь выполняется обработка сообщения

                except Exception:
                    await message.nack(requeue=True)
                    raise
                else:
                    await message.ack()


    async def close(self) -> None:
        if self.connection is not None:
            await self.connection.close()
        self.connection = None
        self.channel = None