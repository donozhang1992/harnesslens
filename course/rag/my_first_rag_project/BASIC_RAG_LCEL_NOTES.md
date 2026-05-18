# 学习笔记：基础 RAG 链 (LCEL) 设计与实现

## 1. RAG Pipeline 总体设计
一个标准的 RAG (Retrieval-Augmented Generation) Pipeline 遵循“检索 -> 增强 -> 生成”的逻辑流转。在 LangChain 中，通过 **LCEL (LangChain Expression Language)** 可以将这些离散的步骤编织成一个清晰的链条。

**数据流转路径：**
`用户问题 (Query)` -> `检索器 (Retriever)` -> `格式化上下文 (Context)` -> `提示词模板 (Prompt)` -> `大模型 (LLM)` -> `最终答案 (Output)`

---

## 2. 代码核心分层
在 Cell 44-46 的实战中，代码主要分为以下四个关键部分：

### A. 检索层 (Retriever)
负责从向量数据库中寻找最相关的文档片段。
*   **组件：** `VectorStoreRetriever`
*   **逻辑：** 数据库（如 FAISS/Chroma）通过 `.as_retriever()` 方法转换而来。支持设置 `k`（检索数量）和 `score_threshold`（分数阈值）。

### B. 上下文处理层 (Processing)
负责将检索到的原始 `Document` 对象转换成大模型能理解的纯文本字符串。
*   **自定义函数：** `docs_to_context`
*   **逻辑：** 遍历 `docs` 列表，将 `page_content` 和必要的 `metadata`（如答案字段）拼接成一段长文本。

### C. 提示词工程 (Prompt)
定义助手的角色、约束条件以及如何利用上下文。
*   **组件：** `PromptTemplate`
*   **逻辑：** 预留 `{context}` 和 `{question}` 占位符，强制模型“仅根据上下文回答”或在找不到答案时回答“不知道”。

### D. 链式组装 (LCEL Chain)
使用 `|` 符号将所有部件串联，这是最核心的“必敲代码”：
```python
rag_chain = (
    {
        "question": RunnablePassthrough(),      # 原样传递用户问题
        "context": retriever | docs_to_context  # 先检索，再格式化
    } 
    | prompt                                    # 填充模板
    | llm                                       # 提交给大模型
)
```

---

## 3. 核心工具库
这部分代码主要涉及以下库和模块：

| 类别 | 库名 / 模块名 | 用途 |
| :--- | :--- | :--- |
| **框架核心** | `langchain_core` | 包含 LCEL 基础（`RunnablePassthrough`）、提示词（`PromptTemplate`） |
| **模型接口** | `langchain_openai` | 提供 `ChatOpenAI` 接口（在本例中通过修改 `base_url` 适配了 DeepSeek） |
| **向量存储** | `langchain_community` | 包含 `FAISS` 向量数据库实现 |
| **运行环境** | `python-dotenv` | 加载环境变量（API Keys） |

---

## 4. 关键概念点 (LCEL 优势)
1.  **并行执行：** 在字典 `{"question": ..., "context": ...}` 中，LangChain 会自动并行处理这两个分支，提升效率。
2.  **流式支持：** 构建好的 `rag_chain` 天生支持 `.stream()` 方法，无需重写逻辑即可实现逐字输出。
3.  **可视化：** 可以通过 `rag_chain.get_graph().print_ascii()` 直观地看到数据的流向图。

---

## 5. 小结
基础 RAG 链的本质是**数据转换器**：它把一个简单的字符串（问题），转换成了一个包含丰富背景知识的复杂对象，最后再由 LLM 浓缩回字符串答案。掌握了 LCEL 的 `|` 操作符，就掌握了构建复杂 AI 应用的乐高积木。
