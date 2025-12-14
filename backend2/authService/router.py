from fastapi import APIRouter, Depends, Response
from authService.controller import (
    register, login, logout, get_me,
    RegisterRequest, LoginRequest
)
from storageService.middleware import get_current_user
from config.db import get_db

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register")
def register_route(request: RegisterRequest, response: Response, db=Depends(get_db)):
    return register(request, response, db)

@router.post("/login")
def login_route(request: LoginRequest, response: Response, db=Depends(get_db)):
    return login(request, response, db)

@router.post("/logout")
def logout_route(response: Response):
    return logout(response)

@router.get("/me")
def get_me_route(current_user=Depends(get_current_user), db=Depends(get_db)):
    return get_me(current_user, db)
