# RFC: Phase 1 - Foundations (OpenClaw Python)

## 1. 状态 (Status)
**提案人**: Gemini CLI
**状态**: 草案 (Draft)
**最后更新**: 2026-05-14

## 2. 上下文 (Context)
本项目旨在将 OpenClaw 的工业级架构迁移至 Python 技术栈。Phase 1 的目标是建立系统的“底座”，即基础的 API 框架、数据契约定义以及持久化层。

## 3. 技术选型 (Tech Stack)
*   **Web 框架**: [FastAPI](https://fastapi.tiangolo.com/) - 高性能异步框架。
*   **数据验证与契约**: [Pydantic v2](https://docs.pydantic.dev/latest/) - 严格的类型体操与数据验证。
*   **ORM**: [SQLAlchemy 2.0 (Async)](https://docs.sqlalchemy.org/en/20/) - 异步数据库访问。
*   **迁移工具**: [Alembic](https://alembic.sqlalchemy.org/en/latest/) - 数据库版本控制。
*   **数据库**: SQLite (初期) / PostgreSQL (后期)。
*   **日志**: [Structlog](https://www.structlog.org/) - 结构化日志，为 Phase 5 的可观测性打桩。

## 4. 架构设计 (Architecture)

### 4.1 目录结构
```text
openclaw_python/
├── alembic/              # 数据库迁移脚本
├── app/
│   ├── api/              # API 路由分发层
│   │   └── v1/
│   │       ├── sessions.py
│   │       ├── messages.py
│   │       └── users.py
│   ├── core/             # 核心配置、安全、日志注入
│   │   ├── config.py
│   │   ├── logging.py
│   ├── db/               # 数据库连接与模型定义
│   │   ├── base.py       # SQLAlchemy Base 与模型汇聚
│   │   ├── session.py    # 异步 Session 工厂
│   │   └── models/       # 持久化对象 (Domain Models)
│   ├── schemas/          # Pydantic 契约模型 (DTOs)
│   │   ├── session.py
│   │   ├── message.py
│   │   └── user.py
│   └── main.py           # FastAPI 应用入口
├── tests/                # 单元测试与集成测试
├── alembic.ini
├── pyproject.toml        # 依赖管理
└── .env                  # 环境变量
```

### 4.2 数据契约 (Data Contracts)

#### User (用户/身份)
映射 OpenClaw 的 `Identity` 概念。
*   `id`: UUID
*   `username`: string (unique)
*   `metadata`: JSON (存储额外身份信息)

#### Session (会话)
映射 OpenClaw 的 `Session` 概念，支持 `per-sender` 和 `global` 作用域。
*   `id`: UUID
*   `user_id`: UUID (ForeignKey)
*   `scope`: Enum (per-sender, global)
*   `status`: Enum (active, archived)
*   `config_overrides`: JSON (存储该会话特定的 Agent/Model 配置)

#### Message (消息)
核心数据流，支持多种媒体类型与角色。
*   `id`: UUID
*   `session_id`: UUID (ForeignKey)
*   `role`: Enum (user, assistant, system, tool)
*   `content`: string (文本内容或媒体引用)
*   `type`: Enum (text, image, audio, tool_call, tool_result)
*   `metadata`: JSON (存储 Token 消耗、耗时、TraceID 等)

## 5. 关键考量 (Key Considerations)
1.  **异步优先**: 全链路采用 `async/await`，确保高并发下的 I/O 效率。
2.  **Schema 驱动**: 严格遵守 `python_learning_plan.md` 中的“契约与边界”战区要求，所有输入输出必须通过 Pydantic 校验。
3.  **可演进性**: 持久化层通过 Alembic 管理，支持未来从 SQLite 迁移到高性能分布式数据库。

## 6. 执行计划 (Execution Roadmap)
1.  **Step 1**: 环境初始化与骨架搭建。
2.  **Step 2**: 定义 Pydantic Schemas。
3.  **Step 3**: 编写 SQLAlchemy 模型与 Migrations。
4.  **Step 4**: 实现基础 CRUD 接口。
5.  **Step 5**: 验证测试。
