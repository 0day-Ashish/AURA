import bcrypt
import jwt
import os
from fastapi import HTTPException
import hashlib
from datetime import datetime, timedelta
import random
import smtplib
from email.message import EmailMessage

SECRET_KEY = os.getenv("JWT_SECRET", "dev-secret")

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(
        password.encode("utf-8"),
        hashed.encode("utf-8")
    )

def create_token(user_id: int):
    return jwt.encode(
        {"user_id": user_id},
        SECRET_KEY,
        algorithm="HS256"
    )

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")

def generate_otp():
    return str(random.randint(100000, 999999))

def hash_otp(otp: str):
    return hashlib.sha256(otp.encode()).hexdigest()

def send_email_otp(to_email: str, otp: str):
    msg = EmailMessage()
    msg["Subject"] = "Password Reset OTP"
    msg["From"] = os.getenv("SMTP_EMAIL")
    msg["To"] = to_email
    msg.set_content(f"""
Your OTP for password reset is: {otp}

This OTP is valid for 5 minutes.
If you didn't request this, ignore this email.
""")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(
            os.getenv("SMTP_EMAIL"),
            os.getenv("SMTP_PASSWORD")
        )
        server.send_message(msg)