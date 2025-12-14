import bcrypt
import jwt
import os
from fastapi import HTTPException

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
