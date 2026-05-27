# 🚀 Codex-Native Vibe Coding 智能体编队与人机异步协同手册 (VIBE_CODING_PLAYBOOK.md)

## ⚖️ 第一章：人机边界与 Codex-Native 协同的第一性原理

在“多 Agent 协同编程”时代，人类的定位从“键盘敲击者”升级为**“代码航母指挥官”**。为了确保利用 Codex 进行 Vibe Coding时，代码不会退化为无法重构的垃圾，必须建立死锁式的人机权力边界。

### 1. 人类绝对专政区：宏观设计与决策 (System Design & Trade-offs)
AI 永远做不了具有全局视角的商业和架构决策，以下三件事人类绝不能交出控制权：
-   **商业逻辑转化为技术实体**：梳理核心数据流，定义高性能“快路径”与复杂编排“慢路径”的分流边界。
-   **技术栈的选型与妥协 (Trade-off)**：基于熟练度与交付速度，强制锁死库与框架（例如 FastAPI + SQLAlchemy 异步驱动 + 本地 SQLite 极速起步）。
-   **全局心智模型的终审**：人类必须把设计做到底层 **Schema（Pydantic & DB Model）** 这一级。AI 只有一个狭窄的上下文窗口，它看代码是局部碎片，只有人类能把握全局流动。

### 2. AI 机械搬砖区：无状态执行 (Stateless Execution)
一旦人类把骨架定死，所有涉及编写样板逻辑、查语法、写标准测试的粗活累活，全权交由 AI 编队执行：
-   **契约代码补全**：根据 Schema 定义编写数据校验层（Pydantic）和标准接口路由。
-   **测试驱动包办 (TDD)**：根据契约定义，疯狂堆砌和补齐各个极端边界值、异常流的单元测试。
-   **报错自愈闭环 (Error-Loop)**：在本地沙箱中自动运行测试，自己读取控制台报错，自己重试修改 Bug，直到测试全绿。

### 3. 物理隔离：个人宪法与项目仓库的绝对边界 (External Constitution Principle)
> [!IMPORTANT]
> **真实工业项目开发的核心原则**：
> 
> 在真实的商业开发和企业协作中，代码仓库中**绝对不能**污染开发者的个人私有文档（如 `MASTER_STRATEGY.md` 和 `VIBE_CODING_PLAYBOOK.md`）及外部参考资料。它们属于你作为指挥官的**“幕后军师与外部参考知识库”**。
> 
> *   **物理隔离**：本文件、`MASTER_STRATEGY.md`、`HUMAN_PLAYBOOK.md` 以及中央引用库 **`references/`** 目录必须放入 **`.gitignore`** 中，或者保存在代码库外部。
> *   **项目自包含**：**严禁**命令 Codex 直接读取本文件。Codex 的 10+ 智能体编队只能读取代码库内标准的项目级事实来源文件（`PRD.md`、`SPEC.md` 以及项目专属的 `AGENT_RULES.md`）。
> *   **能力内化的真谛**：你对 Vibe Coding 驾驭能力的体现，正是你**如何将外部的“高维宪法原则”以及 `references/` 库中的“工业级代码模式”翻译并注入到该项目的专属 `AGENT_RULES.md` 与技术 `SPEC.md` 中**，进而无缝操控 10+ 智能体舰队。

---

## 🏢 第二章：10+ 智能体编队架构设计 (10+ Agent Fleet Architecture)

为了在求职面试中展现绝对的系统工程控盘力，我们将每个项目的开发工作流委托给一个**由 10+ 个异构智能体组成的“代码航母编队”**。在 Codex 原生环境中，你不需要手动拉起这 10+ 个窗口，而是通过 **Codex 主 Orchestrator Agent 自动派发和驱动子 Agent 并行作业**。

