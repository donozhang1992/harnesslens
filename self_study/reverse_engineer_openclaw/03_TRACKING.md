# 03_TRACKING: 进度与执行看板

**当前阶段**: Phase 1: 底座夯实与数据契约 (Week 1)

**节奏校准**: 2026-05-14 晚间只作为 Day 0 预热；2026-05-15 作为正式 Day 1。

---

## 本周目标

建立 OpenClaw Python 版后端底座：基础 API 框架、数据契约、持久化层，以及最小可用的 Session / Message 操作接口。

验收标准：

- [ ] `openclaw_python` 项目初始化完成。
- [ ] Pydantic Schemas (`User`, `Session`, `Message`) 编写并通过验证。
- [ ] SQLAlchemy Models 与 Alembic 配置完成，数据库表创建成功。
- [ ] 提供基础 RESTful API 端点用于操作 Session 和 Message。
- [ ] 应用代码不使用 `print`，日志走结构化日志。

---

## Day 0 预热记录: 2026-05-14

今晚目标不是压缩执行 Day 1，而是建立明天开局所需的 Gateway 心智地图。

完成情况：

- [x] 阅读 `00_START_HERE.md`、`01_OBJECTIVE.md`、`02_SYLLABUS.md`、`03_TRACKING.md` 与 Phase 1 RFC。
- [x] 快速逆向 `openclaw/src/entry.ts`、`openclaw/src/gateway/server.ts`、`openclaw/src/gateway/server.impl.ts` 的启动链路。
- [x] 明确 `server.ts` 只是懒加载入口，真正的启动编排位于 `server.impl.ts:startGatewayServer(...)`。
- [x] 建立 Gateway 定义：它不是业务功能本身，而是协调配置、认证、插件、HTTP/WebSocket、Channel sidecars 的控制平面。
- [x] 记录 Day 0 学习笔记：[daily_logs/day0_gateway_prewarm.md](./daily_logs/day0_gateway_prewarm.md)。

关键结论：

```text
OpenClaw Gateway
  -> control plane
  -> startup orchestration
  -> runtime context
  -> HTTP/WebSocket surface
  -> plugin/channel sidecars
```

明天的 Python 映射：

```text
OpenClaw TypeBox/AJV schemas
  -> Pydantic v2 schemas

OpenClaw GatewayRequestContext
  -> FastAPI dependencies + services

OpenClaw chat.send / sessions.*
  -> Session / Message API
```

---

## Day 1 作战计划: 2026-05-15

### 09:00 - 10:00 逆向解构

- [x] 复盘 [daily_logs/day0_gateway_prewarm.md](./daily_logs/day0_gateway_prewarm.md)。
- [x] 再读 `openclaw/src/gateway/server.impl.ts:startGatewayServer(...)`，只关注启动生命周期，不深入所有 handler。
- [x] 补一张简短时序图：entry -> server wrapper -> server impl -> config -> plugins -> runtime state -> listen -> post-attach。

产出：

- [x] 用自己的话写下 Gateway 启动生命周期。
- [x] 标出哪些职责应映射到 Python `main.py`，哪些应进入 `core/`、`services/`。

### 10:00 - 13:00 脱稿重构

- [x] 检查并初始化 `openclaw_python` 项目结构。
- [x] 编写 `Session` Pydantic Schema。
- [x] 编写 `Message` Pydantic Schema。
- [x] 保持 Schema 与未来 ORM Model 分离。
- [x] 应用代码禁止使用 `print`。

建议最小字段：

```text
Session:
  id, user_id, title, status, created_at, updated_at

Message:
  id, session_id, role, content, metadata, created_at
```

### 13:00 - 14:00 红蓝对抗与测试

- [ ] 编写 Pydantic Schema 单元测试。
- [ ] 构造非法 payload 验证拦截能力。

优先测试：

- [ ] `session_id` 不是 UUID。
- [ ] `role` 不在 `user` / `assistant` / `system` / `tool`。
- [ ] `content` 是空字符串。
- [ ] `metadata` 不是 dict。

