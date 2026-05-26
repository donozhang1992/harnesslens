<!--
Copied from ../reverse_engineer_openclaw/04_LLM_TWIN_STRATEGY.md.
The referenced OpenClaw reverse-engineering project is located at ../reverse_engineer_openclaw.
-->

# 04_LLM_TWIN_STRATEGY: LLM Twin 宏观实践计划

## 1. 战略定位

当前学习主线调整为：

```text
Backend-grounded AI Engineering
后端工程地基 -> LLM 系统拆解 -> RAG / LLMOps 实战 -> 求职作品集
```

这不是从 OpenClaw 放弃转向另一个项目，而是重新分工：

- `openclaw_python`: 用来收口后端工程地基，训练 API 边界、数据契约、持久化、迁移、测试和结构化日志。
- `LLM Twin`: 用来作为 AI Engineer / LLM Application Engineer 求职主项目，训练 DDD、数据管道、RAG、评估、部署和 LLMOps。

最终求职叙事不是“我学过两个开源项目”，而是：

```text
我能从成熟系统中抽象架构，
用 Python 重建核心能力，
并把 LLM 应用从 demo 推进到 production-ready。
```

## 2. 当前 OpenClaw 的新停止线

OpenClaw Python 不再作为完整四阶段主战场推进。当前阶段只收口到：

```text
Phase 1 + 基础可观测性
```

完成后即可切换到 LLM Twin 主线。

OpenClaw 当前应完成：

- FastAPI app skeleton。
- Pydantic Session / Message / User contract。
- SQLAlchemy async persistence。
- Alembic first migration。
- Session / Message REST API。
- repository / service / api 分层。
- schema、repository、HTTP boundary tests。
- structlog 基础结构化日志。
- 一份能解释请求链路和分层职责的架构说明。

OpenClaw 暂停项：

- LangGraph Agent 编排。
- LLM 调用与 SSE 流式输出。
- Kafka / Celery / Redis。
- RAG。
- MCP / plugin system。
- 完整认证授权。

这些内容不是删除，而是进入 backlog。以后如果有余力，尤其是找到工作之后，可以回头继续完成 OpenClaw Phase 2 到 Phase 4。

## 3. LLM Twin 主线目标

LLM Twin 的学习目标是获得更贴近 Melbourne AIE / AI Engineer / LLM Engineer 求职的工业级项目经验。

重点能力包括：

- DDD 分层：`domain / application / model / infrastructure`。
- Orchestrator：ZenML pipeline 如何组织数据、训练、评估和推理流程。
- Data pipeline：采集、清洗、存储、版本化、失败重跑。
- Feature engineering：chunking、metadata、embedding、vector indexing。
- Advanced RAG：retrieval、reranking、query rewriting、citation、evaluation。
- Model lifecycle：SFT / DPO / evaluation / inference 的系统位置。
- Deployment：FastAPI inference service、Docker、CI/CD、cloud target。
- Observability：结构化日志、prompt traces、latency、failure diagnosis。

## 4. Phase 计划

### Phase A: OpenClaw 后端地基收口

目标：把 `openclaw_python` 收束成一个小而完整的后端工程作品。

产出：

- Alembic migration workflow。
- 基础 structlog 配置。
- 测试继续保持通过。
- 更新 README / 架构说明，明确这是 AI Gateway foundation，而不是完整 OpenClaw port。

完成标准：

- 能不看代码画出 HTTP request 到 SQLite row 的完整链路。
- 能解释 schema 和 model 的区别。
- 能解释 migration 和 `Base.metadata.create_all` 的区别。
- 能解释 route / service / repository 各自职责。

### Phase B: LLM Twin 逆向与系统地图

目标：先理解系统，不急着重写。

阅读范围：

- LLM Engineers Handbook 的整体架构、数据工程、RAG、LLMOps 相关章节。
- GitHub 仓库结构。
- `llm_engineering/domain`
- `llm_engineering/application`
- `llm_engineering/model`
- `llm_engineering/infrastructure`
- `pipelines`
- `steps`
- `configs`
- `tools`

产出：

- 宏观架构图。
- data pipeline 图。
- RAG inference flow 图。
- 模块职责表。
- 一份“LLM Twin 如何体现 production LLMOps”的笔记。

完成标准：

- 能解释 DDD 四层职责。
- 能解释 ZenML pipeline 和普通 script 的区别。
- 能解释 raw documents、cleaned documents、embeddings、vector DB、RAG answer 的生命周期。

### Phase C: Mini LLM Twin 重写

目标：重写一个最小但闭环的 RAG 系统，而不是一口气复制整个 LLM Twin。

