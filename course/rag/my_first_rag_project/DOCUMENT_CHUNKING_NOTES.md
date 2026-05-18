# 学习笔记：文档切分器 (Document Splitters) 进阶指南

在 RAG 流程中，将长文档切分成大小合适的“块 (Chunks)”是至关重要的一步。切分得太小会导致上下文丢失，切分得太大会超出 LLM 的上下文窗口或引入过多噪声。LangChain 提供了多种切分器以应对不同的数据格式和切分策略。

本笔记基于 `RAG_n.ipynb` 中 Cell 23-31 的内容进行总结。

---

## 1. 基础文本切分

### 1.1 TokenTextSplitter (Cell 23)
*   **作用：** 基于 Token 数量进行切分。这是最“硬核”的切分方式，严格控制输入给 LLM 的长度。
*   **核心参数：**
    *   `chunk_size`: 每个块包含的最大 Token 数量（如 100）。
    *   `chunk_overlap`: 相邻块之间重叠的 Token 数量（如 10），用于保持上下文连贯性，防止一句话被生硬截断。
    *   `encoding_name`: 使用的 Tokenizer 模型（如 OpenAI 的 `o200k_base`）。
*   **适用场景：** 对输入长度限制非常严格的场景，或者处理没有明显标点符号的纯代码/生语料。

### 1.2 CharacterTextSplitter (Cell 24)
*   **作用：** 基于指定的字符（默认为 `\n\n`）进行切分。
*   **高级用法（正则切分）：**
    通过开启正则模式，可以实现更智能的按句切分。例如：
    ```python
    text_splitter = CharacterTextSplitter(
        separator = r"(?<=[.])\s+|(?<=[。！？?!])|\n\n",  # 匹配句号、问号、叹号后的空格或换行
        is_separator_regex=True,
        chunk_size= 350,
        chunk_overlap = 0,
    )
    ```
*   **适用场景：** 规则明确、结构简单的文本，需要按特定的标点或段落边界切分。

---

## 2. 进阶文本切分 (最常用)

### 2.1 RecursiveCharacterTextSplitter (Cell 26-27)
*   **作用：** **目前最推荐的通用文本切分器。** 顾名思义，它会“递归”地尝试用不同的分隔符进行切分，直到块的大小满足要求。
*   **默认切分顺序：** `["\n\n", "\n", " ", ""]`。它会优先尝试用双换行（段落）切分，如果某一段还是太大，就用单换行（句子）切分，再不行就用空格（词），最后没办法了才把单词从中间切断。
*   **高级控制：** 可以传入自定义的 `length_function`（例如使用 `tiktoken` 计算 token 数，而不是简单的 `len()` 计算字符数），以达到最精准的长度控制。
    ```python
    text_splitter = RecursiveCharacterTextSplitter(
        is_separator_regex=True,
        separators=[r'\n\n', r'(?<=[.?!])\s+', r'[。！？]'], # 自定义递归层级
        chunk_size= 350,
        chunk_overlap = 10,
        length_function=lambda text: len(tokenizer.encode(text)) # 精确到 Token 级别
    )
    ```
*   **适用场景：** 绝大多数自然语言长文本（文章、报告、新闻等）。它能在保持段落和句子完整性的同时，兼顾块的长度。

---

## 3. 高级与结构化切分

### 3.1 SemanticChunker (Cell 29)
*   **作用：** 基于“语义”而非简单的字符或标点进行切分。
*   **原理：** 它会先将文本按句子切分，然后计算相邻句子之间的嵌入向量 (Embedding) 相似度。如果两个句子的相似度低于某个阈值，就认为发生了“话题转换”，从而在这里进行切断。
*   **优点：** 能够将讨论同一主题的内容尽可能保留在一个 Chunk 中，切分出的块具有极高的逻辑完整性。
*   **适用场景：** 思想跳跃性强、段落划分不明显、对检索准确度要求极高的长篇论述文本。需要引入 `langchain-experimental`。

### 3.2 MarkdownHeaderTextSplitter (Cell 30)
*   **作用：** 专门用于处理 Markdown 格式的文档。
*   **原理：** 根据 Markdown 的标题层级（如 `#`, `##`, `###`）进行切分，并且会将上一级的标题作为当前内容的 Metadata 自动保留下来。
*   **优点：** 完美保留了文档的层级结构。当你检索到一个小节时，大模型不仅能看到小节内容，还能通过 Metadata 知道它属于哪个大章节。
*   **适用场景：** 技术文档、README 文件、任何结构良好的 Markdown 笔记。

### 3.3 RecursiveJsonSplitter (Cell 31)
*   **作用：** 专门用于处理复杂的、层级较深的 JSON 数据。
*   **原理：** 尝试保留 JSON 对象的层级关系，但当某个节点内容过大时，会递归地向内切分。
*   **适用场景：** API 返回值、日志文件、配置表等结构化 JSON 数据。

---

## 4. 总结与建议

在构建实际项目时，切分器的选择直接决定了检索（Retrieval）环节的上限：

1.  **首选方案：** 遇到普通文本，直接上 `RecursiveCharacterTextSplitter`，并配置好合理的 `chunk_size` 和 `chunk_overlap`。
2.  **结构优先：** 如果你的数据有明显的结构（如 Markdown 标题、JSON 层级），**必须**使用对应的专用切分器（如 `MarkdownHeaderTextSplitter`），将结构信息转化为 Metadata。这比单纯按长度切断效果好一万倍。
3.  **终极优化：** 当基础切分法导致回答上下文断裂严重时，尝试引入 `SemanticChunker`。
