import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import Incident
from mocks.mock_alerts import SCENARIOS
from agents.orchestrator import IncidentOrchestrator
from .websocket_manager import manager

router = APIRouter(prefix="/api", tags=["demo"])

class TriggerPayload(BaseModel):
    scenario: str

SCENARIO_LIST = [
    {
        "id": "payment_gateway_p1",
        "name": "Payment Gateway Outage",
        "severity": "P1",
        "description": "Database connection pool misconfiguration causing a cascading response latency spike and traffic backlog."
    },
    {
        "id": "kafka_consumer_lag_p2",
        "name": "Kafka Consumer Lag Spike",
        "severity": "P2",
        "description": "Order processing consumer stalling on coupon serialization due to an unhandled NullPointerException."
    },
    {
        "id": "api_timeout_p2",
        "name": "API Gateway Timeout Storm",
        "severity": "P2",
        "description": "Upstream rate-limit throttling configuration mismatch causing cascading 504 gateway timeout responses."
    }
]

# Background SRE orchestration task runner
async def run_orchestrator_task(incident_id: str, scenario_name: str, alert_payload: dict):
    # Callback function to broadcast events to WS
    async def ws_callback(event: dict):
        await manager.broadcast(incident_id, event)
        
    orchestrator = IncidentOrchestrator(
        incident_id=incident_id,
        scenario_name=scenario_name,
        alert_payload=alert_payload,
        ws_callback=ws_callback
    )
    try:
        await orchestrator.run()
    except Exception as e:
        print(f"[DemoTask] Orchestrator execution crashed: {e}")

@router.post("/incident/trigger")
def trigger_incident(payload: TriggerPayload, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    scenario_id = payload.scenario
    if scenario_id not in SCENARIOS:
        raise HTTPException(status_code=400, detail=f"Invalid scenario. Available: {list(SCENARIOS.keys())}")
        
    alert = SCENARIOS[scenario_id]
    
    # Create new Incident record
    inc_id = str(uuid.uuid4())
    new_inc = Incident(
        id=inc_id,
        alert_id=alert["alert_id"],
        scenario_name=scenario_id,
        severity=alert.get("severity_hint", "P2").upper().replace("CRITICAL", "P1").replace("WARNING", "P2"),
        service_name=alert["service"],
        triggered_at=datetime.utcnow(),
        status="processing"
    )
    
    db.add(new_inc)
    db.commit()
    
    # Launch CrewAI orchestration in the background
    background_tasks.add_task(run_orchestrator_task, inc_id, scenario_id, alert)
    
    return {
        "incident_id": inc_id,
        "status": "processing"
    }

@router.get("/demo/scenarios")
def get_demo_scenarios():
    return SCENARIO_LIST

@router.post("/demo/reset")
def reset_demo(db: Session = Depends(get_db)):
    """
    Clears all incident history and logs, then re-seeds the default historical records.
    """
    try:
        from database.seed_data import seed_db
        from database.models import MockJiraTicket, MockSlackMessage
        db.query(MockJiraTicket).delete()
        db.query(MockSlackMessage).delete()
        db.query(Incident).delete()
        db.commit()
        # Seed again
        seed_db()
        return {"status": "success", "message": "Demo state successfully reset to seed defaults."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to reset demo database: {str(e)}")
