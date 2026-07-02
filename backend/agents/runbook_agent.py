import json
from agents.compat import Agent, tool
from config import get_llm, RUNBOOK_TEMPERATURE
from mocks.mock_confluence import MockConfluenceClient

confluence_client = MockConfluenceClient()

@tool("Search Runbooks KB")
def search_runbooks_tool(query: str) -> str:
    """
    Searches the Confluence SRE Runbook knowledge base using semantic/keyword indexing.
    Returns matching runbook symptoms, remediation steps, and escalation pathways.
    """
    results = confluence_client.search_runbooks(query)
    return json.dumps(results)

def create_runbook_agent():
    llm = get_llm(temperature=RUNBOOK_TEMPERATURE)
    return Agent(
        role="Institutional Memory Specialist",
        goal="Search the institutional knowledge base and adapt standard runbooks to resolve the specific root cause identified",
        backstory="You are an operations runbook curator with encyclopedic knowledge of system recovery workflows. "
                  "You specialize in querying knowledge bases to locate recovery steps and adapting them for current incidents.",
        verbose=True,
        allow_delegation=False,
        tools=[search_runbooks_tool],
        llm=llm
    )
