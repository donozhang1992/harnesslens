# Codex 多 Agent 开发 Playbook

这份 Playbook 只从**人类操作者视角**写：你需要准备哪些文件、按什么顺序操作、什么时候对 Codex 说什么。

你不需要手动给 QA Agent、Worker Agent、Review Agent 分别复制 Prompt。正确方式是：

```text
你给 Codex 主 Agent 一个总指令。
Codex 主 Agent 读取项目文件和规则。
Codex 主 Agent 自动生成子 Agent 的任务 Brief，并派发并行工作。
```

---

## 1. 总体工作流

```text
Step 0  准备项目文件
Step 1  写 PRD.md
Step 2  写或生成 SPEC.md
Step 3  放入 AGENT_RULES.md
Step 4  让 Codex 生成 TODO.md
Step 5  人类审查 TODO.md 和并行计划
Step 6  授权 Codex 多 Agent 并行执行
Step 7  Codex 自行测试、修复、Review
Step 8  人类看最终结果，决定继续、收窄或发布
```

---

## 2. 你需要知道的 4 个文件

项目根目录建议固定放：

```text
PRD.md
SPEC.md
TODO.md
AGENT_RULES.md
```

### 文件职责

| 文件 | 谁主要维护 | 用途 |
|---|---|---|
| `PRD.md` | 人类为主，Codex 可辅助 | 产品目标、用户流程、MVP 范围、成功标准 |
| `SPEC.md` | 人类确认，Codex 可起草 | 技术契约、数据模型、API、状态机、错误码、测试要求 |
| `TODO.md` | Codex 生成，人类审查 | 原子任务、依赖关系、文件范围、并行计划 |
| `AGENT_RULES.md` | 固定模板，人类按项目微调 | 多 Agent 协作规则、文件所有权、验收方式 |

重要区别：

```text
PRD.md          = 产品事实来源
SPEC.md         = 技术事实来源
TODO.md         = 当前执行计划
AGENT_RULES.md  = 多 Agent 协作规则
```

这些文件通常不会自动加载。每次启动任务时，最好明确告诉 Codex 去读它们。

---

## 3. Step 1：写 PRD.md

目标：先把商业和产品边界说清楚。

你可以自己写，也可以让 Codex 帮你起草。但最终必须由你确认，因为这是产品判断，不是代码生成问题。

### PRD.md 模板

```md
# PRD

## 1. Product Goal

这个项目要解决什么问题？

## 2. Target Users

谁会使用它？

## 3. Core User Flows

### Flow 1: [流程名称]

1. 用户做什么。
2. 系统返回什么。
3. 成功状态是什么。
4. 失败状态是什么。

### Flow 2: [流程名称]

1. 用户做什么。
2. 系统返回什么。

## 4. Core Features

- Feature 1:
- Feature 2:
- Feature 3:

## 5. Non-Goals

当前阶段明确不做什么？

## 6. MVP Scope

第一版必须交付：

- [ ] 功能 A
- [ ] 功能 B
- [ ] 功能 C

## 7. Success Criteria

满足什么条件，算这一版完成？
```

如果你想让 Codex 帮你起草 PRD，用这个 Prompt：

```text
请根据我的想法起草 PRD.md。

要求：
1. 先把产品目标、目标用户、核心用户流程、MVP 范围和成功标准写清楚。
2. 明确 Non-Goals，避免 MVP 膨胀。
3. 不要写技术实现。
4. 写完后列出需要我确认的产品问题。

我的想法如下：
[粘贴你的想法]
```

---

## 4. Step 2：写或生成 SPEC.md

目标：把产品意图变成技术契约。

`SPEC.md` 不是 `CLAUDE.md` / `CONTEXT.md`。它不是给工具自动加载的总上下文，而是项目的**技术事实来源**。

### SPEC.md 必须包含

- 技术栈。
- 数据模型。
- API 输入输出。
- 状态机。
- 错误码。
- 权限和安全规则。
- 测试命令。
- 不允许突破的技术边界。

### SPEC.md 模板

````md
# SPEC

## 1. Tech Stack

- Language:
- Framework:
- Database:
- Test command:
- Build command:

## 2. Data Models

### Model: [Name]

Fields:

