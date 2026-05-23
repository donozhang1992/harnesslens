'''
- 定义 in-memory session/message storage；
  负责保存 session、查询 session、保存 message、列出 messages。 
'''

from uuid import UUID
from collections import defaultdict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.message import MessageModel  # noqa: F401 - register relationship target
from app.models.session import SessionModel

_sessions: dict[UUID, dict] = {}
_messages: defaultdict[UUID, list[dict]] = defaultdict(list)

def _session_dict_to_model(session: dict) -> SessionModel:
    return SessionModel(
        id=session["id"],
        user_id=session["user_id"],
        title=session["title"],
        status=session["status"],
        metadata_=session["metadata"],
        created_at=session["created_at"],
        updated_at=session["updated_at"],
    )

def _session_model_to_dict(model: SessionModel) -> dict:
    return {
        "id": model.id,
        "user_id": model.user_id,
        "title": model.title,
        "status": model.status,
        "metadata": model.metadata_,
        "created_at": model.created_at,
        "updated_at": model.updated_at,
    }

async def save_session(db: AsyncSession, session: dict) -> dict:
    model = _session_dict_to_model(session)
    db.add(model)
    await db.commit()
    await db.refresh(model)
    return _session_model_to_dict(model)

async def get_session(db: AsyncSession, session_id: UUID) -> dict | None:
    sql = select(SessionModel).where(SessionModel.id == session_id)
    result = await db.execute(sql)
    model = result.scalar_one_or_none()
    
    if model is None:
        return None
    
    return _session_model_to_dict(model)

def save_message(message: dict) -> dict:
    session_id = message["session_id"]
    _messages[session_id].append(message)
    return message

def list_messages(session_id: UUID) -> list[dict]:
    return _messages.get(session_id, [])
