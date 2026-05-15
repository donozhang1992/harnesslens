from enum import Enum
from uuid import UUID
from typing import Any
from datetime import datetime
from pydantic import BaseModel, Field
from .types import TitleStr

class SessionStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"

class SessionCreate(BaseModel):
    user_id: UUID
    metadata: dict[str, Any] = Field(default_factory=dict)
    title: TitleStr | None = None

class SessionRead(BaseModel):
    id: UUID
    user_id: UUID
    title: TitleStr | None = None
    status: SessionStatus
    created_at: datetime
    updated_at: datetime
    metadata: dict[str, Any] = Field(default_factory=dict)