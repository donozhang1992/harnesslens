# 🛡️ 技术主权：OpenClaw 架构迁移与 Python 后端自研计划

## 1. 战略愿景 (Strategic Vision)

本计划旨在通过 **1个月 (每日 4-6 小时)** 的高强度训练，将 OpenClaw 的工业级 C++/TS 架构内核迁移至 **Python 现代后端栈**。通过“跨语言架构同构映射”，不仅掌握 OpenClaw 的设计精髓，更通过 Pydantic、FastAPI、Kafka、Celery 等技术栈夯实 Python 架构师能力。

**核心逻辑：**
1. **不求 100% 还原**：只拆解和迁移最具价值的“架构内核”（Dispatcher, Plugin SDK, Event Bus, Agentic Workflow）。
2. **脱稿重构**：在理解 OpenClaw 源码意图后，完全使用 Python 技术栈自主实现，避免“翻译代码”的陷阱。
3. **主权掌控**：从数据模型（SQLAlchemy/Alembic）到分布式调度（Kafka/Celery），全链路闭环。

---

## 2. 核心技术栈 (Technology Stack)

*   **API & 契约**：FastAPI + Pydantic
*   **持久化与迁移**：SQLAlchemy + Alembic + PostgreSQL/SQLite
*   **智能体编排**：LangGraph (核心状态机) + LlamaIndex (RAG)
*   **异步调度**：Celery + Redis (任务分发与重试)
*   **分布式消息总线**：Kafka (事件解耦与全链路追踪)
*   **可观测性**：Logging (Structlog) + TraceID 注入

---

## 3. 学习与实战路线图 (1-Month Sprint)

### Phase 1: 底座夯实与数据契约 (Week 1: Foundations)
*   **逆向目标**：分析 OpenClaw 的 `src/gateway`, `src/config`, `src/sessions`。理解其如何定义 Session、Message 模型以及多租户/用户隔离逻辑。
*   **迁移任务**：
    1.  **项目骨架**：搭建 FastAPI 异步基础架构。
    2.  **Schema 驱动开发**：使用 Pydantic 定义 `Session`, `Message`, `User` 契约。
    3.  **持久化层**：配置 SQLAlchemy 异步引擎，编写 Alembic 脚本实现首个 Migration。
    4.  **核心 API**：实现基础的消息接收与会话管理 RESTful API。
*   **交付物**：一个具备数据库持久化能力的 FastAPI 后端雏形。

### Phase 2: 大脑编排与状态机 (Week 2: The Agentic Brain)
*   **逆向目标**：分析 OpenClaw 的 `src/auto-reply/dispatch.ts` 及 `src/agents`。重点研究其“思考-行动”循环逻辑。
*   **迁移任务**：
    1.  **状态机建模**：利用 **LangGraph** 构建基于循环图的 AI 调度流（感知 -> 判断 -> 工具调用 -> 总结）。
    2.  **LLM 接入**：集成 OpenAI/OpenRouter API，实现流式输出（SSE）。
    3.  **流式分发**：在 FastAPI 中实现异步生成器，将 LangGraph 的中间状态实时推送给前端。
*   **交付物**：一个能进行多轮对话、有明确决策逻辑的“同步版”Agent 服务。

### Phase 3: 异步解耦与分布式总线 (Week 3: Distributed Nervous System)
*   **逆向目标**：分析 OpenClaw 的 `src/hooks` 与进程间通信逻辑。理解系统如何处理长耗时任务。
*   **迁移任务**：
    1.  **消息解耦**：引入 **Kafka**。API 接收消息后立即回执并投递到 Kafka Topic。
    2.  **后台消费**：配置 **Celery Worker** 监听 Kafka 消息（或通过 Celery 协议），在后台执行 Phase 2 的 LangGraph 逻辑。
    3.  **状态同步**：实现异步任务的状态追踪（Pending -> Processing -> Completed），前端通过 WebSocket 或轮询获取结果。
    4.  **弹性重试**：在 Celery 中实现基于异常捕获的指数退避重试逻辑。
*   **交付物**：一个具备“API 接客、Kafka 传球、Celery 干活”的高可靠异步架构。

### Phase 4: 记忆增强与插件系统 (Week 4: Memory & Extensions)
*   **逆向目标**：分析 OpenClaw 的 `src/memory`, `src/plugins`, `src/mcp`。理解其 RAG 实现与工具动态加载机制。
*   **迁移任务**：
    1.  **RAG 挂载**：使用 **LlamaIndex** 接入向量数据库，为 Agent 提供基于文档的长效记忆。
    2.  **插件注册表**：在 Python 中实现一个轻量级的 `ToolRegistry`，支持通过装饰器动态注册工具。
    3.  **全链路追踪**：在 Kafka -> Celery -> LangGraph 链路中注入 TraceID，实现结构化日志审计。
*   **交付物**：一个具备 RAG 增强、可扩展插件能力的完整 AI Agent Gateway 原型。

---

## 4. 资格矩阵对齐 (Qualification Matrix Mapping)

| 战区 | OpenClaw 概念 | Python 落地工具 | 学习深度要求 |
| :--- | :--- | :--- | :--- |
| **契约与边界** | Plugin SDK Contract | **Pydantic** | 掌握类型提示、Validator 及序列化深度定制 |
| **并发与秩序** | Dispatcher / Hooks | **Kafka + Celery** | 掌握消息幂等性、ACK 机制及分布式锁 |
| **状态与一致性** | Persistence Layer | **SQLAlchemy + Alembic** | 掌握异步 Session、事务隔离级别及表结构演进 |
| **智能体编排** | Agent Runner | **LangGraph** | 掌握状态管理、条件分支及 Human-in-the-loop |
| **记忆与知识** | Memory-LanceDB | **LlamaIndex** | 掌握 Embedding 策略与向量检索优化 |

---

## 5. 执行纪律 (The Rules of the Game)

1.  **文字先行**：每一周任务开始前，必须针对该模块编写一份简短的 **RFC (Request for Comments)** 文档，明确技术选型原因和数据流图。
2.  **单元测试**：所有 Pydantic 模型必须有对应的单元测试，所有 Celery 任务必须支持 Mock 调用。
3.  **日志即真相**：系统不准使用 `print`，必须使用结构化日志记录每一个状态迁移。

---

## 6. 每日时间分配 (Daily Schedule)
*   **09:00 - 10:00 (1h)**：逆向研究。精读 OpenClaw 对应的 TS/JS 源码，绘制时序图。
*   **10:00 - 13:00 (3h)**：代码实战。进行 Python 版本的架构实现与功能开发。
*   **13:00 - 14:00 (1h)**：调试与测试。编写测试用例，并利用 AI 进行代码审计。
*   **14:00 - 15:00 (1h)**：文档与总结。更新 `PROJECT_TRACKING.md`，记录今日攻克的工程难点。