```text
                           [人类指挥官 (Commander)]
                                      │
                                      ▼ (注入声明式文件体系)
            ┌───────────────────────────────────────────────┐
            │ 1. 控制面 / 顶级编排 (Master Orchestrator)      │
            └───────────────┬───────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐ (子任务有向无环图 DAG)
            ▼                               ▼
  ┌───────────────────┐           ┌───────────────────┐
  │ 2. 领域级子编排   │           │ 2. 领域级子编排   │
  │ (Domain-A Sub-Orch)│          │ (Domain-B Sub-Orch)│
  └─────────┬─────────┘           └─────────┬─────────┘
            │                               │
      ┌─────┴─────┐                   ┌─────┴─────┐ (并发分发原子零件)
      ▼           ▼                   ▼           ▼
┌──────────┐┌──────────┐        ┌──────────┐┌──────────┐
│3. 数据面 ││3. 数据面 │        │3. 数据面 ││3. 数据面 │
│ (Worker) ││ (Worker) │        │ (Worker) ││ (Worker) │
│ - Schema ││ - Service│        │ - Route  ││- Adapter │
└────┬─────┘└────┬─────┘        └────┬─────┘└────┬─────┘
     │           │                   │           │
     └───────────┼───────────────────┼───────────┘ (提交代码)
                 │                   │
                 ▼                   ▼
            ┌───────────────────────────────────────────────┐
            │ 4. 质控层 / 过滤面 (Filter & Quality Control)  │
            │    - QA Agent 1 (API 测试卡门)                │
            │    - QA Agent 2 (并发与边界卡门)              │
            │    - Review & Security Agent (漏洞与契约审查)  │
            │    - Sandbox Self-Healer (终端编译与自动纠错)   │
            └───────────────────────┬───────────────────────┘
                                    │ (全绿测试通过)
                                    ▼
                         [大厂级 PR & Git Tag 封存]
```

### 1. 控制面 / 编排层 (Control Plane - 3 Agents)
-   **Master Orchestrator (1x - 顶级独裁大脑)**：直接与人类对接。负责深度理解 `PRD.md` 和 `SPEC.md`，构建任务有向无环图（DAG），拆分 `TODO.md`，协调子编排器并最终整合收网。
-   **Domain Sub-Orchestrators (2x - 领域分治大脑)**：
    *   **Domain-A Sub-Orch (后端数据与业务域)**：负责协调数据库 Model、Pydantic Schema 以及 Service 层 Worker。
    *   **Domain-B Sub-Orch (接口路由与集成适配域)**：负责协调 FastAPI 路由定义、第三方 API 适配器 Worker。
    *   *作用*：**彻底解决大模型 Token 限制与上下文膨胀问题**，将全局复杂度物理隔离。

### 2. 数据面 / 并发执行层 (Data Plane - 4 Workers)
-   **Schema Worker (1x)**：专门负责编写严格契约定义（Pydantic & Base Model）。
-   **Repository Worker (1x)**：专门负责 SQLAlchemy 异步事务及持久化数据查询。
-   **Service Logic Worker (1x)**：专门负责纯内存业务逻辑运算，不直接操作 DB 或路由。
-   **Route Endpoint Worker (1x)**：专门负责 FastAPI 路由入口接入与校验响应。
-   *原则*：**单兵职责，文件所有权绝对锁死**，单文件代码长度控制在 100 行内，规避 AI 之间的代码冲突与幻觉。

### 3. 过滤面 / 无情质控层 (Filter Plane - 4 Agents)
-   **QA API Agent (1x)**：无情质检员 1 号。专职在编码前，根据 `SPEC.md` 的 API 契约生成 pytest 单元测试骨架。
-   **QA Boundary Agent (1x)**：无情质检员 2 号。专职为并发流量控制、异常状态机跳转、网络 Rate Limit 场景编写异常测试。
-   **Security & Review Agent (1x)**：只读审查者。在最终合并前，静态扫描是否有 hardcode 密钥、循环依赖以及不合理的包引用。
-   **Sandbox Self-Healer (1x - 自动编译纠错器)**：**脱水流的发动机**。监控本地终端，自动捕获测试报错（pytest），将失败堆栈反哺给对应 Worker 启动 Error-Loop 自动纠错，直至本地测试 100% 通过。
-   *LLM 链路增强（Stage 2 起）*：在阶段二中，QA 与 Review 智能体将配合 **Langfuse**。Sandbox Self-Healer 运行测试时，会自动将每次 LLM 调用的 Trace 数据上报至本地私有化部署的 Langfuse 控制台，用于检测 Token 开销与嵌套调用的 Span 耗时。

---

## 📂 第三章：Codex 声明式多维文件驱动体系 (The Declarative Files)

在 Codex 中，**严禁使用长篇大论的自然语言进行碎碎念沟通**。我们必须通过项目根目录下由你亲自注入的 **4 个项目规范文件** 强行划定整个智能体舰队的内存边界：

