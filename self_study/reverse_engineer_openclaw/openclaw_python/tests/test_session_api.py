import asyncio
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.db.base import Base
from app.db.session import get_db_session
from app.main import app
from app.models.message import MessageModel
from app.models.session import SessionModel

async def create_test_db(tmp_path):
    database_url = f"sqlite+aiosqlite:///{tmp_path / 'api_test.db'}"
    engine = create_async_engine(database_url)
    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
        
    return engine, session_factory

def override_db_dependency(session_factory):
    async def override_get_db_session():
        async with session_factory() as session:
            yield session
    
    app.dependency_overrides[get_db_session] = override_get_db_session
    
def test_post_then_get_session_through_http(tmp_path):
    engine, session_factory = asyncio.run(create_test_db(tmp_path))
    override_db_dependency(session_factory)
    
    try:
        client = TestClient(app)
        user_id = str(uuid4())
        create_response = client.post(
            "/sessions",
            json = {
                "user_id": user_id,
                "title": "HTTP Session",
                "metadata": {"source": "http-test"}
            }
        )
        
        assert create_response.status_code == 201
        created = create_response.json()
        
        get_response = client.get(f"sessions/{created['id']}")
        
        assert get_response.status_code == 200
        fetched = get_response.json()
        
        assert fetched["id"] == created["id"]
        assert fetched["user_id"] == user_id
        assert fetched["title"] == "HTTP Session"
        assert fetched["status"] == "active"
        assert fetched["metadata"] == {"source": "http-test"}
    finally:
        app.dependency_overrides.clear()
        asyncio.run(engine.dispose())