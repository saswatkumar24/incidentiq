from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import Incident

router = APIRouter(prefix="/api", tags=["incidents"])

@router.get("/incident/{incident_id}")
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    return {
        "id": incident.id,
        "alert_id": incident.alert_id,
        "scenario_name": incident.scenario_name,
        "severity": incident.severity,
        "service_name": incident.service_name,
        "triggered_at": incident.triggered_at.isoformat() if incident.triggered_at else None,
        "resolved_at": incident.resolved_at.isoformat() if incident.resolved_at else None,
        "mttr_minutes": incident.mttr_minutes,
        "status": incident.status,
        "full_report": incident.full_report
    }

@router.get("/incidents/history")
def get_incidents_history(db: Session = Depends(get_db)):
    # Get last 10 incidents ordered by trigger timestamp desc
    incidents = db.query(Incident).order_by(Incident.triggered_at.desc()).limit(10).all()
    
    result = []
    for inc in incidents:
        result.append({
            "id": inc.id,
            "alert_id": inc.alert_id,
            "scenario_name": inc.scenario_name,
            "severity": inc.severity,
            "service_name": inc.service_name,
            "triggered_at": inc.triggered_at.isoformat() if inc.triggered_at else None,
            "resolved_at": inc.resolved_at.isoformat() if inc.resolved_at else None,
            "mttr_minutes": inc.mttr_minutes,
            "status": inc.status,
            # Return brief preview instead of full report
            "summary_preview": inc.full_report.get("postmortem", {}).get("summary", "No summary available") if inc.full_report else "Outage Logged"
        })
    return result
