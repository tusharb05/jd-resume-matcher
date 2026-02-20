from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db.engine import get_session
from app.db.models.user import User
from ..models import SignUpRequestSchema
from ..utils.jwt import create_access_token


auth_router = APIRouter()


@auth_router.post("/signup")
def signup(user: SignUpRequestSchema, db: Session = Depends(get_session)):
    stmt = select(User).where(User.email == user.email)
    existing_user = db.exec(stmt).one_or_none()
    print(existing_user)

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id)})
    return {
        "success": "true",
        "user": {
            "id": new_user.id,
            "email": new_user.email
        },
        "token": token
    }


@auth_router.post("/login")
def login(user: SignUpRequestSchema, db: Session = Depends(get_session)):
    email = user.email
    password = user.password

    stmt = select(User).where(User.email == email)
    user = db.exec(stmt).one_or_none()

    if (user==None):
        return {
            "success": False,
            "message": "User not found"
        }
    
    if (user.password != password):
        return {
            "success": False,
            "message": "Incorrect password"
        }

    token = create_access_token({"sub": str(user.id)})
    return {
        "success": True,
        "user": {
            "id": user.id,
            "email": user.email
        },
        "token": token
    }