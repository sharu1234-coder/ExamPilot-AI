from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import database_is_ready
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        description="ExamPilot development API. Student data APIs are not implemented yet.",
        version="0.1.0",
        docs_url=None if settings.is_production else "/docs",
        redoc_url=None,
        openapi_url=None if settings.is_production else "/openapi.json",
    )
    app.include_router(auth_router)
    app.include_router(users_router)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin],
        allow_methods=["GET"],
        allow_headers=["Content-Type"],
        allow_credentials=False,
    )

    @app.get("/health/live", tags=["health"])
    def live() -> dict[str, str]:
        return {"status": "ok", "service": "exampilot-api"}

    @app.get("/health/ready", tags=["health"])
    def ready(response: Response) -> dict[str, str]:
        if not database_is_ready():
            response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
            return {"status": "not_ready"}
        return {"status": "ready"}

    return app


app = create_app()



