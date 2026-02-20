from fastapi import APIRouter, UploadFile, Header, Form, Depends
from fastapi.responses import JSONResponse
from pathlib import Path
from typing import Annotated
from ..utils.jwt import verify_token
from app.db.engine import get_session
from app.db.models.user import User
from jose import JWTError
from sqlmodel import Session, select
from ..utils.env import UPLOAD_DIR

import httpx

main_router = APIRouter()


@main_router.post("/analyze")
async def analyze(
    jd: Annotated[str, Form()],
    file: UploadFile,
    token: Annotated[str | None, Header(alias="Authorization")] = None,
    db: Session = Depends(get_session)
):

    if len(jd) < 200:
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": "JD is too short"}
        )

    if not token:
        return JSONResponse(
            status_code=401,
            content={"success": False, "message": "Authorization header missing"}
        )

    parts = token.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return JSONResponse(
            status_code=401,
            content={"success": False, "message": "Invalid Authorization format"}
        )

    try:
        jwt_payload = verify_token(parts[1])
    except JWTError:
        return JSONResponse(
            status_code=401,
            content={"success": False, "message": "Invalid or expired JWT token"}
        )

    stmt = select(User).where(User.id == int(jwt_payload["sub"]))
    user = db.exec(stmt).first()

    if not user:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "User not found"}
        )

    # -------- Optional: save locally (audit/debug) --------
    UPLOAD_DIR_ = Path(UPLOAD_DIR)
    user_dir = UPLOAD_DIR_ / str(user.id)
    user_dir.mkdir(parents=True, exist_ok=True)

    file_path = user_dir / file.filename

    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Reset file pointer because we just consumed it
    await file.seek(0)

  

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                "http://localhost:8081/analyze",
                data={"jd_text": jd},  # must match downstream API
                files={
                    "resume": (
                        file.filename,
                        await file.read(),
                        file.content_type
                    )
                }
            )

    except httpx.RequestError as e:
        return JSONResponse(
            status_code=502,
            content={"success": False, "message": f"Analysis service unreachable: {e}"}
        )

    if response.status_code != 200:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Analysis service failed"}
        )

    result = response.json()

    # -------- Return combined response --------

    return {
        "success": True,
        "message": "Analysis completed",
        "data": result
    }

