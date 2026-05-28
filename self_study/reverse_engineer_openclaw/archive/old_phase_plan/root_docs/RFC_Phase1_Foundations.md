# RFC: Phase 1 Foundations

## 0. 2026-05-26 战略备注

本 RFC 仍然有效，但项目路线已重新校准。

OpenClaw Python 当前定位为 **后端工程地基训练项目**，目标是收口到：

```text
Phase 1 + 基础可观测性
```

也就是完成 FastAPI、Pydantic、SQLAlchemy Async、Alembic、Session/Message API、测试、基础 structlog 和清晰分层。完成后，主线切换到 LLM Twin / LLM Engineers Handbook，用于训练 DDD、数据管道、RAG、评估、部署和 LLMOps。

因此，下文中提到“Phase 2 到 Phase 4 逐步引入”的能力，现在改为 **暂停 / backlog**。它们没有被删除；以后如果有余力，可以回到 OpenClaw 继续做 AI Gateway、Agent 编排、异步总线和插件系统。

## 1. 背景

Phase 1 的目标是为 `openclaw_python` 建立一个可演进、可测试、可观测的后端底座。我们不会逐行翻译 OpenClaw 的 TypeScript 代码，而是先逆向理解 `gateway`、`config`、`sessions` 的系统职责，再用 Python 现代后端栈重新实现同构能力。

本阶段重点对应两个工程战区：

- 战区一：契约与边界，使用 Pydantic 明确输入输出 Schema。
- 战区三：状态与一致性，使用 SQLAlchemy 与 Alembic 建立持久化基础。

## 2. 目标

本阶段交付一个最小但完整的 FastAPI 后端雏形，具备：

- FastAPI 异步应用骨架。
- `User`、`Session`、`Message` 三类核心数据契约。
- SQLAlchemy 2.0 Async ORM 模型。
- Alembic migration 初始化。
- Session 与 Message 的基础 RESTful API。
- 结构化日志基础配置。
- 针对 Pydantic Schema 的单元测试。

## 3. 非目标

Phase 1 暂不实现以下内容：

- LangGraph Agent 编排。
- LLM 调用与 SSE 流式输出。
- Kafka、Celery、Redis 等分布式异步组件。
- RAG、插件系统、MCP 集成。
- 完整认证授权体系。

这些能力会在 Phase 2 到 Phase 4 逐步引入。

> 2026-05-26 更新：Phase 2 到 Phase 4 当前暂停，作为未来 backlog 保留。近期主线将在 Phase 1 收口后切换到 LLM Twin。

## 4. 逆向范围

本阶段阅读 OpenClaw 以下模块：

- `openclaw/src/gateway`
- `openclaw/src/config`
- `openclaw/src/sessions`

需要产出的理解包括：

- 服务启动生命周期。
- 配置加载顺序。
- Gateway 如何接收请求并分发到内部模块。
- Session 与 Message 的核心字段、状态变化和数据流。
- 哪些边界属于 API 层，哪些属于业务层，哪些属于持久化层。

## 5. OpenClaw 到 Python 的映射原则

`openclaw_python` 是 Python 版后端雏形的总目录，不是 `openclaw/src/gateway` 的逐文件翻译，也不是只重写 Gateway 子目录。

本阶段采用“职责同构映射”：

```text
OpenClaw src/gateway 的控制面思想
  -> openclaw_python/app/main.py + core/ + api/ + services/

OpenClaw src/config 的配置与运行时设置
  -> openclaw_python/app/core/config.py

OpenClaw GatewayRequestContext 的依赖集合
  -> FastAPI dependencies + app services + app state

OpenClaw TypeBox/AJV transport schemas
  -> openclaw_python/app/schemas/ 的 Pydantic v2 契约

OpenClaw src/sessions 的会话/消息领域
  -> schemas/ + models/ + services/ + api/routes/

OpenClaw session store / transcript persistence
  -> SQLAlchemy models + db session + repositories/services
```

关键判断：

- `main.py` 对应 Gateway 启动编排思想，只负责创建 FastAPI app、加载配置、配置日志、挂载 routes、注册生命周期钩子，不承载 Session/Message 业务逻辑。
- `core/` 承载横切基础设施，例如配置、结构化日志、运行时开关。它不是业务层。
- `api/` 是 HTTP 边界，负责请求/响应、依赖注入和状态码，不直接写复杂数据库逻辑。
- `schemas/` 是 Pydantic 输入输出契约，用来守住 API 边界。
- `models/` 是 SQLAlchemy 持久化结构，用来描述数据库表和关系。
- `services/` 是业务用例层，承载创建 Session、追加 Message、查询消息列表等操作。
- `db/` 承载 engine、async session factory、Base 和迁移集成。

