from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from models import User
from database import engine
from auth.utils import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

class Signup(BaseModel):
    name: str
    email: str
    password: str

class Login(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(data: Signup):
    with Session(engine) as session:
        if session.exec(select(User).where(User.email == data.email)).first():
            raise HTTPException(400, "Email already registered")

        user = User(
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password)
        )
        session.add(user)
        session.commit()
        session.refresh(user)

    return {"message": "Signup successful"}

@router.post("/login")
def login(data: Login):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == data.email)).first()
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(401, "Invalid credentials")

        token = create_token(user.id)

    return {
        "token": token,
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }
