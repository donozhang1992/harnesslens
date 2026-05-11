# OpenClaw 逆向工程分析跟踪

## 🎯 目标 (Goal)
系统性地逆向分析 OpenClaw 项目的整体架构与核心业务链路。
在深入分析子模块代码时，采用“隔离分析”策略，通过调用子 Agent (Sub-Agent) 完成代码检索和梳理，确保主对话 Session 的上下文始终保持精简，避免 Token 溢出或上下文污染。
最终目标是帮助一个4年DevOps背景，无后端/编程背景的工程师，通过拆解工业级项目源码，达到资深工程师的架构理解能力，包括核心设计模式的扫盲，分层架构、依赖注入、观察者模式的具体实现，设计权衡的深层思考，错误处理，tracing和logging，安全等等

## 📈 进度 (Progress)
1. **[已完成]** 顶层架构拆解：完成对核心目录（`src/`, `apps/`, `extensions/`, `packages/`）的分析，梳理了微内核与控制平面（Control Plane）设计，输出至 `top_level_analysis.md`。
2. **[已完成]** 方法论工程化：将子 Agent 隔离分析的工作流抽象为全局复用的 Skill (`isolated-investigation`)，并已全局安装。
3. **[已完成]** 经典设计模式映射：识别了适配器、观察者、策略、代理等 GoF 模式在项目中的具体应用场景，输出至 `design_patterns.md`，为后续源码拆解奠定了术语基础。
4. **[待进行]** 核心业务逻辑深度拆解：
   - **消息管线 (Message Pipeline)**：分析消息如何从适配器进入分发器，并最终返回。
   - **插件系统生命周期 (Plugin Lifecycle)**：深入研究 Loader 如何使用 Proxy 和 Registry 实现安全加载。
   - **Agent 调度与记忆 (Agent & Memory)**：探究模型策略选择与长效记忆的集成逻辑。

## 🛠️ 方法论 (Methodology)
1. **控制面板模式**：主 Agent 作为战略指挥中心，掌握整体架构大纲与已得出的结论。
2. **隔离调查 (Isolated Investigation)**：
   - 遇到需要阅读大量文件、追踪复杂逻辑链的具体问题时，触发 `isolated-investigation` Skill。
   - 主 Agent 负责梳理当前已知背景，构建详尽的提示词（Prompt）。
   - 委托 `codebase_investigator` 等子 Agent 在沙箱环境中执行具体的搜索和阅读。
   - 子 Agent 返回提炼后的结构化结论，主 Agent 整合结论并更新文档，全程不污染主上下文。
3. **持续集成**：将各个子模块的分析结论结构化记录，最终拼装为完整的系统架构与底层原理白皮书。
4. **可追溯**：持续更新这个文档的进度。
