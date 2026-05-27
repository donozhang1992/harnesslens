# 👑 航母指挥官首战指南：第一周实战与能力内化手册 (HUMAN_PLAYBOOK.md)

本手册专为**人类指挥官（你）**设计，用以指导你在第一个项目周期（Week 1）中，如何高效、有条不紊地调配 **Gemini（高维学习与架构教练）** 与 **Codex（多智能体代码生产线）**，完成项目冷启动并深度内化 Vibe Coding 能力。

---

## 🧭 双核驱动分工与物理隔离原则 (The Dual-Core & Isolation Principle)

为了最大化学习与产出效率，并确保模拟真实的工业项目开发，我们必须遵循以下两条红线：

1.  **物理隔离红线**：
    *   `MASTER_STRATEGY.md`、`VIBE_CODING_PLAYBOOK.md`、`HUMAN_PLAYBOOK.md` 以及根目录下的 **`references/`** 引用文件夹，是你的**外部个人心智资产与个人操作指南**，属于“幕后军师”。
    *   **不要将它们喂给 Codex 作为项目上下文！**
    *   必须在项目初始化时将它们加入到 **`.gitignore`** 中。
2.  **用项目专属文件作为唯一沟通媒介**：
    *   Codex 对架构、质量边界和多 Agent 协作规则的全部理解，必须**100% 来自于你输出的项目级标准化文件（`PRD.md`、`SPEC.md` 以及项目专属的 `AGENT_RULES.md`）**。
    *   你驾驭 Vibe Coding 的核心体现，正是**如何将你幕后的高维宪法原则，翻译并注入到该项目的专属 `AGENT_RULES.md` 中**，进而无缝操控 10+ 智能体舰队。

---

## 📅 第一周“人机异步协同”日历与操作步骤 (Week 1 Action Steps)

### 🏢 第一阶段：定义骨骼（用人脑与 Gemini 打磨设计，用 Codex 锁死契约）

#### 🟢 Day 1 上午：商业点子具象化与 PRD 编写
1.  **人类动作**：在根目录下新建并编写 `PRD.md`，写明你的产品目标、核心用户流、MVP 范围与明确的 Non-Goals。
2.  **Gemini 外部协同**：如果你觉得产品逻辑有漏洞，把 `PRD.md` 发给 **Gemini**（非开发环境）：
    *   *💬 对 Gemini 提问*：“这是我的 PRD。作为一个资深 AI 产品经理，你认为这个 MVP 范围是否足够精简？有什么常规增删改查是我应该砍掉的？”
3.  **最终产物**：锁定并保存根目录下的 **`PRD.md`**。

