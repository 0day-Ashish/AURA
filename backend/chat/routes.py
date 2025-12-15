from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session, select
from database import engine
from models import ChatMessage
from auth.deps import get_current_user, get_current_user_optional

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
load_dotenv()

embeddings = OpenAIEmbeddings()

db = Chroma(
    persist_directory="chroma_db",
    embedding_function=embeddings
)

retriever = db.as_retriever(search_kwargs={"k": 3})

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.2
)

prompt = ChatPromptTemplate.from_template("""
You are a helpful college assistant.
If the user greets you or says something pleasant (like "thanks", "hello", "goodbye"), respond politely and naturally.
For factual questions, answer ONLY using the provided context.
If the answer to a factual question is not present in the context, reply with "I don't know".

Context:
{context}

Question:
{question}
""")


router = APIRouter(prefix="/api/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    question: str


@router.post("")
def chat(
    req: ChatRequest,
    user_id: int | None = Depends(get_current_user_optional)
):
    docs = retriever.invoke(req.question)
    context = "\n\n".join([d.page_content for d in docs])

    response = llm.invoke(
        prompt.format(context=context, question=req.question)
    )
    answer = response.content

    if user_id:
        with Session(engine) as session:
            session.add(ChatMessage(
                user_id=user_id,
                role="user",
                message=req.question
            ))
            session.add(ChatMessage(
                user_id=user_id,
                role="assistant",
                message=answer
            ))
            session.commit()

    return {"answer": answer}


@router.get("/history")
def get_chat_history(
    user_id: int = Depends(get_current_user)
):
    with Session(engine) as session:
        messages = session.exec(
            select(ChatMessage)
            .where(ChatMessage.user_id == user_id)
            .order_by(ChatMessage.created_at)
        ).all()

    return messages
