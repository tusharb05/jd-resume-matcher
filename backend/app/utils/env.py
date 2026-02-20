import os
from dotenv import load_dotenv

load_dotenv()

# DATABASE_URL = os.getenv("DATABASE_URL", )

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "simple_secret")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 14400)
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "app_uploads/")