最小链路：

```text
data ingestion
  -> document cleaning
  -> chunking
  -> embedding
  -> vector storage
  -> retrieval
  -> prompt assembly
  -> FastAPI RAG endpoint
```

建议技术栈：

- FastAPI。
- Pydantic。
- Qdrant 或 Chroma。
- OpenAI embedding 或 local embedding model。
- LangChain / LlamaIndex 可选，但必须能解释不用框架时的核心流程。
- pytest。
- Docker Compose。

产出：

- 可运行的 mini RAG API。
- 支持导入文档。
- 支持 embedding / indexing。
- 支持 `POST /rag/query`。
- 有基础测试和本地运行说明。

完成标准：

- 能 demo 一条数据从导入到回答的完整链路。
- 能解释 chunk size、overlap、embedding model、top_k 的取舍。
- 能解释 RAG 和 fine-tuning 的边界。

### Phase D: 数据管道与特征工程深化

目标：把 mini RAG 从“能跑”升级成“像工程系统”。

范围：

- 多数据源 ingestion。
- document normalization。
- metadata schema。
- deterministic document IDs。
- incremental update。
- duplicate detection。
- chunk versioning。
- embedding cache。
- pipeline config。
- pipeline run logs。

产出：

- 可配置、可重复的数据管道。
- 文档处理报告。
- embedding / indexing 可重跑。
- failure 可定位。

完成标准：

- 能解释为什么数据质量比 prompt 更基础。
- 能处理重复文档、更新文档和失败重跑。
- 能解释 batch pipeline 和 online inference 的区别。

### Phase E: Advanced RAG 与评估

目标：从普通 RAG demo 进化到能讲 trade-off 的 RAG 系统。

范围：

- hybrid retrieval。
- reranking。
- query rewriting。
- metadata filtering。
- context compression。
- citation / source attribution。
- hallucination checks。
- RAG evaluation dataset。
- retrieval metrics，例如 recall@k、MRR。
- answer quality evaluation。

产出：

- advanced RAG pipeline。
- eval dataset。
- evaluation report。
- 对比实验记录。

完成标准：

- 能区分 retrieval failure 和 generation failure。
- 能用指标说明系统改进。
- 能解释 latency、cost、quality 的三角关系。

### Phase F: LLMOps / Deployment / CI

目标：把项目从本地 demo 推向 production-ready 形态。

范围：

- Dockerfile。
- Docker Compose。
- GitHub Actions CI。
- lint / format / tests。
- secrets management。
- environment config。
- deployment target。
- structured logs。
- request IDs。
- prompt / response traces。
- latency metrics。

产出：

- 可部署的 RAG API。
- CI pipeline。
- deployment README。
- production readiness checklist。

完成标准：

- 新环境能按 README 跑起来。
- push 后能自动跑测试。
- secret 不进 git。
- 出错时能通过 logs 追踪请求。

### Phase G: Portfolio 包装

目标：把学习工程转化为雇主能看懂的证据。

最终作品集：

- `OpenClaw Python Gateway Foundation`
- `Mini LLM Twin / Production RAG System`

每个项目都应具备：

- 清晰 README。
- 架构图。
- API examples。
- tests / CI badge。
- trade-off section。
- known limitations。
- future work。

面试叙事：

```text
OpenClaw 证明我有后端系统边界能力。
LLM Twin 证明我能构建 production-oriented LLM / RAG 系统。
两者合起来证明我是 backend-grounded AI engineer。
```

## 5. 推荐节奏

```text
Week 1:
  收口 OpenClaw Phase 1 + observability

Week 2:
  LLM Twin 逆向 + 系统地图

Week 3:
  Mini LLM Twin RAG 闭环

Week 4:
  数据管道 + feature engineering

Week 5:
  Advanced RAG + evaluation

Week 6:
  deployment + CI/CD + observability

Week 7:
  portfolio polish + interview rehearsal
```

## 6. 每日协作方式

进入 LLM Twin 后，每日启动时仍沿用 OpenClaw 中形成的学习纪律：

- 先理解，再编码。
- 先画数据流，再实现。
- 先明确边界，再写代码。
- 每日必须有最小交付物。
- DoD 不只看代码跑通，也看能否解释设计取舍。

推荐启动指令：

```text
今天进入 LLM Twin 逆向。请先带我分析 [模块/章节/目录]，目标是画出数据流和分层职责，不急着写代码。
```

推荐结案指令：

```text
进行每日结案。请检查我是否能解释今天的系统边界、数据生命周期、失败模式和下一步最小实现。
```
