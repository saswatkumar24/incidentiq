import uuid
from datetime import datetime, timedelta
from .db import engine, Base, SessionLocal
from .models import Incident, AgentExecution, MockJiraTicket, MockSlackMessage

def seed_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Check if already seeded
        if db.query(Incident).count() > 0:
            print("Database already contains records. Skipping seed.")
            return

        print("Seeding database with historical incidents...")

        # Time offsets
        now = datetime.utcnow()
        t_14_days = now - timedelta(days=14)
        t_5_days = now - timedelta(days=5)
        t_2_days = now - timedelta(days=2)

        # -------------------------------------------------------------
        # Incident 1: Payment Outage (P1) - 14 Days Ago
        # -------------------------------------------------------------
        inc1_id = str(uuid.uuid4())
        inc1 = Incident(
            id=inc1_id,
            alert_id="ALT-20240601-0112-PG",
            scenario_name="payment_gateway_p1",
            severity="P1",
            service_name="payment-gateway-service",
            triggered_at=t_14_days,
            resolved_at=t_14_days + timedelta(minutes=22),
            mttr_minutes=22,
            status="resolved",
            full_report={
                "triage": {
                    "severity": "P1",
                    "service": "payment-gateway-service",
                    "blast_radius": "~12,000 active sessions",
                    "business_impact": "Revenue-affecting, Customer-facing",
                    "sla_breach_in_minutes": 15,
                    "confidence": 0.98
                },
                "rca": {
                    "root_cause": "Misconfigured DB max connection limit in release v1.4.2",
                    "confidence": 0.94,
                    "evidence": ["DB pool exhaustion at 98% during traffic surge", "Spike in connection timeout logs"]
                },
                "runbook": {
                    "runbook_title": "Payment Gateway Recovery Runbook v2.3",
                    "adapted_steps": ["Rollback deployment to v1.4.1", "Restart connection pool", "Clear database locks"]
                },
                "comms": {
                    "war_room_created": "#inc-20240601-payment-p1",
                    "slack_message": "🚨 P1 INCIDENT — Payment Gateway failure resolved via DB config rollback."
                },
                "jira": {
                    "ticket_id": "INC-2024-0012",
                    "title": "[P1] Payment Gateway Outage - Connection pool exhaustion"
                },
                "postmortem": {
                    "summary": "Full payment outage due to connection limit misconfiguration. Restored via rollback."
                }
            }
        )

        jira1 = MockJiraTicket(
            ticket_id="INC-2024-0012",
            incident_id=inc1_id,
            title="[P1] Payment Gateway Outage - Connection pool exhaustion",
            description="Payment gateway service failed to acquire database connections after release v1.4.2.",
            priority="Critical",
            labels=["p1", "payment", "db-pool"],
            created_at=t_14_days,
            updated_at=t_14_days + timedelta(minutes=22)
        )

        slack1 = MockSlackMessage(
            incident_id=inc1_id,
            channel_name="#inc-20240601-payment-p1",
            message_text="🚨 P1 Incident Alert: payment-gateway-service error rate 92%. Triage: P1, Revenue impacting. War room channel created.",
            posted_at=t_14_days
        )

        db.add(inc1)
        db.add(jira1)
        db.add(slack1)

        # -------------------------------------------------------------
        # Incident 2: Kafka Consumer Lag (P2) - 5 Days Ago
        # -------------------------------------------------------------
        inc2_id = str(uuid.uuid4())
        inc2 = Incident(
            id=inc2_id,
            alert_id="ALT-20240610-1422-KF",
            scenario_name="kafka_consumer_lag_p2",
            severity="P2",
            service_name="kafka-order-consumer",
            triggered_at=t_5_days,
            resolved_at=t_5_days + timedelta(minutes=18),
            mttr_minutes=18,
            status="resolved",
            full_report={
                "triage": {
                    "severity": "P2",
                    "service": "kafka-order-consumer",
                    "blast_radius": "Delayed order processing for ~2,500 users",
                    "business_impact": "Degraded processing speed, no data loss",
                    "sla_breach_in_minutes": 45,
                    "confidence": 0.92
                },
                "rca": {
                    "root_cause": "Kafka consumer group lag spike due to serialization error on coupon code field.",
                    "confidence": 0.89,
                    "evidence": ["Consumer group lag exceeded 200,000 records", "Logs show repeated JSON parsing errors"]
                },
                "runbook": {
                    "runbook_title": "Kafka Consumer Lag Remediation v1.1",
                    "adapted_steps": ["Identify problematic coupon records", "Deploy hotfix code to ignore null coupons", "Restart consumers"]
                },
                "comms": {
                    "war_room_created": "#inc-20240610-kafka-p2",
                    "slack_message": "⚠️ P2 INCIDENT — Kafka Consumer Lag on order queue resolved via parsing hotfix."
                },
                "jira": {
                    "ticket_id": "INC-2024-0044",
                    "title": "[P2] Kafka Consumer Lag Spike - Coupon parsing error"
                },
                "postmortem": {
                    "summary": "Kafka consumers stalled due to unhandled null parsing exception in order coupon data."
                }
            }
        )

        jira2 = MockJiraTicket(
            ticket_id="INC-2024-0044",
            incident_id=inc2_id,
            title="[P2] Kafka Consumer Lag Spike - Coupon parsing error",
            description="Order processing consumer stalled due to NullPointerException on coupon serialization.",
            priority="High",
            labels=["p2", "kafka", "order-service"],
            created_at=t_5_days,
            updated_at=t_5_days + timedelta(minutes=18)
        )

        slack2 = MockSlackMessage(
            incident_id=inc2_id,
            channel_name="#inc-20240610-kafka-p2",
            message_text="⚠️ P2 Incident Alert: kafka-order-consumer lag exceeds 100k messages. SRE agents initiated.",
            posted_at=t_5_days
        )

        db.add(inc2)
        db.add(jira2)
        db.add(slack2)

        # -------------------------------------------------------------
        # Incident 3: API Gateway Timeout (P2) - 2 Days Ago
        # -------------------------------------------------------------
        inc3_id = str(uuid.uuid4())
        inc3 = Incident(
            id=inc3_id,
            alert_id="ALT-20240613-2210-API",
            scenario_name="api_timeout_p2",
            severity="P2",
            service_name="api-gateway",
            triggered_at=t_2_days,
            resolved_at=t_2_days + timedelta(minutes=15),
            mttr_minutes=15,
            status="resolved",
            full_report={
                "triage": {
                    "severity": "P2",
                    "service": "api-gateway",
                    "blast_radius": "Slow API response times for EU users",
                    "business_impact": "Sub-optimal user experience, partial load failures",
                    "sla_breach_in_minutes": 30,
                    "confidence": 0.95
                },
                "rca": {
                    "root_cause": "Rate limiter misconfiguration routing too much traffic to one backend container.",
                    "confidence": 0.90,
                    "evidence": ["Unbalanced CPU usage across gateway pods", "504 gateway timeout errors in EU gateway"]
                },
                "runbook": {
                    "runbook_title": "API Gateway Latency Troubleshooting v3.0",
                    "adapted_steps": ["Verify load balancer distribution algorithms", "Scale api-gateway deployment pods", "Flush Redis rate-limiting cache"]
                },
                "comms": {
                    "war_room_created": "#inc-20240613-api-p2",
                    "slack_message": "⚠️ P2 INCIDENT — API Gateway latency resolved via scaling gateway pods."
                },
                "jira": {
                    "ticket_id": "INC-2024-0062",
                    "title": "[P2] API Gateway Timeout - EU Route Latency"
                },
                "postmortem": {
                    "summary": "EU API Gateway experienced connection bottlenecks due to rate limiting load imbalance."
                }
            }
        )

        jira3 = MockJiraTicket(
            ticket_id="INC-2024-0062",
            incident_id=inc3_id,
            title="[P2] API Gateway Timeout - EU Route Latency",
            description="EU-WEST router experienced cascading 504 Gateway Timeouts under sudden traffic burst.",
            priority="High",
            labels=["p2", "api-gateway", "timeouts"],
            created_at=t_2_days,
            updated_at=t_2_days + timedelta(minutes=15)
        )

        slack3 = MockSlackMessage(
            incident_id=inc3_id,
            channel_name="#inc-20240613-api-p2",
            message_text="⚠️ P2 Incident Alert: api-gateway EU route P95 latency > 8000ms. SRE agents analyzing.",
            posted_at=t_2_days
        )

        db.add(inc3)
        db.add(jira3)
        db.add(slack3)

        db.commit()
        print("Database seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
