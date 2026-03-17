from fastapi import APIRouter

from app.api.v1.routes import feeds, health, paper_library, projects


api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(projects.router)
api_router.include_router(feeds.router)
api_router.include_router(paper_library.router)
