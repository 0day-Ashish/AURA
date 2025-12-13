# ingest.py
import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

def ingest():
    print("Loading data...")

    loader = TextLoader("data/faqs.md", encoding="utf-8")
    docs = loader.load()

    print("Splitting into chunks...")
    splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=80)
    chunks = splitter.split_documents(docs)

    print("Generating embeddings...")
    embeddings = OpenAIEmbeddings()

    print("Saving to Chroma vector database...")
    db = Chroma.from_documents(
        chunks,
        embedding=embeddings,
        persist_directory="chroma_db"
    )
    db.persist()

    print("Ingestion complete. Chunks stored:", len(chunks))

if __name__ == "__main__":
    ingest()
