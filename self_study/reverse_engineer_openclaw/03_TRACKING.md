# 03_TRACKING: 进度与执行看板

**当前阶段**: Phase 1: 底座夯实与数据契约 (Week 1)

**节奏校准**: 2026-05-14 晚间只作为 Day 0 预热；2026-05-15 作为正式 Day 1。

---

## 进度记录规则

从 Day 3 开始，`03_TRACKING.md` 只作为阶段看板、当前目标、每日记录索引和文档分层说明。

以后查看进度、更新进度时，请优先进入 `daily_logs/`：

- 每日详细计划、完成情况、学习收获、遗留问题，写入 `daily_logs/day*_*.md`。
- `03_TRACKING.md` 只保留简短索引和当前阶段状态，避免变成流水账。
- 稳定的架构结论、设计原则、RFC 内容，再沉淀到 `docs/` 或根目录 RFC。

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

## 每日学习记录索引

- [Day 0 Gateway Prewarm](./daily_logs/day0_gateway_prewarm.md): Gateway 启动链路与 Python 映射预热。
- [Day 1 Schema Contracts](./daily_logs/day1_schema_contracts.md): Gateway 生命周期理解、Python 分层映射、Schema 契约设计。
- [Day 2 Schema Tests](./daily_logs/day2_schema_tests.md): Pydantic schema tests 编写、运行与 pytest 学习收获。
- [Day 3 API Boundary Plan](./daily_logs/day3_api_boundary_plan.md): Schema 测试收尾、最小 API / Service / Repository 边界设计。

当前请以最新 daily log 为当天学习计划与进度来源。

---

## 文档分层约定

- `00_START_HERE.md`: 每日入口与操作协议。
- `01_OBJECTIVE.md`: 项目愿景与工程战区。
- `02_SYLLABUS.md`: 月度路线图与技术栈。
- `03_TRACKING.md`: 当前阶段、周目标、每日记录索引与进度记录规则。
- `daily_logs/`: 每日计划、执行进度、学习收获、遗留问题；以后查看和更新进度优先使用这里。
- `docs/`: 稳定架构分析、设计模式、RFC 等长期知识库。
