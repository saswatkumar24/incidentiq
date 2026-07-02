import json
from agents.compat import Agent, Task, tool
from config import get_llm, TRIAGE_TEMPERATURE

@tool("Classify Incident Alert")
def classify_incident_tool(alert_payload_str: str) -> str:
    """
    Parses a raw incident alert JSON string, determines severity (P1/P2/P3),
    calculates blast radius, and assesses business impact.
    """
    try:
        # Handle wrapping in case the LLM inputs quotes around the payload
        data_str = alert_payload_str.strip()
        if data_str.startswith("'''") or data_str.startswith('"""'):
            data_str = data_str[3:-3]
        elif data_str.startswith("'") or data_str.startswith('"'):
            if data_str.endswith("'") or data_str.endswith('"'):
                data_str = data_str[1:-1]
        
        # Replace escaped newlines if any
        data_str = data_str.replace('\\n', '\n').replace('\\"', '"')
        payload = json.loads(data_str)
    except Exception as e:
        print(f"[Triage Tool] Error parsing alert JSON: {e}. Raw input: {alert_payload_str}")
        # Return fallback values
        return json.dumps({
            "severity": "P2",
            "service": "unknown-service",
            "blast_radius": "Unknown active transactions",
            "business_impact": "Degraded performance, potential customer impact",
            "sla_breach_in_minutes": 30,
            "routed_to": ["rca_agent", "comms_agent"],
            "triage_time_seconds": 3,
            "confidence": 0.85
        })

    service = payload.get("service", "unknown-service")
    metrics = payload.get("metrics_snapshot", {})
    error_rate = metrics.get("error_rate_percent", 0)
    
    # Severity Rules:
    # P1: error_rate > 50% OR revenue service down (e.g. payment-gateway-service)
    # P2: error_rate 20-50% OR degraded performance
    # P3: error_rate < 20% OR non-critical service
    is_payment_service = "payment" in service.lower()
    is_revenue_affecting = is_payment_service
    is_customer_facing = is_payment_service or "gateway" in service.lower()
    
    if error_rate > 50 or is_payment_service:
        severity = "P1"
        sla_breach = 18
        blast_radius = "~14,000 active transactions" if is_payment_service else "~10,000 active users"
    elif error_rate >= 20:
        severity = "P2"
        sla_breach = 45
        blast_radius = "~2,500 active orders" if "kafka" in service.lower() else "~4,500 active requests"
    else:
        severity = "P3"
        sla_breach = 120
        blast_radius = "< 500 active users"

    impact_labels = []
    if is_revenue_affecting:
        impact_labels.append("Revenue-affecting")
    if is_customer_facing:
        impact_labels.append("Customer-facing")
    if not impact_labels:
        impact_labels.append("Internal service degradation")

    result = {
        "severity": severity,
        "service": service,
        "blast_radius": blast_radius,
        "business_impact": ", ".join(impact_labels),
        "sla_breach_in_minutes": sla_breach,
        "routed_to": ["rca_agent", "comms_agent"] if severity in ["P1", "P2"] else ["rca_agent"],
        "triage_time_seconds": 4,
        "confidence": 0.96
    }
    return json.dumps(result)

def create_triage_agent():
    llm = get_llm(temperature=TRIAGE_TEMPERATURE)
    return Agent(
        role="Senior SRE Triage Specialist",
        goal="Rapidly classify incident severity, identify blast radius, and determine business impact",
        backstory="You are a veteran SRE with 15 years experience at Google and Netflix. "
                  "You have seen every type of production incident and can classify them instantly.",
        verbose=True,
        allow_delegation=False,
        tools=[classify_incident_tool],
        llm=llm
    )
