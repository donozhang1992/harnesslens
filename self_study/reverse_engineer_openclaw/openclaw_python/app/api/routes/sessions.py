'''
- 定义 4 个 HTTP endpoint，并把请求转交给 service：
  POST /sessions
  GET /sessions/{session_id}
  POST /sessions/{session_id}/messages
  GET /sessions/{session_id}/messages
'''

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.session import SessionCreate, SessionRead
from app.schemas.message import MessageCreate, MessageRead
import app.services.sessions as session_service
from app.services.sessions import SessionNotFoundError
from app.db.session import get_db_session

router = APIRouter(prefix="/sessions", tags=["sessions"])

@router.post("", response_model=SessionRead, status_code=status.HTTP_201_CREATED)
async def create_session(
    payload: SessionCreate,
    db: AsyncSession = Depends(get_db_session),
) -> SessionRead:
    return await session_service.create_session(db, payload)

@router.get("/{session_id}", response_model=SessionRead)
async def get_session(
    session_id: UUID,
    db: AsyncSession = Depends(get_db_session),
) -> SessionRead:
    try:
        return await session_service.get_session(db, session_id)
    except SessionNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

@router.post("/{session_id}/messages", response_model=MessageRead, status_code=status.HTTP_201_CREATED)
def create_message(session_id: UUID, payload: MessageCreate) -> MessageRead:
    try:
        return session_service.create_message(session_id, payload)
    except SessionNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

@router.get("/{session_id}/messages", response_model=list[MessageRead])
def list_messages(session_id: UUID) -> list[MessageRead]:
    try:
        return session_service.list_messages(session_id)
    except SessionNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc