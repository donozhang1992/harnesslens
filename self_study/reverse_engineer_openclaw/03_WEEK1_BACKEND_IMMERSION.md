# 03_WEEK1_BACKEND_IMMERSION: OpenClaw-Kernel 后端体感周

## 1. 本周定位

Week 1 不是传统源码马拉松，也不是立刻让 AI 写完整项目。

`sprint_01_openclaw_kernel/` 中已有的 `PRD.md`、`SPEC.md`、`AGENT_RULES.md`、`SYSTEM_DESIGN.md`、`TEST_PLAN.md`、`INTERVIEW_NOTES.md` 都只是 draft scaffold。它们用于防止新对话迷路，不代表设计已经完成。

本周必须把这些文件当作训练对象：每天通过后端体感、小实验和攻防审讯，亲自参与更新这些文件。会写 SPEC、会约束 AI、会定义测试红线、会写面试防守，本身就是 Vibe Coding 的核心能力。

本周目标是：

```text
用新世代方法建立后端与架构体感，
为 Week 2 的 Vibe Coding 构建 OpenClaw-Kernel 准备 SPEC、边界、测试红线和面试防守材料。
```

核心问题不是“我手写了多少代码”，而是：

- 我是否知道每一层为什么存在？
- 我是否能画出数据生命周期？
- 我是否看见了异步队列、事务、重试、日志的真实摩擦力？
- 我是否能审计 AI 生成的后端代码？
- 我是否能解释当前 MVP 的取舍？

## 2. 为什么这比古法更好

古法学习：

```text
读文档
  -> 手写 demo
  -> 跑通
  -> 以为掌握
```

问题是：跑通通常只证明 happy path 存在，不能证明你理解了系统。

本周方法：

```text
商业痛点
  -> 术语说明
  -> 三档实现对比
  -> 攻防审讯
  -> 小实验观测
  -> 测试和日志证明
  -> 人类复述
```

它更好的原因是：

- 直接面向真实工程问题，而不是语法问题。
- 通过 naive / acceptable / production-minded 对比建立工程审美。
- 通过失败注入和极端 case 获得真实体感。
- 通过 structlog / trace_id 看见数据流，而不是凭想象理解。
- 通过测试断言和面试复述，把知识固化为可防守经验。

## 3. 通用执行节奏

每个模块都按同一个节奏推进：

```text
1. Business pain
   这个后端概念替系统挡了什么子弹？

2. Vocabulary bootstrapping
   必须知道哪些术语？它们在系统里扮演什么角色？

3. Comparative implementation
   让 AI 生成三档实现：naive / acceptable / production-minded。

4. Attack review
   追问高并发、网络失败、数据不一致、协程取消、系统重启时哪里会坏。

5. Observable experiment
   写一个极小实验，通过日志、延迟、状态变化看见系统行为。

6. Test assertion
   用 pytest 或伪测试定义必须成立的不变量。

7. Human explanation
   学习者用自己的话复述数据生命周期、失败模式和 trade-off。
```

每个模块的完成标准都必须包含：

- 一个可解释的数据流。
- 一个可观测的小实验。
- 至少 2 个失败模式。
- 至少 1 个测试断言。
- 一段面试防守话术草稿。

## 4. 模块一：HTTP 边界与 Pydantic 契约

### 掌握目标

理解：

```text
Client request
  -> FastAPI route
  -> Pydantic schema
  -> service use case
  -> response schema
```

关键问题：

- 为什么 route 是协议翻译层，不是业务层？
- 为什么 Pydantic 是系统边界的门禁？
- 为什么 request model 和 response model 要分开？
- 为什么裸 dict 传递会污染系统？
- 为什么 422 validation error 是好事？

### 小实验

让 AI 生成三种 `POST /sessions/{id}/messages` 写法：

```text
1. naive:
   所有逻辑堆在 route 里，直接操作 dict。

2. acceptable:
   route 使用 Pydantic schema，调用 service。

3. production-minded:
   route / schema / service / repository 边界清晰，错误映射明确。
```

