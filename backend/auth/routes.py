from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from models import User, PasswordResetOTP
from database import engine
from datetime import datetime, timedelta
from auth.utils import hash_password, verify_password, create_token
from auth.utils import generate_otp, hash_otp, send_email_otp


router = APIRouter(prefix="/auth", tags=["Auth"])

class Signup(BaseModel):
    name: str
    email: str
    password: str

class ResetRequest(BaseModel):
    email: str

class ResetConfirm(BaseModel):
    email: str
    otp: str
    new_password: str

class VerifyOTP(BaseModel):
    email: str
    otp: str


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

@router.post("/request-password-reset")
def request_password_reset(req: ResetRequest):
    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.email == req.email)
        ).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        otp = generate_otp()
        otp_record = PasswordResetOTP(
            email=req.email,
            otp_hash=hash_otp(otp),
            expires_at=datetime.utcnow() + timedelta(minutes=5)
        )

        session.add(otp_record)
        session.commit()

        send_email_otp(req.email, otp)

    return {"message": "OTP sent to email"}

@router.post("/verify-otp")
def verify_otp(req: VerifyOTP):
    with Session(engine) as session:
        otp_entry = session.exec(
            select(PasswordResetOTP)
            .where(PasswordResetOTP.email == req.email)
            .order_by(PasswordResetOTP.expires_at.desc())
        ).first()

        if not otp_entry:
            raise HTTPException(status_code=400, detail="Invalid OTP")

        if otp_entry.expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="OTP expired")

        if otp_entry.otp_hash != hash_otp(req.otp):
            raise HTTPException(status_code=400, detail="Incorrect OTP")

    return {"message": "OTP verified"}

@router.post("/reset-password")
def reset_password(req: ResetConfirm):
    with Session(engine) as session:
        otp_entry = session.exec(
            select(PasswordResetOTP)
            .where(PasswordResetOTP.email == req.email)
            .order_by(PasswordResetOTP.expires_at.desc())
        ).first()

        if not otp_entry:
            raise HTTPException(status_code=400, detail="Invalid OTP")

        if otp_entry.expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="OTP expired")

        if otp_entry.otp_hash != hash_otp(req.otp):
            raise HTTPException(status_code=400, detail="Incorrect OTP")

        user = session.exec(
            select(User).where(User.email == req.email)
        ).first()

        user.password_hash = hash_password(req.new_password)

        session.delete(otp_entry)
        session.commit()

    return {"message": "Password reset successful"}