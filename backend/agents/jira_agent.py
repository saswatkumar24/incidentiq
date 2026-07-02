import json
from agents.compat import Agent, tool
from config import get_llm, RUNBOOK_TEMPERATURE
from mocks.mock_jira import MockJiraClient

jira_client = MockJiraClient()

@tool("Create Jira Ticket")
def create_jira_ticket_tool(title: str, description: str, priority: str, labels_str: str) -> str:
    """
    Creates an incident ticket in Jira.
    Priority should be Critical, High, Medium, or Low.
    labels_str should be a comma-separated list of labels.
    """
    try:
        labels = [l.strip() for l in labels_str.split(",") if l.strip()]
    except Exception:
        labels = ["p1", "production"]
        
    result = jira_client.create_ticket(title, description, priority, labels)
    return json.dumps(result)

@tool("Update Jira Ticket")
def update_jira_ticket_tool(ticket_id: str, status: str = None, comment: str = None) -> str:
    """
    Updates the status or appends comments to an existing Jira ticket.
    """
    result = jira_client.update_ticket(ticket_id, status, comment)
    return json.dumps(result)

@tool("Link Jira Tickets")
def link_jira_tickets_tool(parent_id: str, related_ids_str: str) -> str:
    """
    Links deployment or secondary tickets to the parent incident ticket.
    related_ids_str should be a comma-separated list of ticket IDs.
    """
    try:
        related_ids = [r.strip() for r in related_ids_str.split(",") if r.strip()]
    except Exception:
        related_ids = []
        
    result = jira_client.link_tickets(parent_id, related_ids)
    return json.dumps(result)

def create_jira_agent():
    # Low temperature (e.g. 0.2) for precise ticketing logs
    llm = get_llm(temperature=0.2)
    return Agent(
        role="Automated Ticketing Specialist",
        goal="Create and maintain precise incident tracking tickets in Jira, documenting the timeline, impact, and remediation steps",
        backstory="You are an efficiency expert who ensures that engineering tasks and incident metrics are perfectly tracked. "
                  "You generate detailed tickets and link them properly.",
        verbose=True,
        allow_delegation=False,
        tools=[create_jira_ticket_tool, update_jira_ticket_tool, link_jira_tickets_tool],
        llm=llm
    )