观察点：

- 非法 role 如何被拦截？
- 空 content 在哪里失败？
- route 是否知道数据库细节？
- 业务错误如何映射到 HTTP 404 / 409 / 422？

### 审核标准

- 能解释 route、schema、service 的职责边界。
- 能设计非法 payload 并预测返回状态码。
- 能指出 naive 版本未来为什么难测、难改、难防守。

## 5. 模块二：Service / Repository / Model 分层

### 掌握目标

理解：

```text
route = 协议翻译
service = 用例决策
repository = 存储边界
schema = 外部契约
model = 数据库形状
```

关键问题：

- `Message cannot exist without Session` 属于哪一层的规则？
- session 不存在时，谁负责发现？谁负责映射 HTTP 404？
- repository 应该返回 ORM model、dict，还是 domain/schema object？
- 为什么 API schema 和 SQLAlchemy model 不能混用？

### 小实验

让 AI 生成一个故意有问题的版本：

```text
route 直接 query database
route 直接 commit
route 直接拼 response dict
```

然后要求 AI 作为 reviewer 攻击它：

- 如果换数据库，要改哪里？
- 如果要测试业务规则，要怎么 mock？
- 如果事务失败，route 会不会变成业务垃圾场？

### 审核标准

- 能画出 route -> service -> repository -> model 的调用图。
- 能解释业务规则与 HTTP 状态码的边界。
- 能指出至少 3 个分层泄漏信号。

## 6. 模块三：持久化、事务与 Alembic

### 掌握目标

理解：

```text
AsyncEngine
  -> AsyncSession
  -> transaction
  -> SQLAlchemy model
  -> SQLite table
  -> Alembic migration
```

关键问题：

- engine 和 session 有什么区别？
- session 为什么是 unit of work？
- commit / rollback 的责任在哪里？
- `Base.metadata.create_all()` 为什么不能作为正式迁移工作流？
- Alembic 记录的到底是什么？

### 小实验

让 AI 生成三种持久化实现：

```text
1. no-transaction:
   中途失败可能留下半条数据。

2. scattered-commit:
   service 和 repository 到处 commit。

3. unit-of-work:
   明确事务边界，失败 rollback。
```

再设计一个失败场景：

```text
创建 user message 成功，
创建 assistant reply 前抛错。
```

观察：

- 数据库留下了什么？
- 是否出现半完成状态？
- 日志能不能解释失败点？

### 审核标准

- 能解释 AsyncSession 生命周期。
- 能解释迁移和临时建表的区别。
- 能说清失败时数据一致性如何保护。

## 7. 模块四：`asyncio.Queue` 与任务分发网络

### 掌握目标

理解 OpenClaw-Kernel 的异步核心：

```text
HTTP request
  -> validate payload
  -> persist user message
  -> enqueue agent job
  -> return job/session status
  -> worker consumes job
  -> fake LLM runner processes
  -> persist assistant reply
  -> update job status
```

关键术语：

- producer / consumer。
- queue maxsize。
- backpressure。
- task status。
- cancellation。
- graceful shutdown。
- at-most-once / at-least-once。
- in-memory queue limitation。
- future replacement: Redis Streams / Celery / Kafka。

### 小实验

构造一个最小异步队列实验：

```text
queue maxsize = 2
worker 每秒处理 1 个 job
同时提交 10 个 job
```

必须打出结构化日志：

```text
job_enqueued
queue_full
job_dequeued
job_started
job_completed
job_failed
```

观察：

- 第 3 个之后的请求如何表现？
- `await queue.put()` 会等待还是直接失败？
- 如果 worker 挂了，队列里发生什么？
- 如果服务重启，内存 job 会不会丢？

### 审核标准

- 能解释 queue 是缓冲，不是数据库。
- 能解释 backpressure 为什么是系统保护机制。
- 能说明为什么第一轮用 `asyncio.Queue`，未来何时替换 Redis / Kafka。
- 能从日志复述一个 job 的生命周期。

## 8. 模块五：自愈、重试与失败状态

