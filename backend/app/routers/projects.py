from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.project import SavedProject
from app.models.generation_history import GenerationHistory
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, HistoryItemResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/projects", tags=["Saved Projects & History"])


@router.get("", response_model=List[ProjectResponse])
def list_projects(
    tool_type: Optional[str] = None,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(SavedProject)
    if user:
        query = query.filter(SavedProject.user_id == user.id)
    if tool_type:
        query = query.filter(SavedProject.tool_type == tool_type)
    return query.order_by(SavedProject.updated_at.desc()).all()


@router.post("", response_model=ProjectResponse)
def create_project(
    project_in: ProjectCreate,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = SavedProject(
        user_id=user.id if user else None,
        title=project_in.title,
        tool_type=project_in.tool_type,
        content=project_in.content,
        metadata_json=project_in.metadata_json,
        tags=project_in.tags,
        is_favorite=project_in.is_favorite or False
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(SavedProject).filter(SavedProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(SavedProject).filter(SavedProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    if project_in.title is not None:
        project.title = project_in.title
    if project_in.content is not None:
        project.content = project_in.content
    if project_in.tags is not None:
        project.tags = project_in.tags
    if project_in.is_favorite is not None:
        project.is_favorite = project_in.is_favorite

    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(SavedProject).filter(SavedProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    db.delete(project)
    db.commit()
    return {"message": "Project removed."}


@router.get("/history/all", response_model=List[HistoryItemResponse])
def list_history(
    user: User | None = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(GenerationHistory)
    if user:
        query = query.filter(GenerationHistory.user_id == user.id)
    return query.order_by(GenerationHistory.created_at.desc()).limit(50).all()
