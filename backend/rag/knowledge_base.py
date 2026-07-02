import os
import hashlib
import chromadb
from chromadb.api.types import Documents, Embeddings, EmbeddingFunction
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Set up local ChromaDB persistent directory
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_db"))

def get_embedding(text: str) -> list:
    """
    Fetches the 768-dimensional text embedding from Gemini.
    Provides a deterministic hash-based mock fallback vector if the API key is invalid or requests fail.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        api_key = os.getenv("GOOGLE_API_KEY")
        
    if not api_key:
        return _generate_fallback_vector(text)
        
    try:
        # Configure genai just in case
        genai.configure(api_key=api_key)
        response = genai.embed_content(
            model="models/gemini-embedding-001",
            content=text,
            task_type="retrieval_document"
        )
        return response["embedding"]
    except Exception as e:
        print(f"[ChromaDB-Embeddings] API call failed: {e}. Utilizing deterministic fallback vector.")
        return _generate_fallback_vector(text)

def _generate_fallback_vector(text: str) -> list:
    """
    Generates a deterministic 768-dimensional float list using SHA-256 hash segments
    to serve as a fallback vector that keeps queries operational without API access.
    """
    vector = []
    # Generate multiple hashes to get 768 floats (each SHA-256 hash gives 32 bytes/floats)
    for i in range(24):
        seed = f"{text}-{i}"
        h = hashlib.sha256(seed.encode("utf-8")).digest()
        for byte in h:
            vector.append(float(byte) / 255.0)
    return vector[:768]

class GeminiEmbeddingFunction(EmbeddingFunction):
    def __call__(self, input: Documents) -> Embeddings:
        embeddings = []
        for text in input:
            embeddings.append(get_embedding(text))
        return embeddings

# Initialize persistent ChromaDB client
try:
    chroma_client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
    # Register the embedding function
    collection = chroma_client.get_or_create_collection(
        name="runbooks",
        embedding_function=GeminiEmbeddingFunction()
    )
    print(f"[ChromaDB] Initialized persistent storage in: {CHROMA_PERSIST_DIR}")
except Exception as e:
    print(f"[ChromaDB] Error initializing client: {e}. Fallback to in-memory mode.")
    chroma_client = chromadb.EphemeralClient()
    collection = chroma_client.get_or_create_collection(
        name="runbooks",
        embedding_function=GeminiEmbeddingFunction()
    )

def add_runbook_to_kb(title: str, content: str, file_name: str):
    """
    Upserts a runbook document to the database.
    """
    doc_id = file_name.replace(".md", "")
    collection.upsert(
        documents=[content],
        metadatas=[{"title": title, "file_name": file_name}],
        ids=[doc_id]
    )
    print(f"[ChromaDB] Document '{title}' added with ID: {doc_id}")

def query_kb(query: str, n_results: int = 2) -> list:
    """
    Queries ChromaDB and returns parsed results with normalized scores.
    """
    results = collection.query(
        query_texts=[query],
        n_results=n_results
    )
    
    formatted_results = []
    if results and "documents" in results and len(results["documents"]) > 0:
        docs = results["documents"][0]
        metadatas = results["metadatas"][0] if "metadatas" in results else [{}] * len(docs)
        distances = results["distances"][0] if "distances" in results else [0.5] * len(docs)
        
        for i in range(len(docs)):
            dist = distances[i]
            # Convert distance to a similarity score (0.0 to 1.0)
            score = max(0.0, min(1.0, 1.0 - (dist / 2.0)))
            
            formatted_results.append({
                "title": metadatas[i].get("title", "Unknown Runbook"),
                "content": docs[i],
                "relevance_score": float(score),
                "file_name": metadatas[i].get("file_name", "")
            })
            
    return formatted_results
