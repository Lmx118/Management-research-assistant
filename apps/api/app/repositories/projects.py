import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project


class ProjectRepository:
    def list(self, db: Session) -> list[Project]:
        statement = select(Project).order_by(Project.updated_at.desc())
        return list(db.scalars(statement).all())

    def get(self, db: Session, project_id: uuid.UUID) -> Project | None:
        return db.get(Project, project_id)

    def create(self, db: Session, project: Project) -> Project:
        db.add(project)
        db.commit()
        db.refresh(project)
        return project