### 14:00 - 15:00 文档总结

- [x] 对照 `RFC_Phase1_Foundations.md`，确认目录与数据契约设计是否需要调整。
- [x] 在本文件更新 Day 1 结案记录。
- [x] 如有新的源码理解，追加到 `daily_logs/`，稳定结论再沉淀进 `docs/`。

---

## Day 1 Definition of Done

- [ ] **契约是否稳固？**
  验证记录：`Session` / `Message` Pydantic Schema 初稿已完成；测试尚未编写与运行，明日优先验证。

- [x] **逻辑是否透明？**
  验证记录：已能说明 Gateway 启动生命周期，并区分 pre-listen internal runtime 与 post-attach external side effects。

- [x] **架构是否解耦？**
  验证记录：已明确 `openclaw_python` 是 Python 后端总目录，不是 `src/gateway` 逐文件翻译；RFC 已补充 OpenClaw -> Python 分层映射。

---

## Day 1 结案记录: 2026-05-15

今天采用引导模式推进，重点是理解与设计，而不是由 AI 直接代写。

完成情况：

- [x] 梳理 Gateway 作为 control plane 的职责边界。
- [x] 逆向 `startGatewayServer(...)` 的主干生命周期。
- [x] 区分 `prepare / start internal runtime / attach surface / start external side effects`。
- [x] 明确 Day 1 不实现 WebSocket，只实现 HTTP REST 契约层。
- [x] 梳理 `main.py`、`core/`、`api/`、`schemas/`、`services/`、`db/`、`models/` 的职责边界。
- [x] 补充 `RFC_Phase1_Foundations.md`，明确 `openclaw_python` 是 Python 后端总目录，不是 `src/gateway` 逐文件翻译。
- [x] 初始化 `openclaw_python` 项目骨架与 `pyproject.toml`。
- [x] 完成 `SessionCreate`、`SessionRead`、`MessageCreate`、`MessageRead` Schema 初稿。

未完成 / 明日继续：

- [ ] 编写并运行 Pydantic Schema 单元测试。
- [ ] 验证 `Annotated[str, StringConstraints(...)]` 在当前 Pydantic v2 版本中的实际行为。
- [ ] 修正 `pyproject.toml` 中 pytest 配置键名：当前为 `tool.pytest.int_options`，应检查是否应为 `tool.pytest.ini_options`。
- [ ] 检查 `.venv`、`*.egg-info` 是否应加入 `.gitignore`，避免提交环境产物。
- [ ] 根据测试结果决定是否需要补充 `field_validator`。

周末节奏：

- 2026-05-16 是周末，按低压节奏推进；最低目标是完成 schema tests 并跑通。
- 若精力足够，再进入 `api/routes` 与 service 设计；不强求推进 SQLAlchemy/Alembic。

---

## Day 2 结案记录: 2026-05-16

今天只有约 1 小时学习时间，因此主动收缩范围，只聚焦 Pydantic Schema tests 的编写与跑通，不推进 API / Service / ORM。

完成情况：

- [x] 确认 `pyproject.toml` 中 pytest 配置键名为 `tool.pytest.ini_options`。
- [x] 检查 `.gitignore`，确认 `.venv`、`*.egg-info` 等环境产物不应进入提交。
- [x] 学习 pytest 最小测试结构：`test_*` 函数、`assert`、`pytest.raises(...)`、`exc_info.value.errors()`。
- [x] 为 `SessionCreate` 编写合法 payload 测试。
- [x] 为 `MessageCreate` 编写合法 payload 测试。
- [x] 编写非法 payload 测试，覆盖：
  - [x] `session_id` 不是 UUID。
  - [x] `role` 不在 `user` / `assistant` / `system` / `tool`。
  - [x] `content` 为空字符串或纯空白字符串。
  - [x] `metadata` 不是 dict。
- [x] 使用 `@pytest.mark.parametrize(...)` 合并空字符串与纯空白字符串测试。
- [x] 验证 `Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]` 的实际行为：
  - [x] 前后空白会被 strip。
  - [x] 空字符串 / 纯空白字符串会被 Pydantic 拦截。
