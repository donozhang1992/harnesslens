'''
- 定义 session/message persistence operations；
  负责保存 session、查询 session、保存 message、列出 messages。 
'''

from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.message import MessageModel  # noqa: F401 - register relationship target
from app.models.session import SessionModel

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

def _message_dict_to_model(message: dict) -> MessageModel:
    return MessageModel(
        id=message["id"],
        session_id=message["session_id"],
        role=message["role"],
        content=message["content"],
        metadata_=message["metadata"],
        created_at=message["created_at"],
    )

def _message_model_to_dict(model: MessageModel) -> dict:
    return {
        "id": model.id,
        "session_id": model.session_id,
        "role": model.role,
        "content": model.content,
        "metadata": model.metadata_,
        "created_at": model.created_at,
    }

async def save_session(db: AsyncSession, session: dict) -> dict:
    model = _session_dict_to_model(session)
    db.add(model)
    await db.commit()
    await db.refresh(model)
    return _session_model_to_dict(model)

async def get_session(db: AsyncSession, session_id: UUID) -> dict | None:
    model = (await db.execute(select(SessionModel).where(SessionModel.id == session_id))).scalar_one_or_none()
    
    if model is None:
        return None
    
    return _session_model_to_dict(model)

async def save_message(db: AsyncSession, message: dict) -> dict:
    model = _message_dict_to_model(message)
    db.add(model)
    await db.commit()
    await db.refresh(model)
    return _message_model_to_dict(model)

async def list_messages(db: AsyncSession, session_id: UUID) -> list[dict]:
    models = (await db.execute(select(MessageModel).where(MessageModel.session_id == session_id).order_by(MessageModel.created_at))).scalars().all()
    return [_message_model_to_dict(model) for model in models]