1.  📄 **`PRD.md`（产品需求文档）**：人类编写，用于交代产品目标、核心用户流程、MVP 边界与 Non-Goals，严防需求蔓延。
2.  📄 **`SPEC.md`（技术规范文档）**：**整个航母舰队的唯一技术真理。** 由人类亲自锁定技术栈、数据模型、API 交互契约、状态机跳转原则以及测试命令。
3.  📄 **`TODO.md`（原子任务清单）**：由 Master Orchestrator 自动将 `SPEC.md` 切分而成的零件清单（控制在 100 行代码以内），完成一项，勾掉一项。
4.  📄 **`AGENT_RULES.md`（当前项目专属协作规则）**：**外部协同体系的落地实体**。在这里明确定义该项目里 10+ 智能体编队的分工、文件所有权边界（File Ownership）、并行/串行禁区、测试自愈规则。此文件必须与代码库一同封存。

> [!TIP]
> **中央核心引用库的映射 (Central Reference Mapping)**：
> 
> 在根目录外部，我们建立了 **`references/`** 文件夹（已加入 `.gitignore`，内含 **`LLM-Engineers-Handbook` 工业级源码** 及电子书）。当你在设计 `SPEC.md` 时，如果面临复杂的工业模式（如多级 RAG 混合检索、复杂的评估 Evlas 或微调数据清洗），你或在运行编排的 Codex 可以作为外部参考，读取 `references/` 中的规范模块进行“架构映射与抄写”。
> 
> **这样可以确保你的代码拥有最纯正的大厂工业落地质感，无需瞎猜！**

---

## ☕ 第四章：“去喝咖啡/睡觉”人机异步脱水流操作指南

当你需要启动项目开发时，按照以下 4 步金字塔操作，即可轻松实现**“你在睡觉，10+ Agent 在疯狂内卷”**的极致异步工作流：

### 🏢 第一阶段：人类定骨架（手写主权 - 耗时 20%）

