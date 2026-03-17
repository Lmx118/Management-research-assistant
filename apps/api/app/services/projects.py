import uuid

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.project import Project
from app.repositories.projects import ProjectRepository
from app.schemas.project import ProjectCreate


class ProjectService:
    def __init__(self) -> None:
        self.repository = ProjectRepository()

    def list_projects(self, db: Session) -> list[Project]:
        return self.repository.list(db)

    def get_project(self, db: Session, project_id: uuid.UUID) -> Project:
        project = self.repository.get(db, project_id)
        if project is None:
            raise HTTPException(status_code=404, detail="Project not found.")
        return project

    def create_project(self, db: Session, payload: ProjectCreate) -> Project:
        project = Project(**payload.model_dump())
        return self.repository.create(db, project)

