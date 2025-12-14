from fastapi import APIRouter, Depends
from storageService.controller import (
    create_project, get_all_projects, get_project_by_id,
    delete_project, update_code, update_metadata,
    CreateProjectRequest, UpdateCodeRequest, UpdateMetadataRequest
)
from storageService.middleware import get_current_user
from config.db import get_db

router = APIRouter(prefix="/api/code", tags=["Projects"])

@router.post("/create")
def create_project_route(request: CreateProjectRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    return create_project(request, current_user, db)

@router.get("/all")
def get_all_projects_route(current_user=Depends(get_current_user), db=Depends(get_db)):
    return get_all_projects(current_user, db)

@router.get("/{id}")
def get_project_by_id_route(id: str, db=Depends(get_db)):
    return get_project_by_id(id, db)

@router.delete("/{id}")
def delete_project_route(id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    return delete_project(id, current_user, db)

@router.put("/{id}")
def update_code_route(id: str, request: UpdateCodeRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    return update_code(id, request, current_user, db)

@router.patch("/{id}/metadata")
def update_metadata_route(id: str, request: UpdateMetadataRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    return update_metadata(id, request, current_user, db)