### 掌握目标

理解：

```text
external call may fail
worker should classify failure
transient errors may retry
permanent errors should fail fast
retry needs backoff + jitter
final failure must be persisted and observable
```

关键问题：

- 429 要不要重试？
- 400 要不要重试？
- retry 会不会放大雪崩？
- 最大重试次数在哪里定义？
- retry attempt 如何进入日志？
- job 最终失败后，用户如何查询状态？

### 小实验

构造 fake LLM client：

```text
30% success
40% transient error
30% permanent error
```

让 worker 处理 20 个 job。

必须观测：

- 每个 job 尝试了几次。
- 哪些错误重试了。
- 哪些错误 fail fast。
- 最终状态是 `completed` 还是 `failed`。
- trace_id 是否贯穿所有 retry attempt。

### 审核标准

- 能区分 transient vs permanent failure。
- 能解释 exponential backoff + jitter 的意义。
- 能说明为什么无限重试是灾难。
- 能设计 job status schema。

## 9. 模块六：可观测性与面试防守

### 掌握目标

理解：

```text
trace_id
session_id
job_id
structured logs
state transition
failure diagnosis
interview defense
```

关键问题：

- 为什么 `print()` 不够？
- 什么日志字段必须全链路携带？
- 如何只看日志复盘一次请求？
- 系统卡住时，如何判断是 route、queue、worker、LLM runner 还是 DB 的问题？
- MVP 使用内存队列时，面试官会攻击什么？

### 小实验

跑一条完整链路：

```text
POST /sessions
POST /sessions/{id}/messages
worker processes job
assistant reply persisted
GET /sessions/{id}/messages
```

只看结构化日志，不看代码，复述：

- 请求从哪里进入。
- 生成了哪个 trace_id。
- 生成了哪个 job_id。
- 何时入队。
- 何时出队。
- worker 做了什么。
- reply 何时落库。
- 如果失败，失败原因在哪个 span / event。

### 审核标准

- 能定义最小日志字段集。
- 能解释 trace_id 与 job_id 的区别。
- 能写出一段面试防守话术：

```text
当前 MVP 使用 asyncio.Queue 是为了快速验证异步 Gateway 核心闭环。
我知道它的限制：进程重启会丢内存任务，无法跨进程扩展。
因此我通过 QueueBackend 接口隔离底层实现。
未来可以替换 Redis Streams / Celery / Kafka，而不修改业务 service。
```

## 10. Week 1 建议节奏

```text
Day 1:
  HTTP boundary / Pydantic / route-service split

Day 2:
  repository / SQLAlchemy / transaction / Alembic

Day 3:
  asyncio.Queue / dispatcher / worker / backpressure

Day 4:
  retry / backoff / failure status / graceful shutdown

Day 5:
  observability / trace_id / test strategy / final SPEC
```

每天结束必须产出：

- 一张数据流或状态流图。
- 一个小实验观察记录。
- 一组测试红线。
- 一段口头复述。
- 一个进入 Week 2 SPEC 的约束。

## 11. Week 1 总体验收

Week 1 结束时，不以代码量验收，而以控制力验收。

必须能回答：

- OpenClaw-Kernel 的最小闭环是什么？
- 哪些层属于 HTTP，哪些属于业务，哪些属于持久化，哪些属于任务调度？
- 一条 message 从 HTTP 到 assistant reply 的完整生命周期是什么？
- `asyncio.Queue` 的限制是什么？为什么第一轮仍然用它？
- 事务失败时如何避免半完成状态？
- 哪些错误该重试，哪些不该？
- 如何通过 trace_id 排查一个失败 job？
- 面试官问“为什么不用 Redis/Kafka/Celery”时怎么防守？

最终交付物：

```text
PROJECT_SPEC.md draft
SYSTEM_DESIGN.md draft
TEST_PLAN.md draft
AGENT_RULES.md draft
Week 2 implementation TODO
```

这些文件后续可以继续调整。本文件先作为第一轮后端体感训练的临时指导方针。
