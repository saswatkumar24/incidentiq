import os
from dotenv import load_dotenv

try:
    from rag.knowledge_base import add_runbook_to_kb
except ImportError:
    from knowledge_base import add_runbook_to_kb


load_dotenv()

def ingest_all_runbooks():
    runbooks_dir = os.path.join(os.path.dirname(__file__), "runbooks")
    
    if not os.path.exists(runbooks_dir):
        print(f"Error: Runbooks directory not found at {runbooks_dir}")
        return
        
    print(f"Scanning runbooks directory: {runbooks_dir}")
    files = os.listdir(runbooks_dir)
    markdown_files = [f for f in files if f.endswith(".md")]
    
    if not markdown_files:
        print("No runbook markdown files found to ingest.")
        return
        
    print(f"Found {len(markdown_files)} runbooks. Commencing ingestion...")
    
    for file_name in markdown_files:
        file_path = os.path.join(runbooks_dir, file_name)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                
            # Attempt to parse title from the first heading line
            title = file_name.replace(".md", "").replace("_", " ").title()
            for line in content.split("\n"):
                if line.startswith("# "):
                    title = line.replace("# ", "").strip()
                    break
                    
            print(f"Ingesting: {file_name} -> '{title}'")
            add_runbook_to_kb(title=title, content=content, file_name=file_name)
        except Exception as e:
            print(f"Failed to ingest {file_name}: {e}")
            
    print("All runbooks successfully ingested into local vector storage!")

if __name__ == "__main__":
    ingest_all_runbooks()
