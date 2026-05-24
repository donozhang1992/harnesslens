import asyncio
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.db.base import Base
from app.models.message import MessageModel  # noqa: F401 - register relationship target
from app.models.session import SessionModel  # noqa: F401 - register table metadata
from app.schemas.message import MessageRole
from app.schemas.session import SessionStatus
import app.repositories.sessions as repository


async def _create_test_session_factory(tmp_path):
    db_path = tmp_path / "test_openclaw.db"
    database_url = f"sqlite+aiosqlite:///{db_path}"
    engine = create_async_engine(database_url)
    session_factory = async_sessionmaker(engine, expire_on_commit=False)

    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    return engine, session_factory


def test_save_then_get_session_persists_through_sqlite(tmp_path):
    async def scenario():
        engine, session_factory = await _create_test_session_factory(tmp_path)

        try:
            session = {
                "id": uuid4(),
                "user_id": uuid4(),
                "title": "Persistent Session",
                "status": SessionStatus.ACTIVE,
                "metadata": {"source": "test"},
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
            }

            async with session_factory() as db:
                saved = await repository.save_session(db, session)

            async with session_factory() as db:
                fetched = await repository.get_session(db, saved["id"])

            assert fetched is not None
            assert fetched["id"] == saved["id"]
            assert fetched["user_id"] == session["user_id"]
            assert fetched["title"] == "Persistent Session"
            assert fetched["status"] == SessionStatus.ACTIVE
            assert fetched["metadata"] == {"source": "test"}
        finally:
            await engine.dispose()

    asyncio.run(scenario())

def test_get_non_existing_session_return_none(tmp_path):
    async def scenario():
        engine, session_factory = await _create_test_session_factory(tmp_path)
        
        try:
            async with session_factory() as db:
                session = await repository.get_session(db, uuid4())
            
            assert session is None
        finally:
            await engine.dispose()
    
    asyncio.run(scenario())

def test_save_then_list_message_persists_through_sqlite(tmp_path):
    async def scenario():
        engine, session_factory = await _create_test_session_factory(tmp_path)

        try:
            session = {
                "id": uuid4(),
                "user_id": uuid4(),
                "title": "Message Parent",
                "status": SessionStatus.ACTIVE,
                "metadata": {},
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
            }
            message = {
                "id": uuid4(),
                "session_id": session["id"],
                "role": MessageRole.USER,
                "content": "Persist this message",
                "metadata": {"source": "test"},
                "created_at": datetime.now(timezone.utc),
            }

            async with session_factory() as db:
                await repository.save_session(db, session)
                saved_message = await repository.save_message(db, message)

            async with session_factory() as db:
                messages = await repository.list_messages(db, session["id"])

            assert len(messages) == 1
            assert messages[0]["id"] == saved_message["id"]
            assert messages[0]["session_id"] == session["id"]
            assert messages[0]["role"] == MessageRole.USER
            assert messages[0]["content"] == "Persist this message"
            assert messages[0]["metadata"] == {"source": "test"}
        finally:
            await engine.dispose()

    asyncio.run(scenario())


def test_list_messages_returns_oldest_message_first(tmp_path):
    async def scenario():
        engine, session_factory = await _create_test_session_factory(tmp_path)

        try:
            session = {
                "id": uuid4(),
                "user_id": uuid4(),
                "title": "Ordered Messages",
                "status": SessionStatus.ACTIVE,
                "metadata": {},
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
            }
            first_created_at = datetime(2026, 5, 24, 9, 0, tzinfo=timezone.utc)
            second_created_at = first_created_at + timedelta(minutes=1)

            first_message = {
                "id": uuid4(),
                "session_id": session["id"],
                "role": MessageRole.USER,
                "content": "First message",
                "metadata": {},
                "created_at": first_created_at,
            }
            second_message = {
                "id": uuid4(),
                "session_id": session["id"],
                "role": MessageRole.ASSISTANT,
                "content": "Second message",
                "metadata": {},
                "created_at": second_created_at,
            }

            async with session_factory() as db:
                await repository.save_session(db, session)
                await repository.save_message(db, second_message)
                await repository.save_message(db, first_message)

            async with session_factory() as db:
                messages = await repository.list_messages(db, session["id"])
            
            assert [message["id"] for message in messages] == [
                first_message["id"],
                second_message["id"],
            ]
        finally:
            await engine.dispose()

    asyncio.run(scenario())
