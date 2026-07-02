import json
from agents.compat import Agent, tool
from config import get_llm, COMMS_TEMPERATURE
from mocks.mock_slack import MockSlackClient

slack_client = MockSlackClient()

@tool("Create Slack War Room")
def create_slack_channel_tool(incident_id: str) -> str:
    """
    Creates a dedicated Slack incident channel (war room) for active collaboration.
    """
    result = slack_client.create_war_room(incident_id)
    return json.dumps(result)

@tool("Post Slack Message")
def post_slack_message_tool(channel: str, message: str) -> str:
    """
    Posts status updates, alerts, and instructions to a specified Slack channel.
    """
    result = slack_client.post_message(channel, message)
    return json.dumps(result)

@tool("Notify Stakeholders")
def notify_stakeholders_tool(severity: str, contacts_str: str) -> str:
    """
    Sends targeted email/pager notifications to a comma-separated list of contact groups
    based on the incident's severity.
    """
    try:
        contacts = [c.strip() for c in contacts_str.split(",") if c.strip()]
    except Exception:
        contacts = ["platform-team", "on-call-lead"]
        
    result = slack_client.notify_stakeholders(severity, contacts)
    return json.dumps(result)

def create_comms_agent():
    llm = get_llm(temperature=COMMS_TEMPERATURE)
    return Agent(
        role="SRE Communications Lead",
        goal="Draft clear, professional notifications and coordinate incident communications channels for stakeholders and engineers",
        backstory="You are a crisis communication manager who excels at keeping engineering teams and executives aligned during outages. "
                  "You draft concise status updates and create Slack war rooms.",
        verbose=True,
        allow_delegation=False,
        tools=[create_slack_channel_tool, post_slack_message_tool, notify_stakeholders_tool],
        llm=llm
    )
