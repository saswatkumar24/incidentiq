# Fallback mock data for the 3 SRE scenarios to ensure zero crashes and robust offline capability.

FALLBACK_DATA = {
    "payment_gateway_p1": {
        "rca_agent": {
            "root_cause": "Deployment PROJ-4821 misconfigured the database connection pool by drastically reducing the maximum connections from 200 to 20. Under the service's high throughput of 14,230 RPM, this restricted pool size was immediately exhausted, causing database connection timeouts, thread pool starvation, and cascading transaction failures.",
            "confidence": 0.98,
            "evidence": [
                "Database connection pool usage is at 98%.",
                "Deployment PROJ-4821 was pushed at 02:31:00 UTC, reducing max-connections from 200 to 20.",
                "Transaction error rate spiked to 87% with P99 latency exceeding 30s."
            ],
            "contributing_factors": [
                "Lack of automated performance testing in the CI/CD pipeline for database configuration changes.",
                "High concurrent traffic volume (14.2k RPM) amplifying pool starvation."
            ]
        },
        "runbook_agent": {
            "runbook_found": True,
            "runbook_title": "Payment Gateway Recovery Runbook v2.3",
            "relevance_score": 0.95,
            "adapted_steps": [
                "1. Roll back deployment PROJ-4821 immediately to restore DB max-connections to 200.",
                "2. Monitor database connection pool usage and verify it drops below 50%.",
                "3. Inspect service P99 latency and verify it returns below 200ms.",
                "4. Check downstream Kafka consumer lag and scale out partition consumers if lag exceeds 500k."
            ],
            "estimated_resolution_minutes": 15,
            "escalation_needed": False
        },
        "comms_agent": {
            "war_room_created": "#inc-payment-gateway-p1-warroom",
            "stakeholders_notified": ["payment-engineering-team", "on-call-lead", "vp-engineering", "customer-support-leads", "database-administration-team"],
            "slack_message": "🚨 *P1 Incident Update: payment-gateway-service* 🚨\n\n*Current Status:* Mitigating\n*Impact:* ~14,000 active transactions affected (87% error rate). Revenue-affecting.\n\n*Root Cause Identified:* Deployment *PROJ-4821* misconfigured the DB connection pool, reducing `max-connections` from 200 to 20.\n\n*Action Plan:*\n1️⃣ Roll back deployment PROJ-4821 immediately.\n2️⃣ Verify DB pool recovery.\n3️⃣ Clear downstream Kafka lag.",
            "status_page_update": "We are experiencing severe response delays and failures in our Payment Gateway. Our engineering team has isolated the cause to a database connection pool misconfiguration and is executing rollback procedures.",
            "email_subject": "[URGENT] P1 Incident: payment-gateway-service Latency Spike"
        },
        "jira_agent": {
            "ticket_id": "INC-4821",
            "url": "http://jira.mock/browse/INC-4821",
            "title": "P1 Service Outage: payment-gateway-service Database Pool Exhaustion",
            "priority": "Critical",
            "assignee": "senior-oncall@company.com",
            "labels": ["p1", "production", "db-pool", "payment-service"],
            "linked_tickets": ["PROJ-4821"]
        },
        "postmortem_agent": {
            "page_url": "http://confluence.mock/display/SRE/PostMortem-INC-4821",
            "title": "PostMortem - Payment Gateway Database Pool Exhaustion (INC-4821)",
            "content": "# Post-Mortem Report: Payment Gateway Database Pool Exhaustion\n\n## 1. INCIDENT SUMMARY\nOn 2024-06-15, our payment-gateway-service experienced a severe outage characterized by a P99 latency spike exceeding 30 seconds and a transaction error rate of 87%. The incident affected approximately 14,000 active transactions. Automated mitigation rolled back the offending deployment within 15 minutes, restoring full service availability.\n\n## 2. TIMELINE\n- **02:31:00 UTC**: Deployment PROJ-4821 was deployed to production.\n- **02:47:00 UTC**: PagerDuty alert triggered on high response latency.\n- **02:47:04 UTC**: IncidentIQ Triage Agent classified the incident as P1.\n- **02:47:15 UTC**: RCA Agent identified database pool size exhaustion (reduced to 20).\n- **02:47:21 UTC**: Runbook Agent fetched 'Payment Gateway Recovery Runbook v2.3' and recommended rollback.\n- **02:47:26 UTC**: Comms Agent created war room and notified stakeholders.\n- **02:47:27 UTC**: Jira Agent created ticket INC-4821.\n- **02:51:00 UTC**: Rollback executed. DB connections restored to 200.\n- **02:53:00 UTC**: Service latency normalized, errors resolved.\n\n## 3. ROOT CAUSE ANALYSIS\nDeployment PROJ-4821 incorrectly set the maximum database connection pool size (`max-connections`) to 20 instead of 200. Under normal load (14,230 RPM), the pool was immediately exhausted, causing all threads requesting database access to block and timeout.\n\n## 4. IMPACT ASSESSMENT\n- **Customer Impact**: 87% of transaction requests failed during the 22-minute window.\n- **Financial Impact**: Estimated $45,000 in delayed/failed processing revenue.\n\n## 5. WHAT WENT WELL\n- Automated alerting notified the on-call engineer within 16 seconds of the breach.\n- RCA isolation was near-instantaneous once the telemetry was parsed.\n\n## 6. WHAT COULD BE IMPROVED\n- Config values should have static lint checks to prevent drastic limits.\n- The deployment was pushed without staging validation.\n\n## 7. ACTION ITEMS\n1. Add validation schema for DB connection configs. (Owner: @database-team, Due: 2024-06-20)\n2. Implement canary testing for configuration deployments. (Owner: @infra-team, Due: 2024-06-25)\n3. Set alerts for database connection wait times. (Owner: @monitoring-team, Due: 2024-06-18)\n4. Post-mortem review meeting. (Owner: @oncall-lead, Due: 2024-06-17)\n5. Update CI/CD to block deployments with decreased pools without approval. (Owner: @security-team, Due: 2024-06-22)\n\n## 8. LESSONS LEARNED\nEven small config changes can have high-blast radius impacts when they affect shared persistence layers."
        }
    },
    "kafka_consumer_lag_p2": {
        "rca_agent": {
            "root_cause": "The kafka-order-consumer service stalled on coupon code deserialization due to an unhandled NullPointerException introduced in PROJ-4912. This caused the consumer offset thread to crash repeatedly, leading to consumer group partition starvation and a lag of 582,000 messages.",
            "confidence": 0.94,
            "evidence": [
                "Kafka consumer lag spiked to 582,000 messages.",
                "Error logs indicate recurring NullPointerException at CouponDeserializer.java:42.",
                "Deployment PROJ-4912 introduced external coupon service checks."
            ],
            "contributing_factors": [
                "Missing try-catch safety block around external deserializer dependencies.",
                "Absence of dead-letter-queue (DLQ) processing for corrupt payloads."
            ]
        },
        "runbook_agent": {
            "runbook_found": True,
            "runbook_title": "Kafka Consumer Lag Remediation Runbook v1.1",
            "relevance_score": 0.92,
            "adapted_steps": [
                "1. Temporarily spin up 3 additional consumer pods to handle partitions.",
                "2. Apply hotfix rollback of PROJ-4912 to bypass the faulty coupon code validation logic.",
                "3. Verify consumer offsets start committing and lag begins trending downward.",
                "4. Implement dead-letter-queue for serialization error payloads."
            ],
            "estimated_resolution_minutes": 25,
            "escalation_needed": False
        },
        "comms_agent": {
            "war_room_created": "#inc-kafka-lag-p2-warroom",
            "stakeholders_notified": ["messaging-team", "order-processing-devs", "on-call-lead", "customer-ops"],
            "slack_message": "⚠️ *P2 Incident Update: kafka-order-consumer* ⚠️\n\n*Current Status:* Recovering\n*Impact:* Order processing delayed for ~582k orders. Downstream services pending.\n\n*Root Cause Identified:* Unhandled NullPointerException in coupon deserializer introduced in deployment *PROJ-4912*.\n\n*Action Plan:*\n1️⃣ Deploy hotfix/rollback PROJ-4912.\n2️⃣ Scale order consumer instances.\n3️⃣ Drain consumer lag.",
            "status_page_update": "We are experiencing processing delays for order fulfillment. The engineering team has isolated a deserializer issue in the consumer stream and is applying a hotfix.",
            "email_subject": "[INFO] P2 Incident: kafka-order-consumer Lag Spike"
        },
        "jira_agent": {
            "ticket_id": "INC-4912",
            "url": "http://jira.mock/browse/INC-4912",
            "title": "P2 Service Delay: kafka-order-consumer Deserialization Loop",
            "priority": "High",
            "assignee": "middleware-oncall@company.com",
            "labels": ["p2", "production", "kafka", "deserializer"],
            "linked_tickets": ["PROJ-4912"]
        },
        "postmortem_agent": {
            "page_url": "http://confluence.mock/display/SRE/PostMortem-INC-4912",
            "title": "PostMortem - Kafka Order Consumer Lag Storm (INC-4912)",
            "content": "# Post-Mortem Report: Kafka Order Consumer Lag Storm\n\n## 1. INCIDENT SUMMARY\nOn 2024-06-15, our order fulfillment pipeline stalled due to a consumer group crash. The `kafka-order-consumer` group accumulated a queue of 582,000 records, delaying customer order confirmation emails by up to 25 minutes. A hotfix was deployed to rollback the bad serialization code.\n\n## 2. TIMELINE\n- **09:45:00 UTC**: Deployment PROJ-4912 went live.\n- **10:12:15 UTC**: Alert fired on consumer group lag exceeding 500,000 threshold.\n- **10:12:20 UTC**: IncidentIQ Triage Agent classified incident as P2.\n- **10:12:35 UTC**: RCA Agent identified the NPE exception loop.\n- **10:12:45 UTC**: Runbook Agent recommended consumer pod expansion & rollback.\n- **10:12:55 UTC**: Stakeholders notified and war room spawned.\n- **10:13:00 UTC**: Jira ticket INC-4912 created.\n- **10:28:00 UTC**: Rollback completed. Lag successfully drained.\n\n## 3. ROOT CAUSE ANALYSIS\nDeployment PROJ-4912 introduced an external coupon check. If an order did not contain a coupon code field, the deserializer attempted to call `.toUpperCase()` on a null value. This uncaught runtime exception terminated the partition processor, locking the consumer group.\n\n## 4. IMPACT ASSESSMENT\n- **Customer Impact**: 582,000 orders were delayed in processing. Customer support ticket volume increased by 300% during the event.\n- **Financial Impact**: No lost revenue, but operational overhead and delayed billing.\n\n## 5. WHAT WENT WELL\n- Lag metrics were correctly set up, flagging the issue before customers began complaining.\n- Fallback scaling allowed us to process the queue quickly once fixed.\n\n## 6. WHAT COULD BE IMPROVED\n- Code lacked basic null safety validation.\n- The consumer should have skipped/DLQ'd poisoned messages rather than shutting down the thread.\n\n## 7. ACTION ITEMS\n1. Add null validation in CouponDeserializer. (Owner: @payment-team, Due: 2024-06-17)\n2. Implement Dead-Letter-Queue pattern for the order consumers. (Owner: @messaging-team, Due: 2024-06-22)\n3. Review exception handling policies across all consumer workers. (Owner: @oncall-lead, Due: 2024-06-28)\n4. Increase automated test coverage for coupon code paths. (Owner: @qa-lead, Due: 2024-06-20)\n5. Adjust PagerDuty escalations for customer lag limits. (Owner: @sre-ops, Due: 2024-06-19)\n\n## 8. LESSONS LEARNED\nAlways assume external API payloads can be empty, malformed, or missing critical fields."
        }
    },
    "api_timeout_p2": {
        "rca_agent": {
            "root_cause": "An accidental rate limit tightening in PROJ-4990 reduced the allowed requests per IP from 1000/s to 10/s. Under standard api-gateway traffic of 25,000 RPM, this triggered instant gateway rate throttling, leading to widespread 504 gateway timeout and 429 too many requests codes.",
            "confidence": 0.96,
            "evidence": [
                "API Gateway error rate is at 46% (primarily 504 timeouts and 429 throttles).",
                "Traffic volume remained steady at 25k RPM, showing the error was internal configuration.",
                "Deployment PROJ-4990 was pushed at 15:15:00 UTC, affecting rate limiter config."
            ],
            "contributing_factors": [
                "Typo in the rate limit config file (missing two zeros in the integer value).",
                "Rate limiter rules are parsed directly in production without dry-run validations."
            ]
        },
        "runbook_agent": {
            "runbook_found": True,
            "runbook_title": "API Gateway Timeout Troubleshooting Runbook v3.0",
            "relevance_score": 0.97,
            "adapted_steps": [
                "1. Hot-patch the rate-limiter config via Gateway API to restore limit to 1000/s.",
                "2. Force-refresh Gateway ingress configurations across AP-NORTHEAST-1 clusters.",
                "3. Monitor gateway error rates to ensure they drop below 0.1%.",
                "4. Verify target service health endpoints are not overloaded by the retry storm."
            ],
            "estimated_resolution_minutes": 10,
            "escalation_needed": False
        },
        "comms_agent": {
            "war_room_created": "#inc-api-timeouts-p2-warroom",
            "stakeholders_notified": ["traffic-engineering", "gateway-operators", "on-call-lead", "partner-api-liaison"],
            "slack_message": "⚠️ *P2 Incident Update: api-gateway* ⚠️\n\n*Current Status:* Mitigating\n*Impact:* Widespread 504 timeouts affecting 46% of api traffic. External partner APIs blocked.\n\n*Root Cause Identified:* Accidental IP rate limiting lock-out (10/s limit) introduced in deployment *PROJ-4990*.\n\n*Action Plan:*\n1️⃣ Hot-patch Gateway rate-limiter configuration limits to 1000/s.\n2️⃣ Reload API configurations.\n3️⃣ Clear client retry storms.",
            "status_page_update": "We are experiencing network throttling on our public API Gateway endpoints. We are currently rolling back a recent traffic rules deployment.",
            "email_subject": "[INFO] P2 Incident: api-gateway 504 Timeout Storm"
        },
        "jira_agent": {
            "ticket_id": "INC-4990",
            "url": "http://jira.mock/browse/INC-4990",
            "title": "P2 Service Throttling: api-gateway Ingress Rule Lockout",
            "priority": "High",
            "assignee": "traffic-oncall@company.com",
            "labels": ["p2", "production", "gateway", "rate-limiter"],
            "linked_tickets": ["PROJ-4990"]
        },
        "postmortem_agent": {
            "page_url": "http://confluence.mock/display/SRE/PostMortem-INC-4990",
            "title": "PostMortem - API Gateway Rate Limit Mismatch (INC-4990)",
            "content": "# Post-Mortem Report: API Gateway Rate Limit Mismatch\n\n## 1. INCIDENT SUMMARY\nOn 2024-06-15, our primary API Gateway began dropping 46% of ingress client connections with 504 Gateway Timeout and 429 Too Many Requests responses. The issue was traced to a typo in the IP rate limiting configuration deployment. A configuration patch restored the limit, resolving the timeouts.\n\n## 2. TIMELINE\n- **15:15:00 UTC**: Deployment PROJ-4990 (Limiter rules update) went live.\n- **15:30:20 UTC**: Timeout storm alert triggered.\n- **15:30:22 UTC**: IncidentIQ Triage Agent classified incident as P2.\n- **15:30:35 UTC**: RCA Agent isolated rate limiting rule typo.\n- **15:30:42 UTC**: Runbook Agent recommended hot-patching ingress settings.\n- **15:30:50 UTC**: War room created and gateway operators pings sent.\n- **15:30:52 UTC**: Jira ticket INC-4990 created.\n- **15:38:00 UTC**: Hot-patch limit applied. Errors normalized.\n\n## 3. ROOT CAUSE ANALYSIS\nDuring config changes in PROJ-4990, the intended IP connection limit of `1000` requests/second was incorrectly keyed as `10`. Under active production load, this immediately blocked all clients, generating timeouts as requests were queued and dropped.\n\n## 4. IMPACT ASSESSMENT\n- **Customer Impact**: 46% of requests failed. Widespread outages for third-party integrations and app login services.\n- **Financial Impact**: Minor, but significant API degradation for partner portals.\n\n## 5. WHAT WENT WELL\n- The hot-patching pathway allowed rule remediation without full container restarts.\n- The alert notified gateway operators before external support channels were flooded.\n\n## 6. WHAT COULD BE IMPROVED\n- Configuration values were not verified by automated tests.\n- Limiter changes should have been rolled out progressively rather than globally.\n\n## 7. ACTION ITEMS\n1. Add unit assertions to Gateway rate-limiter config values. (Owner: @gateway-team, Due: 2024-06-17)\n2. Implement blue-green config rotation for nginx/ingress. (Owner: @infra-team, Due: 2024-06-24)\n3. Set alarms for 429 error status code volume. (Owner: @monitoring-team, Due: 2024-06-18)\n4. Implement retry backoff rules on client apps. (Owner: @client-devs, Due: 2024-06-26)\n5. Run post-mortem alignment session. (Owner: @oncall-lead, Due: 2024-06-17)\n\n## 8. LESSONS LEARNED\nConfig values that directly control throttling are high-severity risk vectors and require strict integration schemas."
        }
    }
}
