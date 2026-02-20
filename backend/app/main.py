from fastapi import FastAPI
from .routers.auth_router import auth_router
from app.db.engine import create_db_and_tables
from contextlib import asynccontextmanager
from .utils.env import UPLOAD_DIR
from pathlib import Path
from .routers.main_router import main_router

from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    # print("start")
    create_uploads_directory()
    yield
    # print("end")


def create_uploads_directory():
    uploads_dir = Path(UPLOAD_DIR)
    
    uploads_dir.mkdir(parents=True, exist_ok=True)

    if not uploads_dir.exists():
        raise RuntimeError(f"{UPLOAD_DIR} doesn't exist")
    if not uploads_dir.is_dir():
        raise RuntimeError(f"{UPLOAD_DIR} exists but is not a directory")


app = FastAPI(
    debug=True,
    title="JD Resume Matcher",
    lifespan=lifespan
)

app.include_router(auth_router, prefix="/api/auth")
app.include_router(main_router, prefix="/api")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)