# app.py
import os
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# LangChain (monolithic) + langchain_chroma
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA

load_dotenv()  # loads OPENAI_API_KEY from .env if present

logger = logging.getLogger("uvicorn.error")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set in environment (.env)")

app = FastAPI(title="College FAQ RAG Backend")

# Initialize embeddings
try:
    embeddings = OpenAIEmbeddings()
except Exception as e:
    logger.exception("Failed to initialize OpenAIEmbeddings")
    raise

# Load Chroma vector DB (created by ingest.py)
CHROMA_DIR = "chroma_db"
if not os.path.isdir(CHROMA_DIR):
    raise RuntimeError(f"{CHROMA_DIR} directory not found. Run ingest.py to create it.")

try:
    db = Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)
except Exception as e:
    logger.exception("Failed to load Chroma DB")
    raise

# Build retriever
retriever = db.as_retriever(search_kwargs={"k": 3})

# Initialize LLM (LangChain wrapper around OpenAI)
# Change the model if you don't have access to gpt-4o-mini.
llm = ChatOpenAI(temperature=0.1, model="gpt-4o-mini")

# Build RetrievalQA chain
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, chain_type="stuff")


class Query(BaseModel):
    question: str


@app.post("/api/chat")
async def chat(req: Query):
    q = (req.question or "").strip()
    if not q:
        raise HTTPException(status_code=400, detail="Question is empty")

    # Run the retrieval + generation chain
    try:
        # If the chain has run method use it. Otherwise use qa_chain.run
        if hasattr(qa_chain, "run"):
            answer = qa_chain.run(q)
        else:
            # fallback: call run anyway (keeps compatibility)
            answer = qa_chain.run(q)
    except Exception as e:
        logger.exception("RAG chain failed")
        # Try to surface a helpful error without leaking secrets
        raise HTTPException(status_code=500, detail=f"RAG error: {e}")

    # Return the answer. If desired, you can also return sources by running retriever separately.
    return {"answer": answer}