因此，Python 目录结构服务于整个后端架构分层；Gateway 只是 Day 1 用来训练控制面分层思维的主要参照物。

## 6. 建议目录结构

```text
openclaw_python/
  app/
    __init__.py
    main.py
    api/
      __init__.py
      routes/
        __init__.py
        sessions.py
        messages.py
    core/
      __init__.py
      config.py
      logging.py
    db/
      __init__.py
      base.py
      session.py
    models/
      __init__.py
      user.py
      session.py
      message.py
    schemas/
      __init__.py
      user.py
      session.py
      message.py
    services/
      __init__.py
      sessions.py
      messages.py
  alembic/
  tests/
    test_schemas.py
  alembic.ini
  pyproject.toml
```

目录职责：

- `api/`: HTTP 边界，只处理请求、响应和依赖注入。
- `schemas/`: Pydantic 输入输出契约。
- `models/`: SQLAlchemy ORM 持久化模型。
- `services/`: 业务用例层，承载 Session/Message 操作逻辑。
- `db/`: 数据库连接、session 管理和 ORM 基类。
- `core/`: 配置、日志等横切基础设施。
- `tests/`: 单元测试与契约测试。

## 7. 数据模型草案

### User

建议字段：

- `id`: UUID
- `username`: string
- `display_name`: string | None
- `created_at`: datetime
- `updated_at`: datetime

### Session

建议字段：

- `id`: UUID
- `user_id`: UUID
- `title`: string | None
- `status`: enum, such as `active`, `archived`
- `created_at`: datetime
- `updated_at`: datetime

### Message

建议字段：

- `id`: UUID
- `session_id`: UUID
- `role`: enum, such as `user`, `assistant`, `system`, `tool`
- `content`: string
- `metadata`: dict
- `created_at`: datetime

注意：Pydantic Schema 与 SQLAlchemy Model 必须分离。Schema 是 API 契约，Model 是持久化结构，两者不能混在一起。

## 8. 数据流

### 创建 Session

```text
Client
  -> POST /sessions
  -> FastAPI route validates SessionCreate
  -> Session service creates domain object
  -> SQLAlchemy async session persists row
  -> route returns SessionRead
```

### 创建 Message

```text
Client
  -> POST /sessions/{session_id}/messages
  -> FastAPI route validates MessageCreate
  -> service checks session existence
  -> service persists message
  -> route returns MessageRead
```

### 查询 Session Messages

```text
Client
  -> GET /sessions/{session_id}/messages
  -> route validates path UUID
  -> service queries messages ordered by created_at
  -> route returns list[MessageRead]
```

## 9. 技术选型

### FastAPI

用于构建异步 HTTP API。它与 Pydantic 集成紧密，适合作为契约驱动的后端入口。

### Pydantic v2

用于定义 API 输入输出边界，确保非法数据在进入业务层之前被拦截。

### SQLAlchemy 2.0 Async

用于建立可迁移的 ORM 持久化层。Async 模式为后续高并发 API 与流式 Agent 服务打基础。

### Alembic

用于数据库结构演进，避免手写 SQL 或依赖临时建表逻辑。

### Structlog

用于结构化日志，替代 `print`。Phase 1 只要求基础 JSON 日志，TraceID 可在后续阶段增强。

## 10. 约束

- 禁止在应用代码中使用 `print`。
- 所有外部输入必须通过 Pydantic Schema 校验。
- API 层不得直接编写复杂数据库逻辑。
- ORM Model 不直接暴露给 HTTP 响应。
- Migration 必须可重复执行、可回滚。
- 测试至少覆盖核心 Schema 的非法输入。

## 11. 验收标准

Phase 1 完成时，应满足：

- `openclaw_python` 项目可以启动 FastAPI app。
- `User`、`Session`、`Message` Schema 已定义并通过测试。
- SQLAlchemy async engine 与 session factory 已配置。
- Alembic 已生成首个 migration。
- 数据库表可创建成功。
- 至少提供 Session 与 Message 的基础 API。
- 非法 UUID、空消息内容、非法 role 等输入会被 Pydantic 拦截。
- 日志使用 structlog 输出结构化内容。

## 12. 第一日行动清单

- 阅读 `openclaw/src/gateway/server.ts` 与 `openclaw/src/gateway/server.impl.ts:startGatewayServer(...)`，记录启动生命周期。
- 初始化 `openclaw_python` 目录结构。
- 编写 `Session` 与 `Message` 的 Pydantic Schema。
- 编写 Schema 单元测试。
- 用非法 payload 验证 Pydantic 拦截能力。
- 在 `03_TRACKING.md` 记录今天遇到的工程卡点。
