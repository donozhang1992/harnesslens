from langchain_text_splitters import RecursiveJsonSplitter
import tiktoken
import json

encoding = tiktoken.get_encoding("o200k_base")

json_data = {
    "user": {
        "id": 123,
        "name": "Alice",
        "profile": {
            "bio": "Alice is a data scientist who loves working with large language models.",
            "location": "Stockholm",
            "interests": ["AI", "ML", "NLP", "Data Engineering"],
        },
    },
    "posts": [
        {
            "id": 1,
            "title": "Getting started with LangChain",
            "content": "LangChain makes it easier to build LLM-powered applications...",
        },
        {
            "id": 2,
            "title": "Recursive JSON splitting",
            "content": "RecursiveJsonSplitter can break nested JSON into manageable chunks.",
        },
    ],
}

def test_split(size):
    print(f"\n--- Testing max_chunk_size = {size} ---")
    splitter = RecursiveJsonSplitter(max_chunk_size=size)
    json_chunks = splitter.split_json(json_data)
    for i, chunk in enumerate(json_chunks):
        token_count = len(encoding.encode(json.dumps(chunk)))
        print(f"Chunk {i+1} ({token_count} tokens): {chunk}")

test_split(40)
test_split(30)
test_split(20)
