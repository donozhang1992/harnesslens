# 📅 02_SYLLABUS: 总课表与技术栈映射

## ⚠️ 2026-05-26 课表状态更新

本文件保留 OpenClaw Python 原始四阶段路线，作为后续可恢复的 backlog 和架构学习地图。

当前执行策略已调整：

```text
先完成 Phase 1 + 基础可观测性
然后切换到 LLM Twin / LLM Engineers Handbook 主线
```

因此，Phase 2-4 暂停，不作为当前求职准备主路径。它们仍然有价值，但优先级低于 LLM Twin 的 DDD、数据管道、RAG、评估、部署和 LLMOps 实战。

新的宏观计划见 [04_LLM_TWIN_STRATEGY.md](./04_LLM_TWIN_STRATEGY.md)。

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
**当前状态**: 继续执行，作为 OpenClaw Python 的收口阶段。

**重点**: 战区一 (契约与边界)、战区三 (状态与一致性)
*   **逆向目标**: 拆解 OpenClaw `src/gateway`, `src/config`, `src/sessions`。
*   **开发任务**:
    1.  搭建 FastAPI 异步骨架。
    2.  Pydantic 定义 Session/Message/User Schema。
    3.  SQLAlchemy 异步 ORM 配置与 Alembic 首个 Migration。
    4.  核心 CRUD API 实现。
    5.  配置基础 Structlog，替代 `print` 调试。
*   **交付物**: 具备持久化能力的 FastAPI 后端雏形。
*   **当前停止线**: Phase 1 + 基础可观测性完成后，切换到 LLM Twin 主线。

### 🧠 Phase 2: 大脑编排与状态机 (Week 2)
> **暂停 / Backlog**: 当前不作为近期执行计划。保留为以后恢复 OpenClaw AI Gateway 深挖时使用。

**重点**: 战区四 (智能体编排)、战区二 (并发与秩序 - Asyncio)
*   **逆向目标**: 拆解 `src/auto-reply/dispatch.ts` 及 `src/agents` 决策流。
*   **开发任务**:
    1.  利用 LangGraph 构建 AI 感知->判断->工具->总结 循环图。
    2.  集成 LLM，实现 SSE 流式输出。
    3.  FastAPI 异步生成器推送中间状态。
*   **交付物**: 能进行多轮流式对话的同步版 Agent 服务。

### ⚡ Phase 3: 异步解耦与分布式总线 (Week 3)
> **暂停 / Backlog**: 当前不作为近期执行计划。相关能力会优先在 LLM Twin 的数据管道、部署和 LLMOps 语境下训练。

**重点**: 战区二 (并发与秩序 - 多进程)、战区五 (可观测性)
*   **逆向目标**: 拆解 `src/hooks` 与进程间通信机制。
*   **开发任务**:
    1.  引入 Kafka，实现 API 接客后即刻解耦。
    2.  配置 Celery Worker 监听消息并后台执行 Phase 2 的 LangGraph。
    3.  实现异步任务状态追踪与 WebSocket 推送。
    4.  Celery 异常捕获与重试机制。
*   **交付物**: 高并发、高可靠的分布式异步架构。

### 🔌 Phase 4: 记忆增强与插件系统 (Week 4)
> **暂停 / Backlog**: 当前不作为近期执行计划。RAG、记忆和部署能力将先通过 LLM Twin 主线实践。

**重点**: 战区四 (增强)
*   **逆向目标**: 拆解 `src/memory`, `src/plugins`, `src/mcp`。
*   **开发任务**:
    1.  LlamaIndex RAG 挂载长效记忆。
    2.  实现轻量级 ToolRegistry 插件系统（动态加载）。
    3.  贯穿全链路的 TraceID 注入与审计日志完善。
*   **交付物**: 完整的 AI Agent Gateway 原型。
