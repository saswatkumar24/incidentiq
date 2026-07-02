from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.db import get_db
from database.models import AgentExecution

router = APIRouter(prefix="/api/agents", tags=["agents"])

@router.get("/status")
def get_agents_status(db: Session = Depends(get_db)):
    """
    Returns performance metrics for each agent, such as average duration and average confidence.
    """
    stats = db.query(
        AgentExecution.agent_name,
        func.count(AgentExecution.id).label("total_runs"),
        func.avg(AgentExecution.duration_seconds).label("avg_duration"),
        func.avg(AgentExecution.confidence_score).label("avg_confidence")
    ).group_by(AgentExecution.agent_name).all()
    
    agent_info = {
        "triage_agent": {"name": "Triage Agent", "icon": "🚨", "description": "Classification & severity routing"},
        "rca_agent": {"name": "RCA Agent", "icon": "🔍", "description": "Root cause isolation & telemetry analysis"},
        "runbook_agent": {"name": "Runbook Agent", "icon": "📖", "description": "Knowledge base retrieval & RAG adaptation"},
        "comms_agent": {"name": "Comms Agent", "icon": "📢", "description": "Slack war rooms & notifications dispatcher"},
        "jira_agent": {"name": "Jira Agent", "icon": "🎫", "description": "Ticket manager & deployment linker"},
        "postmortem_agent": {"name": "Post-Mortem Agent", "icon": "📝", "description": "Blameless report autowriter"}
    }
    
    result = []
    # Map gathered DB stats
    db_stats = {s.agent_name: s for s in stats}
    
    for agent_id, meta in agent_info.items():
        agent_stat = db_stats.get(agent_id)
        result.append({
            "agent_id": agent_id,
            "name": meta["name"],
            "icon": meta["icon"],
            "description": meta["description"],
            "total_invocations": agent_stat.total_runs if agent_stat else 0,
            "avg_duration_seconds": round(float(agent_stat.avg_duration), 1) if agent_stat and agent_stat.avg_duration else 0.0,
            "avg_confidence_score": round(float(agent_stat.avg_confidence), 2) if agent_stat and agent_stat.avg_confidence else 0.0,
            "status": "idle"
        })
        
    return result
