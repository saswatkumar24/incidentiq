import json
from agents.compat import Agent, tool
from config import get_llm, RCA_TEMPERATURE
from mocks.mock_newrelic import MockNewRelicClient
from mocks.mock_historical_data import get_historical_data_for_service

nr_client = MockNewRelicClient()

@tool("Query Mock Metrics")
def query_mock_metrics(service: str, time_window: str = "1h") -> str:
    """
    Queries New Relic metrics for a given service.
    Returns error rates, CPU, latency (p99), database pool utilization, and queue lag metrics.
    """
    metrics = nr_client.get_metrics(service, time_window)
    return json.dumps(metrics)

@tool("Query Mock Logs")
def query_mock_logs(service: str, time_window: str = "1h") -> str:
    """
    Queries service error logs and stack traces from the last hour.
    """
    logs = nr_client.get_logs(service, time_window)
    return json.dumps(logs)

@tool("Query Recent Deployments")
def query_recent_deployments(service: str, hours: int = 2) -> str:
    """
    Queries deployment pipeline history for a given service.
    Returns tickets, timestamps, developers, and configuration modifications.
    """
    deployments = nr_client.get_recent_deployments(service, int(hours))
    return json.dumps(deployments)

@tool("Query Historical Incidents")
def query_historical_incidents(service: str) -> str:
    """
    Queries the SRE historical incident database for previous outages, root causes,
    Jira comments, pre-incident SRE work logs, and Confluence links for a given service.
    """
    history = get_historical_data_for_service(service)
    return json.dumps(history)

def create_rca_agent():
    llm = get_llm(temperature=RCA_TEMPERATURE)
    return Agent(
        role="Principal Root Cause Analysis Engineer",
        goal="Identify the definitive root cause of production incidents by correlating metrics, logs, recent deployment activity, and historical incident patterns.",
        backstory="You are an expert in distributed systems debugging. You think like a detective, "
                  "connecting dots across metrics, logs, deployments, and past outage archives to find the true cause of an incident.",
        verbose=True,
        allow_delegation=False,
        tools=[query_mock_metrics, query_mock_logs, query_recent_deployments, query_historical_incidents],
        llm=llm
    )
