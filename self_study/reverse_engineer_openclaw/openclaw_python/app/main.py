from fastapi import FastAPI

from app.api.routes.sessions import router as sessions_router

app = FastAPI(title="OpenClaw Python")
app.include_router(sessions_router)