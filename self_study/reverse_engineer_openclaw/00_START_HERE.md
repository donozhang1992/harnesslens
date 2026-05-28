# 00_START_HERE: OpenClaw-Kernel Sprint Dashboard

## 1. 当前状态

本项目已经从旧的“古法 OpenClaw Phase 拆解”切换为：

```text
Project-Driven Vibe Coding
  -> Sprint 01: OpenClaw-Kernel
```

旧阶段没有删除，已经封存在：

```text
archive/old_phase_plan/
```

旧代码也没有删除：

```text
openclaw_python/
```

它现在是 pre-pivot backend foundation baseline，只作为参考和可复用素材，不再是当前主战场。

当前主战场是：

```text
sprint_01_openclaw_kernel/
```

注意：`sprint_01_openclaw_kernel/` 里的 `PRD.md`、`SPEC.md`、`AGENT_RULES.md`、`TEST_PLAN.md` 等文件目前只是 **draft scaffold / 教练版初稿**。它们不是最终答案，也不是要跳过的作业。

Week 1 的重要目标之一，就是让学习者亲自参与修订这些文件：把每天形成的后端判断、边界约束、失败模式、测试红线和面试防守，逐步写回这些项目级事实来源文件。这本身就是 Vibe Coding 的核心训练。

## 2. 必读顺序

新 Codex 对话必须按这个顺序阅读：

1. [01_CURRENT_STRATEGY.md](./01_CURRENT_STRATEGY.md)
2. [02_SPRINT_01_OPENCLAW_KERNEL.md](./02_SPRINT_01_OPENCLAW_KERNEL.md)
3. [03_WEEK1_BACKEND_IMMERSION.md](./03_WEEK1_BACKEND_IMMERSION.md)
4. [04_WEEK2_VIBE_BUILD_PLAN.md](./04_WEEK2_VIBE_BUILD_PLAN.md)
5. [sprint_01_openclaw_kernel/PRD.md](./sprint_01_openclaw_kernel/PRD.md)
6. [sprint_01_openclaw_kernel/SPEC.md](./sprint_01_openclaw_kernel/SPEC.md)
7. [sprint_01_openclaw_kernel/AGENT_RULES.md](./sprint_01_openclaw_kernel/AGENT_RULES.md)

补充阅读：

- [sprint_01_openclaw_kernel/TODO.md](./sprint_01_openclaw_kernel/TODO.md): 当前 sprint 任务板。
- [sprint_01_openclaw_kernel/SYSTEM_DESIGN.md](./sprint_01_openclaw_kernel/SYSTEM_DESIGN.md): 当前架构草图与待决策问题。
- [sprint_01_openclaw_kernel/TEST_PLAN.md](./sprint_01_openclaw_kernel/TEST_PLAN.md): 后续实现必须满足的测试红线。
- [sprint_01_openclaw_kernel/INTERVIEW_NOTES.md](./sprint_01_openclaw_kernel/INTERVIEW_NOTES.md): 面试攻击点与防守话术草稿。

`SYSTEM_DESIGN.md` 中的 open questions 不需要在启动前全部回答；它们会在 Week 1 的后端体感模块中逐步收敛，并在 Week 2 实现前写回 `SPEC.md` / `SYSTEM_DESIGN.md`。

## 3. 两周目标

第一轮两周迭代目标：

```text
Week 1:
  后端体感与架构内化
  通过小实验、对照实现、攻防审讯、日志和测试建立 OpenClaw-Kernel 的系统感。

Week 2:
  Vibe Coding 构建与审计封存
  用 SPEC 约束 AI 生成，逐步练习多 Agent 编排，产出可运行、可测试、可面试防守的 kernel 项目。
```

## 4. 当前项目边界

OpenClaw-Kernel 只实现核心闭环：

```text
POST /sessions
POST /sessions/{id}/messages
  -> validate message
  -> persist user message
  -> enqueue agent job
  -> async worker consumes job
  -> fake LLM runner generates reply
  -> persist assistant reply
  -> expose job/session status
  -> trace_id links the whole flow
```

当前重点：

- FastAPI gateway。
- Pydantic contracts。
- route / service / repository 分层。
- SQLAlchemy async persistence。
- Alembic migration workflow。
- `asyncio.Queue` event bus。
- async dispatcher / worker。
- retry / backoff / failure state。
- structlog + trace_id。
- pytest。
- interview defense。

当前不做：

- 完整 OpenClaw port。
- 完整插件生态。
- 真实渠道接入。
- 真实 LLM provider 集成。
- Redis / Kafka / Celery。
- 精致前端。
- Auth / payment / long-tail CRUD。

## 5. 旧成果如何使用

旧成果仍有价值：

- `openclaw_python/`: 参考 FastAPI、Pydantic、SQLAlchemy、测试等 pre-pivot 实现。
- `openclaw/`: 原始 OpenClaw 源码，用于理解 Gateway / sessions / agents / plugin 等架构思想。
- `archive/old_phase_plan/`: 旧路线、RFC、daily logs、学习地图和 LLM Twin 策略历史。
- `references/`: 新方法论参考材料，只作为外部战略参考，不直接污染 sprint 代码库。

使用原则：

```text
借鉴旧成果，不继承旧节奏。
参考旧代码，不盲目复制结构。
吸收 OpenClaw 架构思想，只重写 kernel 闭环。
```

## 6. 推荐启动指令

```text
请先阅读 00_START_HERE.md、01_CURRENT_STRATEGY.md、02_SPRINT_01_OPENCLAW_KERNEL.md 和 03_WEEK1_BACKEND_IMMERSION.md。
然后带我启动 Sprint 01: OpenClaw-Kernel 的 Week 1 Day 1。
今天先不写完整项目代码，只做 HTTP/Pydantic/分层边界的后端体感训练：术语、三档实现对比、攻防审讯、小实验、测试红线和口头复述。
```

## 7. 协作纪律

- 先 SPEC，后代码。
- 先数据流，后实现。
- AI 负责高通量生成，人类负责系统主权。
- 不以手写量证明理解，以审计、测试、日志和复述证明理解。
- 每日必须产出一个可观察的小实验、一组测试红线、一段面试防守话术。
- Week 2 之前，不启动完整项目实现。
- Sprint 文档初稿只提供起跑线；Week 1 必须持续审查、修改、收紧它们。
