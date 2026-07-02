import os

class MockConfluenceClient:
    def __init__(self):
        # Local space for uploaded post-mortems and pages
        self.pages = {}
        
    def search_runbooks(self, query: str) -> list:
        """
        Performs semantic search for runbooks in ChromaDB.
        Falls back to a keyword search if ChromaDB is not populated or offline.
        """
        print(f"[MockConfluenceClient] Searching knowledge base for: '{query}'")
        try:
            from rag.knowledge_base import query_kb
            results = query_kb(query, n_results=2)
            if results and len(results) > 0:
                print(f"[MockConfluenceClient] ChromaDB returned {len(results)} search results.")
                return results
        except Exception as e:
            print(f"[MockConfluenceClient] ChromaDB query failed: {e}. Falling back to keyword match.")
        
        # Fallback keyword match
        fallback_results = []
        runbooks_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "rag", "runbooks")
        
        if os.path.exists(runbooks_dir):
            for file_name in os.listdir(runbooks_dir):
                if file_name.endswith(".md"):
                    path = os.path.join(runbooks_dir, file_name)
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    # Compute a simple intersection score
                    query_words = set(query.lower().split())
                    content_lower = content.lower()
                    score = sum(1 for word in query_words if word in content_lower)
                    
                    if score > 0:
                        fallback_results.append({
                            "title": file_name.replace(".md", "").replace("_", " ").title(),
                            "content": content,
                            "relevance_score": min(0.95, 0.5 + (score * 0.1)),
                            "file_name": file_name
                        })
            
            # Sort by relevance score
            fallback_results.sort(key=lambda x: x["relevance_score"], reverse=True)
            
        print(f"[MockConfluenceClient] Fallback search returned {len(fallback_results)} results.")
        return fallback_results

    def get_page(self, page_id: str) -> dict:
        if page_id in self.pages:
            return self.pages[page_id]
        print(f"[MockConfluenceClient] Page {page_id} not found.")
        return None

    def create_page(self, title: str, content: str, space: str = "SRE") -> dict:
        import uuid
        page_id = str(uuid.uuid4())[:8]
        
        page = {
            "page_id": page_id,
            "title": title,
            "content": content,
            "space": space,
            "url": f"https://confluence.internal.mock/display/{space}/{title.replace(' ', '+')}"
        }
        self.pages[page_id] = page
        print(f"[MockConfluenceClient] Confluence page created in space '{space}': {title}")
        return page
