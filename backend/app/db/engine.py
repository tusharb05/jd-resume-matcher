import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
from typing import Generator

from .models.user import User

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:5432/jd_matcher")

engine = create_engine(
    DATABASE_URL,
    echo=False,           # turn True if you enjoy SQL spam in logs
    pool_pre_ping=True,   # prevents stale connections
)


def create_db_and_tables() -> None:
    """
    Call this once at startup if you are not using migrations.
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a DB session.
    Ensures proper open/close lifecycle.
    """
    with Session(engine) as session:
        yield session
