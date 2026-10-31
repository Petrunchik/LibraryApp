from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    user_service: str = "http://user-service:8000"
    reservation_service: str = "http://reservation-service:8000"
    payment_service: str = "http://payment-service:8000"
    library_service: str = "http://library-service:8000"
    fine_service: str = "http://fine-service:8000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
