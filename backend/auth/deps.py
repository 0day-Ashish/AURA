from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth.utils import decode_token

security = HTTPBearer()
security_optional = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials
    user_id = decode_token(token)
    return user_id

def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials = Depends(security_optional),
):
    if credentials:
        token = credentials.credentials
        try:
            user_id = decode_token(token)
            return user_id
        except:
            return None
    return None
