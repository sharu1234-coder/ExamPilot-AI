from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    environment: str = "development"
    app_name: str = "ExamPilot AI API"
    database_url: str = "postgresql+psycopg://postgres@localhost:5432/exampilot_db"
    frontend_origin: str = "http://127.0.0.1:5173"
    jwt_secret_key: str | None = None
    access_token_minutes: int = 15
    google_web_client_id: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()



