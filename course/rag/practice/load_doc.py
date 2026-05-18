from langchain_community.document_loaders import JSONLoader


file_path = "data/common.jsonl"
loader = JSONLoader(
    file_path = file_path,
    json_lines=True,
    jq_schema=".",
    text_content=False,
    is_content_key_jq_parsable=True,
    content_key=".question",
    metadata_func=lambda data, meta: {
        **meta,
        "topic": data["topic"],
        "answer": data["answer"],
    },

)

documents = loader.load()