- `id`: string, required
- `created_at`: datetime, required
- `status`: enum, required

Validation rules:

- Rule 1:
- Rule 2:

## 3. API Contracts

### Endpoint: `POST /api/example`

Request:

```json
{
  "field": "value"
}
```

Success response:

```json
{
  "id": "string",
  "status": "created"
}
```

Error responses:

- `400`: invalid input
- `401`: unauthorized
- `404`: not found

## 4. State Machine

Allowed transitions:

- `draft -> active`
- `active -> archived`

Forbidden transitions:

- `archived -> active`

## 5. Business Rules

- Rule 1:
- Rule 2:

## 6. Security Rules

- No hardcoded secrets.
- Validate all external input.
- Do not log sensitive data.

## 7. Testing Requirements

Required test command:

```bash
[填写测试命令，例如 pytest]
```

Tests must cover:

- Normal path.
- Boundary values.
- Invalid input.
- Permission failures.
- State transitions.
````

如果你已经有 `PRD.md`，可以让 Codex 起草 `SPEC.md`：

```text
请读取 PRD.md，帮我起草 SPEC.md。

要求：
1. 先根据 PRD.md 提取核心技术对象、数据模型、API 契约和状态机。
2. 对不确定的技术选择提出问题，不要擅自替我做重大架构决定。
3. 标注哪些内容是你推断的，哪些内容来自 PRD.md。
4. 在我确认 SPEC.md 之前，不要写业务代码。
```

人类确认重点：

- 数据模型是否真的表达业务。
- API 是否服务核心用户流程。
- 状态机是否有遗漏。
- 错误码和权限规则是否明确。
- 测试命令是否真实可运行。

---

## 5. Step 3：放入 AGENT_RULES.md

目标：让 Codex 主 Agent 知道如何派发子 Agent，如何避免并行冲突。

你通常可以直接复制下面模板。项目特殊时，只需要改文件路径、测试命令、禁止范围。

### AGENT_RULES.md 固定模板

