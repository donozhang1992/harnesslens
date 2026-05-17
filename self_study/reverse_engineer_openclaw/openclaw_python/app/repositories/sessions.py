'''
- 定义 in-memory session/message storage；
  负责保存 session、查询 session、保存 message、列出 messages。 
'''

from uuid import UUID
from collections import defaultdict

_sessions: dict[UUID, dict] = {}
_messages: defaultdict[UUID, list[dict]] = defaultdict(list)

def save_session(session: dict) -> dict:
    _sessions[session["id"]] = session
    return session

def get_session(session_id: UUID) -> dict | None:
    return _sessions.get(session_id)

def save_message(message: dict) -> dict:
    session_id = message["session_id"]
    _messages[session_id].append(message)
    return message

def list_messages(session_id: UUID) -> list[dict]:
    return _messages.get(session_id, [])