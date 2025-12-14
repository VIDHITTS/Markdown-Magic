from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from config.db import get_db
from models import Project
import uuid

class CreateProjectRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    isPublic: Optional[bool] = False

class UpdateCodeRequest(BaseModel):
    htmlCode: Optional[str] = ""
    cssCode: Optional[str] = ""
    jsCode: Optional[str] = ""

class UpdateMetadataRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    isPublic: Optional[bool] = None

def create_project(request: CreateProjectRequest, current_user: dict, db: Session = Depends(get_db)):
    """Create a new project"""
    new_project = Project(
        id=str(uuid.uuid4()),
        title=request.title,
        description=request.description or "",
        isPublic=request.isPublic or False,
        htmlCode="",
        cssCode="",
        jsCode="",
        userId=current_user["userId"]
    )
    
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    return {
        "message": "Project created successfully",
        "project": {
            "id": new_project.id,
            "title": new_project.title,
            "description": new_project.description,
            "isPublic": new_project.isPublic,
            "htmlCode": new_project.htmlCode,
            "cssCode": new_project.cssCode,
            "jsCode": new_project.jsCode,
            "createdAt": str(new_project.createdAt),
            "updatedAt": str(new_project.updatedAt)
        }
    }

def get_all_projects(current_user: dict, db: Session = Depends(get_db)):
    """Get all user projects"""
    projects = db.query(Project).filter(Project.userId == current_user["userId"]).all()
    
    return {
        "message": "Projects fetched successfully",
        "projects": [
            {
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "isPublic": p.isPublic,
                "htmlCode": p.htmlCode,
                "cssCode": p.cssCode,
                "jsCode": p.jsCode,
                "createdAt": str(p.createdAt),
                "updatedAt": str(p.updatedAt)
            }
            for p in projects
        ]
    }

def get_project_by_id(id: str, db: Session = Depends(get_db)):
    """Get project by ID"""
    project = db.query(Project).filter(Project.id == id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {
        "message": "Codes fetched successfully",
        "project": {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "isPublic": project.isPublic,
            "htmlCode": project.htmlCode,
            "cssCode": project.cssCode,
            "jsCode": project.jsCode,
            "createdAt": str(project.createdAt),
            "updatedAt": str(project.updatedAt)
        }
    }

def delete_project(id: str, current_user: dict, db: Session = Depends(get_db)):
    """Delete a project"""
    project = db.query(Project).filter(Project.id == id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    
    return {"message": "Codes deleted successfully"}

def update_code(id: str, request: UpdateCodeRequest, current_user: dict, db: Session = Depends(get_db)):
    """Update project code"""
    project = db.query(Project).filter(Project.id == id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.htmlCode = request.htmlCode or ""
    project.cssCode = request.cssCode or ""
    project.jsCode = request.jsCode or ""
    
    db.commit()
    db.refresh(project)
    
    return {
        "message": "Codes updated successfully",
        "project": {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "isPublic": project.isPublic,
            "htmlCode": project.htmlCode,
            "cssCode": project.cssCode,
            "jsCode": project.jsCode,
            "createdAt": str(project.createdAt),
            "updatedAt": str(project.updatedAt)
        }
    }

def update_metadata(id: str, request: UpdateMetadataRequest, current_user: dict, db: Session = Depends(get_db)):
    """Update project metadata"""
    project = db.query(Project).filter(Project.id == id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if request.title is not None:
        project.title = request.title
    if request.description is not None:
        project.description = request.description
    if request.isPublic is not None:
        project.isPublic = request.isPublic
    
    db.commit()
    db.refresh(project)
    
    return {
        "message": "Metadata updated successfully",
        "project": {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "isPublic": project.isPublic,
            "createdAt": str(project.createdAt),
            "updatedAt": str(project.updatedAt)
        }
    }
