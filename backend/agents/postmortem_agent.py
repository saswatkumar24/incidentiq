import json
from agents.compat import Agent, tool
from config import get_llm, POSTMORTEM_TEMPERATURE
from mocks.mock_confluence import MockConfluenceClient

confluence_client = MockConfluenceClient()

@tool("Publish PostMortem Page")
def create_confluence_postmortem(title: str, content: str) -> str:
    """
    Creates and publishes the blameless post-mortem document to Confluence.
    """
    result = confluence_client.create_page(title, content, "SRE")
    return json.dumps(result)

def create_postmortem_agent():
    llm = get_llm(temperature=POSTMORTEM_TEMPERATURE)
    return Agent(
        role="Post-Mortem Autowriter",
        goal="Consolidate the full timeline, diagnosis, and remediation actions into a standard, blameless post-mortem document",
        backstory="You are a technical writer and systems learning specialist. You extract structural insights from incident histories. "
                  "You write blameless post-mortems focusing on systems, not individuals, and recommend action items.",
        verbose=True,
        allow_delegation=False,
        tools=[create_confluence_postmortem],
        llm=llm
    )