```md
# AGENT_RULES

## 1. Orchestrator

Codex 主 Agent 是唯一协调者，负责：

- 读取 `PRD.md`、`SPEC.md`、`TODO.md`。
- 判断任务依赖关系。
- 分配子 Agent。
- 为每个子 Agent 自动生成任务 Brief。
- 防止多个 Worker 修改同一文件。
- 整合结果并运行最终测试。
- 输出最终完成状态和剩余风险。

## 2. Human Does Not Manually Prompt Sub Agents

人类只给 Codex 主 Agent 下达总指令。

QA Agent、Worker Agent、Review Agent 的具体任务 Brief 由 Codex 主 Agent 自动生成。

每个 Brief 必须包含：

- Agent 角色。
- 任务目标。
- 需要读取的上下文。
- 允许修改的文件范围。
- 禁止事项。
- 验收标准。
- 需要运行的测试。

## 3. Parallelism Rules

允许并行：

- 代码库探索。
- 测试设计。
- 互不重叠文件范围的实现。
- Review / Security 审查。

必须串行：

- 修改 `SPEC.md`。
- 修改 `TODO.md` 的任务依赖结构。
- 多个 Agent 需要修改同一文件。
- 跨模块错误修复。
- 最终全量测试和验收。

## 4. File Ownership

每个 Worker 必须声明允许修改的文件范围。

示例：

- QA Agent: `tests/**`
- Worker A: `app/models/**`, `app/schemas/**`
- Worker B: `app/api/**`, `app/routers/**`
- Worker C: `app/services/**`
- Review Agent: read-only unless explicitly authorized

Worker 不得修改其他 Worker 的文件范围。

如果必须跨范围修改，必须交回 Orchestrator 判断。

## 5. QA First

QA Agent 优先根据 `SPEC.md` 写测试。

测试应覆盖：

- 正常路径。
- 边界值。
- 异常输入。
- 权限规则。
- 状态机跳转。
- 错误码和错误消息。

## 6. Worker Rules

Worker 必须：

- 只完成分配任务。
- 遵守 `SPEC.md`。
- 不扩大范围。
- 不回滚他人改动。
- 优先通过相关测试。
- 报告修改文件和测试结果。

## 7. Error-Loop Rules

测试失败时：

- 先判断失败属于测试问题、实现问题、环境问题还是 `SPEC.md` 歧义。
- 局部失败交给对应 Worker 修。
- 跨模块失败交给 Orchestrator 修。
- 每次修复后重新运行相关测试。
- 最终必须运行完整测试。

## 8. Review Rules

Review Agent 默认只读。

重点检查：

- 是否违反 `SPEC.md`。
- 是否存在状态机漏洞。
- 是否遗漏边界条件。
- 是否存在安全风险。
- 是否硬编码密钥、路径或环境变量。
- 是否存在测试缺口。
- 是否引入不必要复杂度。

## 9. Final Acceptance

最终收口必须包含：

- 完成的 `TODO.md` 项。
- 修改文件列表。
- 测试命令和结果。
- 未解决风险。
- 下一步建议。
```

---

## 6. Step 4：让 Codex 生成 TODO.md

目标：让 Codex 把 `PRD.md` 和 `SPEC.md` 拆成可执行任务。

这是你第一次正式启动 Codex 主 Agent。这个阶段不要让它写业务代码。

### 你要发给 Codex 的 Prompt

```text
你现在是 Codex 主 Orchestrator Agent。

请读取 PRD.md、SPEC.md、AGENT_RULES.md。

在完整理解产品目标、技术契约、数据模型、API 边界和测试要求之前，不要写任何业务代码。

请生成或更新 TODO.md。

要求：
1. 每个任务必须有清晰输入、输出和验收标准。
2. 每个任务尽量控制在一个小模块内完成。
3. 标注任务类型：测试 / 数据模型 / API 路由 / 服务逻辑 / 前端 / 文档 / Review。
4. 标注是否可并行。
5. 标注建议 Agent 类型：QA Agent / Worker Agent / Review Agent。
6. 标注允许修改的文件范围。
7. 标注任务依赖关系。
8. 标注哪些任务必须串行。
9. 不要开始写业务代码，只生成任务拆解和并行计划。
```

### TODO.md 应该长这样

```md
# TODO

## Task Status

- [ ] T001 - Write contract tests
- [ ] T002 - Implement data models
- [ ] T003 - Implement API routes

## Task Details

### T001 - Write contract tests

Type: Testing
Agent: QA Agent
Parallel: Yes
Depends on: SPEC.md
Allowed files:

- `tests/**`

Acceptance criteria:

- Tests cover normal path, boundary values, invalid input, and error codes.
- Tests follow existing project style.
- Test command has been run.

### T002 - Implement data models

Type: Data Model
Agent: Worker Agent
Parallel: Yes
Depends on: T001
Allowed files:

- `app/models/**`
- `app/schemas/**`

Acceptance criteria:

- Matches `SPEC.md`.
- Relevant tests pass.
- Does not modify API routes or service logic.

### T003 - Implement API routes

Type: API Route
Agent: Worker Agent
Parallel: Yes
Depends on: T001, T002
Allowed files:

- `app/api/**`
- `app/routers/**`

Acceptance criteria:

- API matches request and response contracts.
- Error codes match `SPEC.md`.
- Relevant tests pass.
```

---

## 7. Step 5：人类审查 TODO.md

目标：在并行实现前，确认任务边界没有切错。

你重点看 5 件事：

- 是否有任务遗漏。
- 是否有任务太大。
- 是否有多个 Worker 会修改同一文件。
- 是否有业务顺序被错误并行。
- 是否有验收标准不清楚。

如果 TODO.md 不满意，对 Codex 说：

```text
请修改 TODO.md。

我发现这些问题：
1. [问题一]
2. [问题二]
3. [问题三]

请只更新 TODO.md 和并行计划，不要写业务代码。
```

如果 TODO.md 满意，进入下一步。

---

## 8. Step 6：授权 Codex 多 Agent 并行执行

目标：你只发一个总命令。子 Agent 的具体 Prompt 由 Codex 主 Agent 自动生成。

### 你要发给 Codex 的 Prompt

```text
请读取 PRD.md、SPEC.md、TODO.md、AGENT_RULES.md，按 AGENT_RULES.md 使用多 Agent 并行执行。

你作为 Codex 主 Orchestrator，负责：
1. 确认 TODO.md 中哪些任务可以并行，哪些必须串行。
2. 为每个子 Agent 自动生成任务 Brief。
3. 每个任务 Brief 必须包含角色、任务目标、上下文、允许修改的文件范围、禁止事项、验收标准和测试命令。
4. QA Agent 先写测试。
5. Worker Agent 按文件所有权并行实现。
6. 如果测试失败，进入 Error-Loop，最小范围修复。
7. Review / Security 审查在实现后执行。
8. 最后由你整合、运行完整测试并收口。

请先输出并行分工方案，然后开始执行。
```

你不需要再手动发送 QA Prompt、Worker Prompt 或 Review Prompt。

---

## 9. Step 7：中途你可能需要说的话

多数情况下你不用插手。只有下面几种情况需要你介入。

### 情况 A：Codex 遇到 SPEC 歧义

你回答业务或技术选择即可：

```text
这里按方案 A 处理：[你的决定]。

请更新 SPEC.md 和 TODO.md，然后继续执行。
```

### 情况 B：Codex 发现跨文件所有权冲突

你让主 Agent 收回协调权：

```text
这个冲突由主 Orchestrator 处理。

请暂停相关 Worker，重新划分文件所有权，更新 TODO.md，然后继续。
```

### 情况 C：测试失败

通常 Codex 会自己处理。如果它停下来问你，可以说：

```text
请读取终端输出，进入 Error-Loop。

要求：
1. 先判断失败是测试问题、实现问题、环境问题还是 SPEC 歧义。
2. 最小范围修复。
3. 修复后重新运行相关测试。
4. 最后运行完整测试。
```

### 情况 D：你想收窄范围

```text
请暂停实现。

把当前 TODO.md 收窄到只完成以下目标：
1. [目标一]
2. [目标二]

其他任务移到 Later，不要继续实现。
```

---

## 10. Step 8：最终收口

目标：让 Codex 给你真实完成状态。

通常 Codex 在执行完成后会自动收口。如果你要手动触发，用这个 Prompt：

```text
请作为 Codex 主 Orchestrator 做最终收口。

要求：
1. 汇总本轮完成了哪些 TODO.md 任务。
2. 列出修改过的文件。
3. 运行完整测试命令。
4. 如果测试通过，说明通过结果。
5. 如果测试未通过，说明失败原因和剩余阻塞。
6. 做一次最终 code review。
7. 给出剩余风险和下一步建议。

不要夸大完成度，只报告真实状态。
```

你最终要看：

- 测试是否真的跑过。
- TODO.md 哪些完成，哪些没完成。
- 有没有剩余风险。
- 有没有需要你做产品决策的地方。

---

## 11. 哪些阶段可以并行

你不需要手动调度并行，但你要理解边界。

```text
必须串行：
- PRD.md 确认
- SPEC.md 确认
- TODO.md 任务依赖确认
- 多个 Agent 修改同一文件
- 跨模块错误修复
- 最终完整测试和验收

可以并行：
- 代码库探索
- 测试设计
- 互不重叠文件范围的实现
- Review / Security 审查

半并行：
- Error-Loop
  - 局部失败由对应 Worker 修
  - 跨模块失败交回主 Orchestrator
```

---

## 12. 最小可用流程

如果你不想写太多，最低只需要：

```text
PRD.md
SPEC.md
AGENT_RULES.md
```

然后对 Codex 说：

```text
请读取 PRD.md、SPEC.md、AGENT_RULES.md，先生成 TODO.md，不要写业务代码。

生成后请标注可并行任务、文件范围、依赖关系和验收标准。
```

确认 `TODO.md` 后，再说：

```text
请读取 PRD.md、SPEC.md、TODO.md、AGENT_RULES.md，按 AGENT_RULES.md 使用多 Agent 并行执行。

你作为主 Orchestrator 自动生成子 Agent 任务 Brief，QA 先写测试，Worker 分文件实现，失败时进入 Error-Loop，最后完整测试、Review 和收口。
```

---

## 13. 一句话记忆

```text
人类负责 PRD 和 SPEC 的判断。
Codex 负责 TODO 拆分、多 Agent 派发、实现、测试、修复、Review 和收口。
人类不手动 Prompt 子 Agent，只授权主 Agent 按规则派发。
```