#### Step 1：编写 `PRD.md`、`SPEC.md` 与项目专属 `AGENT_RULES.md`
在根目录下亲自手写，或通过指令起草并由你最终微调锁定。核心是锁死 Pydantic 数据模型和 API 状态定义。
*   *关键点*：此时，你必须根据你的 **[VIBE_CODING_PLAYBOOK.md](file:///D:/Projects/2026bigdream/bootcamp/projects/VIBE_CODING_PLAYBOOK.md)** 原则，并参考外部 **`references/LLM-Engineers-Handbook/`** 中的最佳代码实践设计，翻译并向当前项目注入一份 **`AGENT_RULES.md`**，用以指挥 Codex 内部的多 Agent 并行逻辑。

#### Step 2：触发顶级主脑编排并确认 `TODO.md`
在 Codex 对话框中，**仅**提供项目专属文件，下达初始化指令：
> **💬 初始化指令 (Orchestrate Command)**：
> “你现在是 Codex 主 Orchestrator Agent。请深度阅读本项目根目录下的 `PRD.md`、`SPEC.md` 与 `AGENT_RULES.md`。在完全内化系统边界前，不要编写任何业务代码。阅读完成后，请为我生成解耦且原子的 `TODO.md` 任务清单，并为 10+ 智能体舰队规划出清晰的并行任务依赖图（DAG）。”

*人类质检*：快速确认 `TODO.md` 中的文件分工是否重合、任务是否切得足够原子（<100行）。

---

### 🤖 第二阶段：舰队深海内卷（AI 战场 - 耗时 70%）

#### Step 3：建立绞肉机（TDD 测试卡门）
在 TODO 计划通过后，授权主脑派驻 QA Agent 编织测试网：
> **💬 铸造测试网指令 (TDD Command)**：
> “请启动 QA API Agent 与 QA Boundary Agent，根据本项目的 `SPEC.md` 契约，在 tests/ 目录下编写全量覆盖的单元测试与异常测试用例。现在不要实现业务代码。编写完成后，在本地终端运行测试，确认终端出现 100% 红色报错（Fail）。”

*效果*：测试全红代表质量闸门已完美铸造完毕。

#### Step 4：启动“去喝咖啡/睡觉”自愈总攻指令
这是脱产转型期最核心的生产力杠杆。发出以下指令，即可关掉屏幕去喝咖啡或睡觉：
> **💬 睡觉/脱水流总指令 (Launch Fleet Command)**：
> “现在，我授权你作为 Master Orchestrator，率领 10+ 智能体舰队对 TODO.md 中的并行任务发起总攻。
> 要求：
> 1. Domain Sub-Orchestrators 严格按照项目 `AGENT_RULES.md` 分流调度 Worker，限定文件所有权，禁止跨区踩脚。
> 2. Sandbox Self-Healer 必须常驻监控本地终端。每次 Worker 提交代码后，自动运行测试命令：`pytest`。
> 3. 当测试失败时，Sandbox Self-Healer 自动抓取控制台 Traceback，反哺对应 Worker 启动 Error-Loop 自愈修复循环。
> 4. 当子模块测试全部全绿后，交由 Security Agent 审查静态安全性与依赖完整性。
> 5. 整合完毕后运行全量测试，全绿后输出最终收口报告。
> 
> 现在启动！我将暂时离线，请让你的航母编队在后台全自动运转直至收网。”

---

### 👑 第三阶段：降维收网（老兵终审 - 耗时 10%）

#### Step 5：晨检与双层可观测性联调审计
第二天早晨你打开电脑，执行收网质检：
1.  **检查测试结果**：确认本地控制台输出是一抹赏心悦目的 **100% 全绿（All Tests Passed）**。
2.  **可观测性审计（双层联动 - Stage 2 起）**：
    *   在控制台观察系统层 `Structlog` 输出的结构化 JSON。
    *   打开本地部署的 **Langfuse Web UI 控制台**。在 Session 检索框中输入系统层的 `trace_id`。
    *   **验证 Trace 穿透**：确认在 Langfuse 中完美渲染出了以该 `trace_id` 为 `sessionId` 的完整嵌套 Span 树。检查其中 Master Orchestrator 派发子 Agent、Tool 调用的耗时与 Token 成本。
3.  **Gemini 深度重构审计**：把 AI 自动生成的 `services.py` 等核心逻辑代码贴给 **Gemini**（你的幕后私教）进行无情 Code Review。你可以同时打开外部参考的 **`references/LLM_Engineers_Handbook.pdf`** 进行理论对齐：
    *   *💬 对 Gemini 提问*：“这是我的多 Agent 并行实现代码。我已经通过了全量 pytest 单元测试。对比《LLM Engineers Handbook》中关于该设计模式的标准案例，你认为这段代码在高并发下是否存在 asyncio 协程死锁的风险？它的物理分层是否做到了足够解耦？请指出它的缺陷，给我改进思路。”
4.  **封存归档**：输入命令打上 Git Tag 封存项目（如 `git tag -a v1.0.0-sprint1 -m "sprint1 complete"`）。
5.  **反向面试演练**：发送指令触发 `/interview`，利用自动生成的攻防题库，在脑子里疯狂演练“插槽式自卫叙事”，确保你的控盘技术细节能够完美说服大厂面试官。

---

## 🛠️ 第五章：舰队突发事件应对机制 (Incident Management)

在全自动运行中，智能体舰队遭遇异常时，主脑会通过暂停并高亮日志向你预警，常见场景应对如下：

### 1. 遭遇技术规范 (SPEC) 歧义或冲突
*   *主脑表现*：测试在自愈 3 次后依旧血红，报错指向输入输出契约逻辑冲突。
*   *你的指令*：
    ```text
    此处技术规范发生歧义，我决定采用方案 A：[输入你的具体业务/技术决定]。
    请 Master Orchestrator 更新 SPEC.md，刷新 TODO.md，并重置相关 Worker 的自愈状态继续执行。
    ```

### 2. 遭遇文件所有权抢占 (File Ownership Lock)
*   *主脑表现*：Worker A 与 Worker B 并行时，试图同时修改中间的胶水层逻辑（如路由映射文件）。
*   *你的指令*：
    ```text
    Domain Sub-Orchestrator 介入，收回该胶水文件的修改权限。
    请将该胶水逻辑的实现剥离为一个独立的串行 TODO 任务，安排在 Worker A 与 B 运行完毕后由主脑整合。
    ```

### 3. 遭遇 API Rate Limit (Token 瞬时炸膛)
*   *主脑表现*：Sandbox Self-Healer 反馈连续报 429 Limit 错误，导致重试算子拦截失效。
*   *你的指令*：
    无需插手。我们在 `MASTER_STRATEGY.md` 中锁死的带抖动指数退避自愈装饰器会自动挂起协程，并在指数级延迟后自动重试，展示系统的生产级抗压性。
