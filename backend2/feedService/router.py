from fastapi import APIRouter, Depends
from feedService.controller import (
    get_public_projects, like_project, unlike_project,
    fork_project, get_project_likes, get_user_likes
)
from storageService.middleware import get_current_user, optional_auth
from config.db import get_db

router = APIRouter(prefix="/api/feed", tags=["Feed"])

@router.get("/browse")
def browse_route(page: int = 1, limit: int = 12, sortBy: str = "recent", current_user=Depends(optional_auth), db=Depends(get_db)):
    return get_public_projects(page, limit, sortBy, current_user, db)

@router.post("/like/{id}")
def like_project_route(id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    return like_project(id, current_user, db)

@router.delete("/unlike/{id}")
def unlike_project_route(id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    return unlike_project(id, current_user, db)

@router.post("/fork/{id}")
def fork_project_route(id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    return fork_project(id, current_user, db)

@router.get("/{id}/likes")
def get_project_likes_route(id: str, db=Depends(get_db)):
    return get_project_likes(id, db)

@router.get("/user/likes")
def get_user_likes_route(current_user=Depends(get_current_user), db=Depends(get_db)):
    return get_user_likes(current_user, db)
