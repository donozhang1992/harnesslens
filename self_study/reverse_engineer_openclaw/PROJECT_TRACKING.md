# OpenClaw 逆向工程分析跟踪

> 📌 **主战手册与学习入口**：请参阅 [python_learning_plan.md](./python_learning_plan.md) 获取完整的“1个月 Python 后端架构迁移与自研路线图”。后续所有的代码拆解与实战开发均以此文档为总指导。

## 🎯 目标 (Goal)
系统性地逆向分析 OpenClaw 项目的整体架构与核心业务链路。
在深入分析子模块代码时，采用“隔离分析”策略，通过调用子 Agent (Sub-Agent) 完成代码检索和梳理，确保主对话 Session 的上下文始终保持精简，避免 Token 溢出或上下文污染。
最终目标：
1. 是帮助一个4年DevOps背景，无后端/编程背景的工程师，通过拆解工业级项目源码，达到资深工程师的架构理解能力，包括核心设计模式的扫盲，分层架构、依赖注入、观察者模式的具体实现，设计权衡的深层思考，错误处理，tracing和logging，安全等等
2. 我能够徒手创建一个这样级别的开源项目并发布

## 📈 进度 (Progress)
1. **[已完成]** 顶层架构拆解：完成对 OpenClaw C++/TS 核心目录的初步分析，梳理了微内核与控制平面设计。
2. **[已完成]** 战略重构：根据 AIE 主战场需求，将学习计划重构为“Python 后端架构迁移”，确立了以 FastAPI, Kafka, Celery, LangGraph 为核心的 1 个月实战路径，输出至 `python_learning_plan.md`。
3. **[进行中]** Phase 1: 底座夯实 (Week 1)。正在进行 FastAPI + Pydantic + SQLAlchemy 的基础架构设计。
4. **[待进行]** 核心业务逻辑深度拆解与迁移：
   - **消息管线与 Kafka 映射**：将 OpenClaw 的 Message Pipeline 映射至 Kafka 事件总线。
   - **Agent 调度与 LangGraph**：利用 LangGraph 复现 OpenClaw 的 Agent 决策循环。
   - **分布式任务与 Celery**：将长耗时任务迁移至 Celery 后端。

## 🛠️ 方法论 (Methodology)
1. **控制面板模式**：主 Agent 作为战略指挥中心，掌握整体架构大纲与已得出的结论。
2. **隔离调查 (Isolated Investigation)**：
   - 遇到需要阅读大量文件、追踪复杂逻辑链的具体问题时，触发 `isolated-investigation` Skill。
   - 主 Agent 负责梳理当前已知背景，构建详尽的提示词（Prompt）。
   - 委托 `codebase_investigator` 等子 Agent 在沙箱环境中执行具体的搜索和阅读。
   - 子 Agent 返回提炼后的结构化结论，主 Agent 整合结论并更新文档，全程不污染主上下文。
3. **持续集成**：将各个子模块的分析结论结构化记录，最终拼装为完整的系统架构与底层原理白皮书。
4. **可追溯**：持续更新这个文档的进度。
