import sys, os
from loguru import logger

def setup_logging():
    """
    Настраивает логгирование для всего проекта
    """
    prod_format = "{time:YYYY-MM-DD HH:mm:ss} | {level} | {name}:{function} | {message}"

    logger.add(sys.stderr, level="INFO", format=prod_format, colorize=False)

    logger.add(
        "logs/app.log",
        level="ERROR",
        rotation="10 MB",
        retention="1 month",
        compression="zip",
        # serialize=True,  # Структурированное логирование в JSON
    )