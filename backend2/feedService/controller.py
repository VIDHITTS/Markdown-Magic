from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional
from config.db import get_db
from models import Project, Like, Fork, User
import uuid

def get_public_projects(
    page: int = 1,
    limit: int = 12,
    sortBy: str = "recent",
    current_user: Optional[dict] = None,
    db: Session = Depends(get_db)
):
    """Browse public projects with pagination and sorting"""
    skip = (page - 1) * limit
    
    # Base query for public projects
    query = db.query(Project).filter(Project.isPublic == True)
    
    # Apply sorting
    if sortBy == "popular":
        query = query.outerjoin(Like).group_by(Project.id).order_by(desc(func.count(Like.id)))
    elif sortBy == "forks":
        query = query.outerjoin(Fork).group_by(Project.id).order_by(desc(func.count(Fork.id)))
    else:  # recent
        query = query.order_by(desc(Project.createdAt))
    
    # Get total count
    total = db.query(Project).filter(Project.isPublic == True).count()
    
    # Get paginated projects
    projects = query.offset(skip).limit(limit).all()
    
    # Format response
    result_projects = []
    for project in projects:
        likes_count = db.query(Like).filter(Like.projectId == project.id).count()
        forks_count = db.query(Fork).filter(Fork.projectId == project.id).count()
        
        is_liked = False
        if current_user:
            is_liked = db.query(Like).filter(
                Like.projectId == project.id,
                Like.userId == current_user["userId"]
            ).first() is not None
        
        result_projects.append({
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "htmlCode": project.htmlCode,
            "cssCode": project.cssCode,
            "jsCode": project.jsCode,
            "createdAt": str(project.createdAt),
            "user": {
                "id": project.user.id,
                "username": project.user.username,
                "name": project.user.name
            },
            "likesCount": likes_count,
            "forksCount": forks_count,
            "isLiked": is_liked
        })
    
    return {
        "message": "Public projects fetched successfully",
        "projects": result_projects,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": (total + limit - 1) // limit
        }
    }

def like_project(id: str, current_user: dict, db: Session = Depends(get_db)):
    """Like a project"""
    # Check if project exists
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if already liked
    existing_like = db.query(Like).filter(
        Like.projectId == id,
        Like.userId == current_user["userId"]
    ).first()
    
    if existing_like:
        raise HTTPException(status_code=400, detail="Already liked")
    
    # Create like
    new_like = Like(
        id=str(uuid.uuid4()),
        userId=current_user["userId"],
        projectId=id
    )
    
    db.add(new_like)
    db.commit()
    
    return {"message": "Project liked successfully"}

def unlike_project(id: str, current_user: dict, db: Session = Depends(get_db)):
    """Unlike a project"""
    like = db.query(Like).filter(
        Like.projectId == id,
        Like.userId == current_user["userId"]
    ).first()
    
    if not like:
        raise HTTPException(status_code=404, detail="Like not found")
    
    db.delete(like)
    db.commit()
    
    return {"message": "Project unliked successfully"}

def fork_project(id: str, current_user: dict, db: Session = Depends(get_db)):
    """Fork a project"""
    # Get original project
    original_project = db.query(Project).filter(Project.id == id).first()
    if not original_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Create forked project
    forked_project = Project(
        id=str(uuid.uuid4()),
        title=f"{original_project.title} (Fork)",
        description=original_project.description,
        htmlCode=original_project.htmlCode,
        cssCode=original_project.cssCode,
        jsCode=original_project.jsCode,
        isPublic=False,
        userId=current_user["userId"],
        forkedFromId=original_project.id
    )
    
    db.add(forked_project)
    
    # Create fork record
    fork_record = Fork(
        id=str(uuid.uuid4()),
        userId=current_user["userId"],
        projectId=original_project.id
    )
    
    db.add(fork_record)
    db.commit()
    db.refresh(forked_project)
    
    return {
        "message": "Project forked successfully",
        "project": {
            "id": forked_project.id,
            "title": forked_project.title
        }
    }

def get_project_likes(id: str, db: Session = Depends(get_db)):
    """Get project likes"""
    # Check if project exists
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get likes
    likes = db.query(Like).filter(Like.projectId == id).all()
    
    result_likes = []
    for like in likes:
        result_likes.append({
            "id": like.id,
            "createdAt": str(like.createdAt),
            "user": {
                "id": like.user.id,
                "username": like.user.username,
                "name": like.user.name
            }
        })
    
    return {
        "message": "Project likes fetched successfully",
        "likes": result_likes
    }

def get_user_likes(current_user: dict, db: Session = Depends(get_db)):
    """Get user's liked projects"""
    # Get user's likes
    likes = db.query(Like).filter(Like.userId == current_user["userId"]).order_by(desc(Like.createdAt)).all()
    
    result_projects = []
    for like in likes:
        project = like.project
        likes_count = db.query(Like).filter(Like.projectId == project.id).count()
        forks_count = db.query(Fork).filter(Fork.projectId == project.id).count()
        
        result_projects.append({
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "htmlCode": project.htmlCode,
            "cssCode": project.cssCode,
            "jsCode": project.jsCode,
            "createdAt": str(project.createdAt),
            "likedAt": str(like.createdAt),
            "user": {
                "id": project.user.id,
                "username": project.user.username,
                "name": project.user.name
            },
            "likesCount": likes_count,
            "forksCount": forks_count
        })
    
    return {
        "message": "User likes fetched successfully",
        "projects": result_projects
    }
