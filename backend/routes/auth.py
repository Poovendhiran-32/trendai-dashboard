from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional

from database import get_database
from services.auth_service import AuthService
from utils.jwt_handler import verify_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()

# Request/Response Models
class RegisterRequest(BaseModel):
    email: EmailStr
    firstName: str
    lastName: str
    password: str
    company: str
    role: str
    industry: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: dict

class ChangePasswordRequest(BaseModel):
    oldPassword: str
    newPassword: str

# Dependency to get current user from token
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token, "access")
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    return payload

@router.post("/register", response_model=dict)
async def register(request: RegisterRequest):
    """Register a new user"""
    db = await get_database()
    auth_service = AuthService(db)
    
    result = await auth_service.register_user(request.dict())
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    return result

@router.post("/login", response_model=dict)
async def login(request: LoginRequest):
    """Login and get access tokens"""
    db = await get_database()
    auth_service = AuthService(db)
    
    result = await auth_service.authenticate_user(request.email, request.password)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result["error"]
        )
    
    return result

@router.get("/me", response_model=dict)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    db = await get_database()
    auth_service = AuthService(db)
    
    user = await auth_service.get_user_by_email(current_user["sub"])
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"success": True, "user": user}

@router.post("/change-password", response_model=dict)
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    """Change user password"""
    db = await get_database()
    auth_service = AuthService(db)
    
    result = await auth_service.change_password(
        current_user["user_id"],
        request.oldPassword,
        request.newPassword
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    return result

@router.post("/logout", response_model=dict)
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout user (client should delete tokens)"""
    return {
        "success": True,
        "message": "Logged out successfully"
    }