#### 🟢 Day 1 下午：翻译个人宪法，锁死项目协作规则，启动 Codex 编排
1.  **人类动作（翻译宪法）**：在项目根目录下新建 **`AGENT_RULES.md`**。参考你的幕后 **[VIBE_CODING_PLAYBOOK.md](file:///D:/Projects/2026bigdream/bootcamp/projects/VIBE_CODING_PLAYBOOK.md)** 第二章，将“10+ 智能体架构分工、并行规则、测试命令、测试自愈规则”等写入其中。
2.  **外部知识参考（ references/ 库）**：打开你本地克隆的 **`references/LLM-Engineers-Handbook`** 源码仓库，参考里面的工业级代码架构。
3.  **Codex 启动指令**：在 **Codex** 对话框中，**仅**提供项目专属文件，下达初始化指令：
    *   *💬 对 Codex 发送*：
        ```text
        你现在是 Codex 主 Orchestrator Agent。
        请深度阅读本项目根目录下的 PRD.md 与 AGENT_RULES.md。
        在完全理解产品目标、多 Agent 并行原则与文件边界前，不要编写任何业务代码。
        请先为我起草一版 SPEC.md 技术规范文档，明确提取核心技术对象与 API 契约，对不确定的技术选择向我提问。
        ```
4.  **Codex 动作**：自动生成 `SPEC.md` 初稿，保留设计的留白。
5.  **最终产物**：生成第一版 **`SPEC.md`** 与 **`AGENT_RULES.md`**。

#### 🟢 Day 2 全天：手写锁定 SPEC 契约（内化 Pydantic & API 设计）
1.  **人类动作**：对比参考答案，并结合外部参考的 **`references/` 库**，人手编写/调整 `SPEC.md`。重点锁定 Pydantic 数据校验模型和 API 路径定义。
2.  **Gemini 外部扫盲与手册对照**：如果你对数据模型设计（如 SQLAlchemy 异步事务处理、Pydantic 嵌套关系）不确定，或者想了解手册里的工业级设计，立刻贴代码拷问 **Gemini** 扫盲：
    *   *💬 对 Gemini 提问*：“Gemini，请向我深度拆解 Pydantic v2 中 `model_validator` 的运行原理。结合《LLM Engineers Handbook》中关于 Prompt 数据流的范式，我应该如何优雅地设计一个多 Agent 交互的通信数据契约 Payload？请给出重构代码示例。”
3.  **最终产物**：100% 手写锁定根目录下的 **`SPEC.md`**（技术规范唯一事实来源）。

---

### 🤖 第二阶段：机械内卷（用 Codex 进行 TDD 冲锋与自动自愈）

#### 🟢 Day 3 全天：Codex 派驻 QA 铸造测试网（TDD 质量卡门）
1.  **人类动作**：在 **Codex** 中，让主脑读取已锁定的 `SPEC.md` 拆分任务，并生成测试用例：
    *   *💬 对 Codex 发送*：
        ```text
        请读取本项目的 PRD.md、SPEC.md 与 AGENT_RULES.md。
        请为我生成或更新 TODO.md 原子任务清单，明确标出依赖关系与可并行 Worker 范围。
        生成 TODO 后，请立即派驻 QA 智能体，根据 SPEC.md 中的 API 契约在 tests/ 目录下编写全量覆盖的单元测试与异常测试用例。
        现在不要实现业务代码，编写完成后在本地终端运行测试，确认终端出现 100% 红色报错（Fail）。
        ```
2.  **最终产物**：产生原子化的 `TODO.md`，并且在终端验证全红测试，拉起质量闸门。

#### 🟢 Day 4 全天：去喝咖啡/睡觉，启动 10+ 舰队自愈总攻（脱水流实战）
1.  **人类动作**：关闭干扰，向 **Codex** 发送终极启动指令，然后去上 Bootcamp 课程、听课或直接睡觉：
    *   *💬 对 Codex 发送*：
        ```text
        现在，我授权你作为 Master Orchestrator，率领 10+ 智能体舰队对 TODO.md 中的并行任务发起总攻。
        请严格按照本项目根目录下的 AGENT_RULES.md 规范进行舰队调度。
        要求 Sandbox Self-Healer 监控终端，每次 Worker 提交代码后自动运行 pytest 捕获报错，反哺对应 Worker 进行 Error-Loop 自愈，直至测试全绿。
        现在启动！我将暂时离线，后台全自动运转。
        ```
2.  **Codex 动作**：Master Orchestrator 启动，分派 Domain 子协调器，Workers 并行轰炸，测试自愈器疯狂报错修改，直至代码全绿通过。
3.  **最终产物**：AI 搬砖通过本地沙箱的 pytest 全绿卡门，生成无冲突的高内聚零件代码。

---

### 👑 第三阶段：降维收网（用 Gemini 深度审计，用双端磨炼面试自卫）

#### 🟢 Day 5 全天：晨检、双层全链路 Observability 审计与 Gemini 重构拷问
1.  **人类动作**：起床打开电脑，确认控制台 100% 全绿通过测试。
2.  **双层可观测性审计**：
    *   **系统层审计**：在终端故意输入错误参数触发请求，观察 `Structlog` 输出的结构化 JSON 日志，寻找唯一的 `trace_id`。
    *   **LLM 编排层审计（Stage 2 起）**：打开本地部署的 **Langfuse Web UI 控制台**。在 Session 检索框中输入系统层的 `trace_id`。
    *   **验证 Trace 穿透**：确认在 Langfuse 中完美渲染出了以该 `trace_id` 为 `sessionId` 的完整嵌套 Span 树。检查其中 Master Orchestrator 派发子 Agent、Tool 调用的耗时与 Token 成本。
3.  **Gemini 深度重构审计**：把 AI 自动生成的 `services.py` 等核心逻辑代码贴给 **Gemini**（你的幕后私教）进行无情 Code Review。你可以同时打开外部参考的 **`references/LLM_Engineers_Handbook.pdf`** 进行理论对齐：
    *   *💬 对 Gemini 提问*：“这是我的多 Agent 并行实现代码。我已经通过了全量 pytest 单元测试。对比《LLM Engineers Handbook》中关于该设计模式的标准案例，你认为这段代码在高并发下是否存在 asyncio 协程死锁的风险？它的物理分层是否做到了足够解耦？请指出它的缺陷，不要直接改代码，给我改进思路。”
4.  **最终产物**：打上 Git Tag 封存项目（如 `git tag -a v1.0.0-sprint1 -m "sprint1 done"`）。

#### 🟢 Day 6 全天：双脑模拟答辩对线（面试终极演练）
1.  **Codex 动作**：在 **Codex** 窗口输入指令，提取面试题：
    *   *💬 对 Codex 发送*：`项目已全绿合并，请读取本项目的 SPEC.md 并配合你的代码库，执行 [/interview] 抽取 5 道答辩面试题！`
2.  **Gemini 答辩对线**：把 Codex 吐出来的 5 道 System Design 面试题直接贴给 **Gemini**，要求 Gemini 扮演最极端的 Tech Lead 面试官拷问你：
    *   *💬 对 Gemini 发送*：
        ```text
        你现在是墨尔本一线大厂的 Lead AI Engineer，我是来面试的候选人。
        这是我本次 Portfolio 项目的架构设计与实现 [贴入代码/SPEC]。
        这是 Codex 帮我抽取的 5 道答辩题 [贴入答辩题]。
        现在，请一次只向我抛出一个问题，无情拷问我。
        在我回答后，请根据大厂级的“插槽式自卫叙事”与“可观测性断言”（融合 Structlog 与 Langfuse 双层 Tracing）原则，指出我口头表达的软肋，并给我满分自卫回答的重构模版。
        ```
3.  **内化目标**：训练 2 - 3 轮，直到你能口头流利、极具商业与工程尊严地阐述“设计超前，实现极极简”的插槽解耦逻辑，并能流畅讲述双层可观测性联动排障的技术故事。

---

## 📈 第一周能力内化（学习效果）核对清单

第一周结束后，你必须确认自己掌握了以下 **AI Engineer 核心内功**。如果没有，下一周继续巩固：

*   [ ] **Spec 编写力**：你手写的 `SPEC.md` 是否可以让一个全新的 AI 对话秒懂业务，不产生 any 歧义？
*   [ ] **规则翻译能力**：你是否成功地把个人的 `VIBE_CODING_PLAYBOOK.md` 逻辑，成功翻译并落地为项目根目录下规范的 `AGENT_RULES.md`？
*   [ ] **双层 Trace 直觉（Stage 2 起）**：你是否能在 Structlog 中定位 `trace_id`，并成功通过它在 Langfuse 仪表盘上秒级拉出多层异构 Agent 交互链路？
*   [ ] **参考库对照力**：你是否能够熟练查找 **`references/` 库** 中的最佳实践，并在 Gemini 的扫盲下将其映射为自己项目的专属 `SPEC`？
*   [ ] **人机边界控制**：你是否克制住了“自己动手写无状态胶水代码”的冲动，把脏活累活 100% 授权给 AI 编队？
*   [ ] **测试网掌控力**：你是否习惯了“TDD 测试先行使其全红 -> 自愈全绿”的极速质检爽感？
*   [ ] **面试叙事力**：你是否能脱口而出“如何用 Repository 抽象接口设计插槽式架构，实现 asyncio 内存队列与 RabbitMQ/Celery 的一键无缝替换”？