- [x] 运行测试：`8 passed`。

学习收获：

- pytest 的核心不是“写很多测试”，而是用最小输入验证契约边界。
- `with pytest.raises(...)` 中一旦抛出异常，后续代码不会继续执行；因此错误详情断言必须写在 `with` 块之外。
- Pydantic 的错误对象可以通过 `errors()[0]["loc"]` 精确检查失败字段，这比只检查“有报错”更有价值。

遗留观察：

- pytest 运行时出现 `.pytest_cache` 写入权限 warning，但不影响测试结果。
- `SessionRead`、`MessageRead` 的完整合法 payload 测试尚未补齐，可在周日顺手补上。
- 当前还没有进入 `api/routes` 与 service 层，不强求周六推进。

---

## Day 3 作战计划: 2026-05-17

周日继续保持低压节奏，但从“Schema 契约已验证”自然过渡到最小 API 设计。优先级如下：

### 最低目标：收尾 Schema 测试

- [ ] 补齐 `SessionRead` 合法 payload 测试。
- [ ] 补齐 `MessageRead` 合法 payload 测试。
- [ ] 视情况清理测试文件中的未使用 import，例如 `SessionStatus`。
- [ ] 再跑一次 `python -m pytest -q`，确保 schema tests 继续全绿。

### 标准目标：设计最小 API / Service 边界

- [ ] 先不急着写完整数据库逻辑，先画出 Session / Message 的最小请求流：

```text
FastAPI route
  -> Pydantic request schema
  -> service function
  -> repository / persistence placeholder
  -> Pydantic response schema
```

- [ ] 新建或规划 `api/routes` 中的最小端点：
  - [ ] `POST /sessions`
  - [ ] `GET /sessions/{session_id}`
  - [ ] `POST /sessions/{session_id}/messages`
  - [ ] `GET /sessions/{session_id}/messages`
- [ ] 明确 service 层职责：业务编排与状态规则，不直接绑定 FastAPI request 对象。
- [ ] 明确 repository / db 层职责：数据存取，不承载业务判断。

### 加餐目标：只在精力足够时推进

- [ ] 创建 route 文件骨架，但允许 handler 先返回假数据或暂不接数据库。
- [ ] 开始思考 SQLAlchemy Model 字段如何映射当前 Pydantic Schema。
- [ ] 不强求 Alembic，不强求真实数据库迁移。

Day 3 通关标准：

- [ ] Schema tests 全绿。
- [ ] 能用自己的话说清楚 route / service / repository 三层分别负责什么。
- [ ] 至少形成 Session / Message API 的最小设计草图；能写代码更好，但不以硬编码量为目标。

---

## 文档分层约定

- `00_START_HERE.md`: 每日入口与操作协议。
- `01_OBJECTIVE.md`: 项目愿景与工程战区。
- `02_SYLLABUS.md`: 月度路线图与技术栈。
- `03_TRACKING.md`: 当前阶段、今日计划、DoD 与进度看板。
- `daily_logs/`: 每日学习现场记录、预热笔记、临时观察。
- `docs/`: 稳定架构分析、设计模式、RFC 等长期知识库。

---

## 进度日志

- **2026-05-14**
  - 完成项目文档体系重构：Dashboard、目标、课表、tracking 与 Phase 1 RFC。
  - 完成 Day 0 Gateway 预热阅读。
  - 明确明天才是正式 Day 1，避免疲惫状态下压缩学习质量。
  - 新增 `daily_logs/` 作为每日学习记录目录。
- **2026-05-16**
  - 在低压周末节奏下完成 Pydantic Schema tests 编写与运行。
  - 学会 pytest 基础模式：合法 payload 断言、非法 payload 拦截、错误字段定位、参数化测试。
  - 验证 `Annotated + StringConstraints` 对空白清理与最小长度限制的实际行为。
  - 当前测试结果：`8 passed`；仅剩 `.pytest_cache` 权限 warning，不影响测试有效性。
