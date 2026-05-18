from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from load_doc import documents
from dotenv import load_dotenv
load_dotenv()
    
model_name = "Snowflake/snowflake-arctic-embed-l-v2.0"
# model_name = "sentence-transformers/all-MiniLM-L6-v2"
embedder = HuggingFaceEmbeddings(model_name=model_name)


def custom_relevance_score_fn(distance: float) -> float:
    return distance

vectore_db=FAISS.from_documents(
    documents=documents,
    embedding=embedder,
    distance_strategy="MAX_INNER_PRODUCT",
    relevance_score_fn=custom_relevance_score_fn,
)

def search_filter(metadata):
    return metadata["topic"]=="Human Resources"

retriever = vectore_db.as_retriever(
    # search_type: similarity/similarity_score_threshold/mmr 
    search_type = "similarity_score_threshold",
    search_kwargs = {
        "k": 5,
        "score_threshold": 0.6,
        "fetch_k": 20,
        # "filter": search_filter
    }
)


def docs_to_context(docs):
    context = "\n\n".join(f"{doc.page_content}\n{doc.metadata['answer']}" for doc in docs)
    print(docs)
    print('--------')
    print(context)
    print('--------')
    return {
        "docs": docs,
        "context": context
    }


from langchain_core.prompts import PromptTemplate

prompt_template = """\
You are a helpful company internal assistant.
Answer the question using ONLY the context below.
You can paraphrase and infer when wording is different but meaning is the same.
If the context truly does not provide enough information, say "I don't know".

Context:
{context}

Question:
{question}
"""

prompt = PromptTemplate(
    input_variables=["context", "question"],
    template=prompt_template
)

import os
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnablePassthrough

# DeepSeek is OpenAI-compatible — just point to a different base_url
llm = ChatOpenAI(
    model="gpt-4o-mini",
    openai_api_key=os.environ["OPENAI_API_KEY"],
    temperature=0,
)

query = "How many days of vacation can we get each year?"
documents = retriever.invoke(query)

rag_chain = (
    {
        "question": RunnablePassthrough(),
        "context": retriever | docs_to_context
    } | prompt | llm
)

query = "How many days of vacation can we get each year?"

resp = rag_chain.invoke(query)
print(resp.content)