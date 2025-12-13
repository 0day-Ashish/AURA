import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain_classic.chains import RetrievalQA

load_dotenv()  

logger = logging.getLogger("uvicorn.error")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set in environment (.env)")

app = FastAPI(title="College FAQ RAG Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    embeddings = OpenAIEmbeddings()
except Exception as e:
    logger.exception("Failed to initialize OpenAIEmbeddings")
    raise

CHROMA_DIR = "chroma_db"
if not os.path.isdir(CHROMA_DIR):
    raise RuntimeError(f"{CHROMA_DIR} directory not found. Run ingest.py to create it.")

try:
    db = Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)
except Exception as e:
    logger.exception("Failed to load Chroma DB")
    raise

retriever = db.as_retriever(search_kwargs={"k": 3})

llm = ChatOpenAI(temperature=0.1, model="gpt-4o-mini")

qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, chain_type="stuff")


class Query(BaseModel):
    question: str


@app.post("/api/chat")
async def chat(req: Query):
    q = (req.question or "").strip()
    if not q:
        raise HTTPException(status_code=400, detail="Question is empty")

    
    try:
        
        result = qa_chain.invoke({"query": q})
        answer = result.get("result", "")
    except Exception as e:
        logger.exception("RAG chain failed")
        raise HTTPException(status_code=500, detail=f"RAG error: {e}")
    return {"answer": answer}
