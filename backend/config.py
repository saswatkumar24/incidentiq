import os
import google.generativeai as genai
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# Load environment variables from backend/.env or root .env
load_dotenv()

# Map GOOGLE_API_KEY to GEMINI_API_KEY if needed
gemini_key = os.getenv("GEMINI_API_KEY")
google_key = os.getenv("GOOGLE_API_KEY")

if not gemini_key and google_key:
    os.environ["GEMINI_API_KEY"] = google_key
    gemini_key = google_key

# Configure the google-generativeai SDK
if gemini_key:
    genai.configure(api_key=gemini_key)

# Use this model for all agents
GEMINI_MODEL = "gemini-3.5-flash"

# Agent-specific temperature settings
TRIAGE_TEMPERATURE = 0.1      # Low — needs precision
RCA_TEMPERATURE = 0.2         # Low — analytical
RUNBOOK_TEMPERATURE = 0.3     # Medium — retrieval
COMMS_TEMPERATURE = 0.7       # Higher — natural language
POSTMORTEM_TEMPERATURE = 0.4  # Medium — structured

# CrewAI + Gemini integration
# LangChain model instance creator
def get_llm(temperature=0.3):
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise ValueError("GEMINI_API_KEY is not set in the environment.")
    return ChatGoogleGenerativeAI(
        model=GEMINI_MODEL,
        google_api_key=key,
        temperature=temperature
    )

# Default LLM
try:
    llm = get_llm(0.3)
except Exception:
    llm = None

