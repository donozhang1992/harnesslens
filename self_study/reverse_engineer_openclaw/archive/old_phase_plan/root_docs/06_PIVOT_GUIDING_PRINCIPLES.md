# 06_PIVOT_GUIDING_PRINCIPLES: Project-Driven Vibe Coding Pivot

## 1. 背景

当前学习策略发生重大转向。

此前 OpenClaw 拆解采用的是偏“古法”的学习方式：

```text
先阅读源码 / 文档
  -> 逐层理解
  -> 手动实现基础模块
  -> 慢慢补齐后端能力
```

这种方法确实能带来安全感，因为每一行代码都经过自己手写和确认。但它的问题也很明显：

- 学习速度慢，难以快速形成 portfolio 资产。
- 容易停留在“我看过、我听过、我手写过一点”的层面。
- 缺少真实项目中的取舍、边缘 case、失败恢复、观测和面试防守经验。
- 无法训练新时代面试越来越看重的 Vibe Coding 控盘能力。

新的判断是：

```text
后端基础、高级系统设计、架构判断仍然是重中之重；
但掌握这些能力的方法必须升级。
```

我们不是降低后端和架构要求，而是用更高通量、更接近真实工作的方式去掌握它们。

## 2. 新愿景

第一阶段不再定义为“慢慢完成 OpenClaw Phase 1”，而是启动一个新的两周战役：

```text
Sprint 01: OpenClaw-Kernel
```

目标是重写一个轻量但工业级的 OpenClaw 核心内核：

```text
FastAPI Gateway
  -> Pydantic contracts
  -> Session / Message persistence
  -> asyncio.Queue event bus
  -> async dispatcher / worker
  -> fake LLM runner
  -> retry / backoff
  -> structlog + trace_id
  -> tests
  -> interview defense
```

它不是完整 OpenClaw，也不是玩具 demo。它是一个专门用来训练下面能力的 kernel：

- 后端边界设计。
- 系统数据流建模。
- 异步任务分发。
- 失败模式与自愈。
- 结构化日志与可观测性。
- AI 生成代码的规训、审计和验收。
- 多 Agent Vibe Coding 编排能力。

## 3. 核心 Pivot

旧方法：

```text
古法手写学习
  -> 通过逐行实现获得安全感
```

新方法：

```text
Spec 驱动生成
  -> 人类做架构判断
  -> AI 生成对照实现
  -> 人类做审讯、测试、日志追踪
  -> 人类复述数据生命周期和失败模式
```

这不是“让 AI 替我学”。相反，人类的工作从打字升级为：

- 定义系统边界。
- 写出严厉 SPEC。
- 设计 Pydantic 契约。
- 判断分层职责。
- 设计测试断言。
- 审计边缘 case。
- 观察 trace 和结构化日志。
- 解释 trade-off。
- 做面试防守。

## 4. 中间这条更高级的路

我们不会从古法手写直接跳到“AI 自动生成，人类旁观”。

第一阶段采用中间路线：

```text
1. 商业痛点
   先问这个模块解决什么真实问题。

2. 术语说明
   快速建立必须掌握的技术词汇。

3. 三档实现对比
   让 AI 生成 naive / acceptable / production-minded 三种方案。

4. 攻防审讯
   追问高并发、网络失败、数据不一致、上下文漂移时会在哪里坏。

5. 最小实现
   让 AI 在 SPEC 约束下生成小闭环，而不是自由发挥。

6. 测试与日志
   用 pytest、结构化日志、trace_id 证明系统行为。

7. 人类复述
   用自己的话解释数据生命周期、失败模式和 trade-off。
```

这个流程的核心是：

```text
AI 负责高通量生成；
人类负责系统主权。
```

## 5. 新安全感来源

旧安全感来自：

```text
我敲过，所以我好像会。
```

新安全感来自：

```text
我审过、测过、攻击过、解释过，所以我控得住。
```

第一阶段必须帮助学习者获得下面这些更高级的安全感：

- 我知道这一层为什么存在。
- 我知道数据怎么流。
- 我知道哪里会坏。
- 我知道怎么测。
- 我知道日志怎么看。
- 我知道未来怎么替换。
- 我知道面试官会攻击哪里。
- 我知道为什么当前 MVP 没有引入更重的组件。

这比逐行手写更接近真实工作。真实工作中，工程师的价值不是打字速度，而是能否定义边界、管理复杂性、控制失败和解释取舍。

## 6. 第一轮迭代目标

第一轮迭代的目标不是立刻使用 10+ agents，而是逐步建立这种能力。

建议演进：

```text
Week 1:
  后端体感与架构内化
  用小实验、对比实现、审讯和日志建立系统感

Week 2:
  Vibe Coding 构建 OpenClaw-Kernel
  从 4-6 个角色开始编排，逐步逼近 10+ agent 控盘能力
```

第一轮要达成的不是“组件最多”，而是：

- 能写出清晰 SPEC。
- 能把项目拆成合理模块。
- 能指挥 AI 生成。
- 能防止上下文漂移。
- 能用测试和日志验收。
- 能指出 AI 产物中的架构漏洞。
- 能把项目转化为面试叙事。

## 7. 范围纪律

第一轮不追求把所有高级后端组件都引入。

优先使用：

- FastAPI。
- Pydantic。
- SQLAlchemy async。
- Alembic。
- `asyncio.Queue`。
- in-memory job status。
- structlog。
- pytest。
- fake LLM runner。

暂不强行引入：

- Redis。
- Kafka。
- Celery。
- RabbitMQ。
- Kubernetes。
- 完整插件生态。
- 精致前端。
- Auth / payment / long-tail CRUD。

但是必须做出替换插槽：

```text
QueueBackend:
  InMemoryAsyncQueue now
  Redis Streams later
  Kafka later
```

面试防守重点不是“我上了多少组件”，而是：

```text
我知道为什么现在不用它；
我知道什么时候该引入它；
我知道如何不改业务逻辑地替换它。
```

## 8. 指导原则

后续所有计划调整，都应遵守：

- 项目驱动，而不是课程驱动。
- SPEC 先行，而不是代码先行。
- 日志和测试证明理解，而不是手写量证明理解。
- AI 高通量生成，人类高强度审计。
- 实现可以极简，设计必须能防守。
- 每个项目都要能进入简历和面试叙事。
- 每个模块都要能说清数据生命周期、失败模式和 trade-off。
