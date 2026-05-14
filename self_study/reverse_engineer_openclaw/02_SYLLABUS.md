# 📅 02_SYLLABUS: 总课表与技术栈映射

## 1. 核心技术栈 (Technology Stack)
*   **API & 契约**: FastAPI + Pydantic v2
*   **持久化与迁移**: SQLAlchemy 2.0 (Async) + Alembic + SQLite/PostgreSQL
*   **智能体编排**: LangGraph (状态机) + LlamaIndex (RAG)
*   **异步调度**: Celery + Redis (任务分发)
*   **分布式消息**: Kafka (事件解耦)
*   **可观测性**: Structlog

---

## 2. 1-Month Sprint 实战路线图

### 🏁 Phase 1: 底座夯实与数据契约 (Week 1)
**重点**: 战区一 (契约与边界)、战区三 (状态与一致性)
*   **逆向目标**: 拆解 OpenClaw `src/gateway`, `src/config`, `src/sessions`。
*   **开发任务**:
    1.  搭建 FastAPI 异步骨架。
    2.  Pydantic 定义 Session/Message/User Schema。
    3.  SQLAlchemy 异步 ORM 配置与 Alembic 首个 Migration。
    4.  核心 CRUD API 实现。
*   **交付物**: 具备持久化能力的 FastAPI 后端雏形。

### 🧠 Phase 2: 大脑编排与状态机 (Week 2)
**重点**: 战区四 (智能体编排)、战区二 (并发与秩序 - Asyncio)
*   **逆向目标**: 拆解 `src/auto-reply/dispatch.ts` 及 `src/agents` 决策流。
*   **开发任务**:
    1.  利用 LangGraph 构建 AI 感知->判断->工具->总结 循环图。
    2.  集成 LLM，实现 SSE 流式输出。
    3.  FastAPI 异步生成器推送中间状态。
*   **交付物**: 能进行多轮流式对话的同步版 Agent 服务。

### ⚡ Phase 3: 异步解耦与分布式总线 (Week 3)
**重点**: 战区二 (并发与秩序 - 多进程)、战区五 (可观测性)
*   **逆向目标**: 拆解 `src/hooks` 与进程间通信机制。
*   **开发任务**:
    1.  引入 Kafka，实现 API 接客后即刻解耦。
    2.  配置 Celery Worker 监听消息并后台执行 Phase 2 的 LangGraph。
    3.  实现异步任务状态追踪与 WebSocket 推送。
    4.  Celery 异常捕获与重试机制。
*   **交付物**: 高并发、高可靠的分布式异步架构。

### 🔌 Phase 4: 记忆增强与插件系统 (Week 4)
**重点**: 战区四 (增强)
*   **逆向目标**: 拆解 `src/memory`, `src/plugins`, `src/mcp`。
*   **开发任务**:
    1.  LlamaIndex RAG 挂载长效记忆。
    2.  实现轻量级 ToolRegistry 插件系统（动态加载）。
    3.  贯穿全链路的 TraceID 注入与审计日志完善。
*   **交付物**: 完整的 AI Agent Gateway 原型。