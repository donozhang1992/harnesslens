# OpenClaw 宏观架构与数据流向图

本文件详细描述了 OpenClaw 的系统架构以及消息在各组件间的流转逻辑。

## 1. 宏观架构图 (Macro Architecture)

OpenClaw 采用 **微内核 (Microkernel)** 架构。核心（Core）负责流程编排和生命周期管理，而具体的功能（通道、模型、工具、存储）全部通过插件（Extensions）实现。

```mermaid
graph TD
    subgraph "External Clients (Apps)"
        CLI[CLI / TUI]
        WebUI[Web Dashboard]
        Mobile[Android / iOS App]
    end

    subgraph "Control Plane (Gateway)"
        GW_Server[Gateway Server]
        GW_API[HTTP / WebSocket API]
    end

    subgraph "Microkernel (Core)"
        Loader[Plugin Loader]
        Registry[Plugin Registry]
        TurnKernel[Turn Kernel]
        Dispatcher[Message Dispatcher]
        AgentRunner[Agent Runner]
        Hooks[Internal Hook System]
    end

    subgraph "Extensions (Plugins)"
        Channels[Channel Extensions<br/>Discord, WhatsApp, Telegram]
        Providers[Model Providers<br/>Anthropic, OpenAI, Local LLM]
        Tools[Tool Extensions<br/>Browser, Shell, Google Search]
        Memory[Memory Extensions<br/>LanceDB, Wiki, Vector Store]
    end

    %% Relationships
    CLI & WebUI & Mobile --> GW_API
    GW_API --> TurnKernel
    Loader --> Registry
    Registry -.-> Channels & Providers & Tools & Memory
    TurnKernel --> Dispatcher
    Dispatcher --> AgentRunner
    AgentRunner --> Hooks
    Hooks -.-> Providers & Tools & Memory
```

### 组件说明：
- **Apps**: 用户交互入口。
- **Gateway Server**: 系统的门面，处理 API 请求并将其转发给内核。
- **Turn Kernel**: “回合内核”，管理每一次对话“回合”的生命周期（开始、记录、结束）。
- **Plugin Registry**: 系统的账本，记录所有已加载插件的能力。
- **Agent Runner**: 负责召集大模型、装载上下文、调用工具的逻辑执行引擎。
- **Internal Hook System**: 允许插件介入对话流程的各个阶段（如：在发送给模型前修改 Prompt）。

---

## 2. 数据流向图 (Data Flow)

这张图展示了一个典型的“接收消息 -> 思考 -> 发出回复”的全链路流程。

```mermaid
sequenceDiagram
    participant User as 外部用户 (Discord/WhatsApp)
    participant Ext_Channel as Channel Extension
    participant Kernel as Turn Kernel (Core)
    participant Dispatcher as Dispatcher (Core)
    participant Runner as Agent Runner (Core)
    participant Ext_Mem as Memory Extension
    participant Ext_LLM as Model Provider
    participant Hooks as Hook System

    Note over User, Ext_Channel: 【输入阶段 (Inbound)】
    User->>Ext_Channel: 发送消息
    Ext_Channel->>Kernel: 触发 Inbound Turn (标准化消息对象)
    Kernel->>Kernel: 创建并记录 Session 状态

    Note over Kernel, Runner: 【处理阶段 (Processing)】
    Kernel->>Dispatcher: 分发消息
    Dispatcher->>Runner: 启动 Agent 任务

    Note over Runner, Hooks: 【思考阶段 (Reasoning)】
    Runner->>Ext_Mem: 查询长期记忆与上下文
    Ext_Mem-->>Runner: 返回历史记录
    Runner->>Hooks: 触发 'pre-inference' Hooks
    Hooks-->>Runner: (可选) 修改或增强 Prompt
    Runner->>Ext_LLM: 调用模型接口 (流式/阻塞)
    Ext_LLM-->>Runner: 返回生成的文本/工具调用

    Note over Runner, User: 【输出阶段 (Outbound)】
    Runner->>Dispatcher: 包装 Reply Payload
    Dispatcher->>Ext_Channel: 调用 Deliver Adapter
    Ext_Channel->>User: 发回回复消息
```

### 关键数据流转点：
1.  **标准化 (Normalization)**: `Channel Extension` 将各个平台私有的 API 格式转换为 OpenClaw 统一的 `TurnContext`。
2.  **上下文装配 (Context Assembly)**: `Agent Runner` 会动态从 `Memory` 插件中提取关联信息，并合并当前消息。
3.  **插件干预 (Hooking)**: 在请求模型前后，`Hook System` 允许其他插件（如：内容审查、自动翻译）无缝介入。
4.  **适配输出 (Delivery)**: 最终回复由 `Channel Extension` 再次转换回平台特定的 API 调用（如：`bot.sendMessage`）。
