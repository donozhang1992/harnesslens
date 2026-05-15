from enum import Enum
from typing import Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field
from .types import ContentStr

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    TOOL = "tool"

class MessageCreate(BaseModel):
    role: MessageRole
    content: ContentStr
    metadata: dict[str, Any] = Field(default_factory=dict)

    
class MessageRead(BaseModel):
    id: UUID
    session_id: UUID
    role: MessageRole
    content: str
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime