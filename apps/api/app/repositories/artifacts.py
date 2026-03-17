import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.artifact import Artifact
from app.models.enums import ArtifactType


class ArtifactRepository:
    def create(
        self,
        db: Session,
        *,
        project_id: uuid.UUID,
        artifact_type: ArtifactType,
        payload: dict[str, Any],
    ) -> Artifact:
        artifact = Artifact(project_id=project_id, artifact_type=artifact_type, payload=payload)
        db.add(artifact)
        db.commit()
        db.refresh(artifact)
        return artifact

    def latest_by_type(
        self,
        db: Session,
        *,
        project_id: uuid.UUID,
        artifact_type: ArtifactType,
    ) -> Artifact | None:
        statement = (
            select(Artifact)
            .where(Artifact.project_id == project_id, Artifact.artifact_type == artifact_type)
            .order_by(Artifact.created_at.desc())
        )
        return db.scalar(statement)

