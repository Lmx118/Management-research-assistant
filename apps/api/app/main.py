from contextlib import asynccontextmanager
from time import sleep

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from app.api.v1.api import api_router
from app.core.config import get_settings
from app.db.base import Base
from app.db.session import engine


def wait_for_database(max_attempts: int = 30, delay_seconds: int = 2) -> None:
    for attempt in range(1, max_attempts + 1):
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            return
        except OperationalError:
            if attempt == max_attempts:
                raise
            sleep(delay_seconds)


@asynccontextmanager
async def lifespan(_: FastAPI):
    wait_for_database()
    Base.metadata.create_all(bind=engine)
    yield


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.api_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/", tags=["root"])
def read_root() -> dict[str, str]:
    return {"message": "Management Science Research Assistant API"}
