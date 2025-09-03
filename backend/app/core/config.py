from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_EXPIRATION: int = 60  # in minutes
    JWT_ALGORITHM: str  # in minutes
    ALLOW_ORIGINS: str  # in minutes
    # se preferir campos separados:
    DATABASE_USER: str | None = None
    DATABASE_PASSWORD: str | None = None

    class Config:
        env_file = ".env"


settings = Settings()
