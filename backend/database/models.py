import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from .db import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    alert_id = Column(String(100), nullable=False)
    scenario_name = Column(String(100), nullable=False)
    severity = Column(String(10), nullable=False)  # P1, P2, P3
    service_name = Column(String(100), nullable=False)
    triggered_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    mttr_minutes = Column(Integer, nullable=True)
    status = Column(String(50), default="processing")  # processing, resolved, failed
    full_report = Column(JSON, nullable=True)

    # Relationships
    executions = relationship("AgentExecution", back_populates="incident", cascade="all, delete-orphan")
    jira_tickets = relationship("MockJiraTicket", back_populates="incident", cascade="all, delete-orphan")
    slack_messages = relationship("MockSlackMessage", back_populates="incident", cascade="all, delete-orphan")

class AgentExecution(Base):
    __tablename__ = "agent_executions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=False)
    agent_name = Column(String(100), nullable=False)
    started_at = Column(DateTime, nullable=False)
    completed_at = Column(DateTime, nullable=False)
    duration_seconds = Column(Integer, nullable=False)
    input_data = Column(JSON, nullable=True)
    output_data = Column(JSON, nullable=True)
    confidence_score = Column(Float, nullable=True)

    # Relationships
    incident = relationship("Incident", back_populates="executions")

class MockJiraTicket(Base):
    __tablename__ = "mock_jira_tickets"

    ticket_id = Column(String(50), primary_key=True)  # e.g., INC-2024-0892
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(50), nullable=False)  # e.g., Critical, High, Medium, Low
    labels = Column(JSON, nullable=True)  # List of tags
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    incident = relationship("Incident", back_populates="jira_tickets")

class MockSlackMessage(Base):
    __tablename__ = "mock_slack_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=False)
    channel_name = Column(String(100), nullable=False)
    message_text = Column(Text, nullable=False)
    posted_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    incident = relationship("Incident", back_populates="slack_messages")
