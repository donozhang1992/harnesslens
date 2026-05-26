# 00_START_HERE: LLM Twin Reverse Engineering Dashboard

## 1. 当前定位

本目录用于开展 LLM Twin / LLM Engineers Handbook 的逆向工程、重写学习和求职作品集设计。

当前主线不是立刻复制完整项目，而是先做系统拆解，再选择最小可闭环子集进行重写：

```text
LLM Twin 逆向
  -> 系统地图
  -> Mini LLM Twin / RAG 闭环
  -> 数据管道与特征工程
  -> Advanced RAG 与评估
  -> Deployment / CI / LLMOps
  -> Portfolio 包装
```

## 2. 背景文件

请新对话开始时先阅读：

- [00_BACKGROUND_STRATEGY.md](./00_BACKGROUND_STRATEGY.md): 从 OpenClaw 后端地基切换到 LLM Twin 主线的宏观策略、阶段计划和 portfolio 目标。

## 3. 本目录已有材料

- [LLM-Engineers-Handbook.pdf](./LLM-Engineers-Handbook.pdf): 书籍 PDF。
- [LLM-Engineers-Handbook/](./LLM-Engineers-Handbook/): PacktPublishing/LLM-Engineers-Handbook 源代码库副本。
- [../reverse_engineer_openclaw](../reverse_engineer_openclaw): 前置 OpenClaw 拆解项目，提供后端地基训练上下文，包括 FastAPI、Pydantic、SQLAlchemy、Alembic、测试和结构化日志的收口计划。

## 4. 新对话启动目标

在新的 Codex 对话中，不要直接开始写代码。请先围绕以下问题做详细任务计划设计：

1. 如何拆解书籍章节与源码目录。
2. 哪些模块先逆向，哪些模块暂缓。
3. Mini LLM Twin 的最小重写边界是什么。
4. 每个 phase 的交付物、DoD 和面试叙事是什么。
5. 如何把它与已完成的 OpenClaw backend foundation 组合成 portfolio。

## 5. 推荐启动指令

```text
请先阅读 00_START_HERE.md 和 00_BACKGROUND_STRATEGY.md。然后基于本目录的 LLM-Engineers-Handbook.pdf 和 LLM-Engineers-Handbook 源码库，帮我设计 LLM Twin 逆向/重写/portfolio 的详细 phase 计划。先只讨论计划，不改文件。
```
