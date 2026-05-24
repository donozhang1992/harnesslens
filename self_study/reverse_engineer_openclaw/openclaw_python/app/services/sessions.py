'''
- 定义 create_session / get_session / create_message / list_messages；
  负责业务编排、not found 判断和默认规则。
'''
from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.session import SessionCreate, SessionRead, SessionStatus
from app.schemas.message import MessageCreate, MessageRead
import app.repositories.sessions as repository

class SessionNotFoundError(Exception):
    pass

async def create_session(db: AsyncSession, payload: SessionCreate) -> SessionRead:
    session = {
        "id": uuid4(),
        "user_id": payload.user_id,
        "title": payload.title,
        "metadata": payload.metadata,
        "status": SessionStatus.ACTIVE,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    saved_session = await repository.save_session(db, session)
    return SessionRead(**saved_session)
    
async def get_session(db: AsyncSession, session_id: UUID) -> SessionRead:
    session = await repository.get_session(db, session_id)
    if not session:
        raise SessionNotFoundError(f"Session with id {session_id} not found")
    return SessionRead(**session)

async def create_message(db: AsyncSession, session_id: UUID, payload: MessageCreate) -> MessageRead:
    session = await repository.get_session(db, session_id)
    if not session:
        raise SessionNotFoundError(f"Session with id {session_id} not found")
    message = {
        "id": uuid4(),
        "session_id": session_id,
        "role": payload.role,
        "content": payload.content,
        "metadata": payload.metadata,
        "created_at": datetime.now(timezone.utc),
    }
    
    saved_message = await repository.save_message(db, message)
    return MessageRead(**saved_message)

async def list_messages(db: AsyncSession, session_id: UUID) -> list[MessageRead]:
    session = await repository.get_session(db, session_id)
    if not session:
        raise SessionNotFoundError(f"Session with id {session_id} not found")
    messages = await repository.list_messages(db, session_id)
    return [MessageRead(**message) for message in messages]