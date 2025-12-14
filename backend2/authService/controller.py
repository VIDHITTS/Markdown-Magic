from fastapi import Response, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from config.db import get_db
from models import User
from storageService.middleware import hash_password, verify_password, create_access_token
import uuid

class RegisterRequest(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

def register(request: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user exists
    existing_user = db.query(User).filter(
        (User.email == request.email) | (User.username == request.username)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create new user
    hashed_pwd = hash_password(request.password)
    new_user = User(
        id=str(uuid.uuid4()),
        name=request.name,
        username=request.username,
        email=request.email,
        password=hashed_pwd
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create token
    token = create_access_token({"userId": new_user.id})
    
    # Set cookie
    response.set_cookie(
        key="authToken",
        value=token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,
        path="/"
    )
    
    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "username": new_user.username,
            "email": new_user.email,
            "createdAt": str(new_user.createdAt)
        }
    }

def login(request: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """Login user"""
    # Find user
    user = db.query(User).filter(User.username == request.username).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    # Verify password
    if not verify_password(request.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid password")
    
    # Create token
    token = create_access_token({"userId": user.id})
    
    # Set cookie
    response.set_cookie(
        key="authToken",
        value=token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,
        path="/"
    )
    
    return {
        "message": "User logged in successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "email": user.email,
            "createdAt": str(user.createdAt)
        }
    }

def logout(response: Response):
    """Logout user"""
    response.delete_cookie(key="authToken", path="/")
    return {"message": "User logged out successfully"}

def get_me(current_user: dict, db: Session = Depends(get_db)):
    """Get current user info"""
    user = db.query(User).filter(User.id == current_user["userId"]).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "email": user.email,
            "createdAt": str(user.createdAt)
        }
    }
