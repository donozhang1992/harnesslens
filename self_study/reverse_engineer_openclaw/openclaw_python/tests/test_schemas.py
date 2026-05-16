from uuid import UUID, uuid4

import pytest
from pydantic import ValidationError
from datetime import datetime

from app.schemas.message import MessageCreate, MessageRead, MessageRole
from app.schemas.session import SessionCreate, SessionRead, SessionStatus

def test_session_create_accepts_valid_payload():
    session = SessionCreate(
        user_id=uuid4(),
        metadata={"key": "value"},
        title="Test Session"
    )
    
    assert isinstance(session.user_id, UUID)

def test_message_create_accepts_valid_payload():
    message = MessageCreate(
        role=MessageRole.USER,
        content="Hello, world!",
        metadata={"key": "value"}
    )
    
    assert message.role == MessageRole.USER

def test_message_read_rejects_invalid_session_id():
    with pytest.raises(ValidationError) as exc_info:
        MessageRead(
            id=uuid4(),
            session_id=1, # Invalid type, should be UUID
            role=MessageRole.USER,
            content="Hello, world!",
            metadata={"key": "value"},
            created_at=datetime.now(),
        )

    errors = exc_info.value.errors()
    assert len(errors) == 1     
    assert errors[0]['loc'] == ('session_id',)

def test_message_create_rejects_invalid_role():
    with pytest.raises(ValidationError) as exc_info:
        MessageCreate(
            role="invalid_role", # Invalid role, should be one of MessageRole
            content="Hello, world!",
            metadata={"key": "value"}
        )
        
    errors = exc_info.value.errors()
    assert len(errors) == 1
    assert errors[0]['loc'] == ('role',)

@pytest.mark.parametrize("invalid_content", ["", "   "])
def test_message_create_rejects_empty_content(invalid_content):
    with pytest.raises(ValidationError) as exc_info:
        MessageCreate(
            role=MessageRole.USER,
            content=invalid_content,
            metadata={"key": "value"}
        )
        
    errors = exc_info.value.errors()
    assert len(errors) == 1
    assert errors[0]['loc'] == ('content',)

def test_session_create_rejects_invalid_metadata():
    with pytest.raises(ValidationError) as exc_info:
        SessionCreate(
            user_id=uuid4(),
            metadata="not_a_dict", # Invalid metadata, should be a dict
            title="Test Session"
        )
        
    errors = exc_info.value.errors()
    assert len(errors) == 1
    assert errors[0]['loc'] == ('metadata',)
        
def test_message_create_strips_content_whitespace():
    message = MessageCreate(
        role=MessageRole.USER,
        content="   Hello, world!   ", # Content with leading/trailing whitespace
        metadata={"key": "value"}
    )
    
    assert message.content == "Hello, world!"