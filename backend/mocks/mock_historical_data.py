# Mock Historical Datasource for SRE Incidents, Jira Comments, Work Logs, and Confluence Docs.

HISTORICAL_INCIDENTS = {
    "payment-gateway-service": [
        {
            "ticket_id": "INC-2024-8119",
            "date": "2024-05-10",
            "title": "Payment Gateway Timeout Spike",
            "root_cause": "Upstream Payment Processor Outage (Visa Gateway Down)",
            "description": "Payment requests timed out at the network border. Logs showed socket timeout exceptions when communicating with api.visa.com.",
            "metrics_fingerprint": {
                "error_rate_percent": 95.0,
                "p99_latency_ms": 35000,
                "db_pool_utilization_percent": 12.0,
                "cpu_usage_percent": 15.0,
                "upstream_packet_loss_percent": 100.0
            },
            "jira_comments": [
                "[2024-05-10 14:15 UTC] SRE Oncall: Confirmed packet loss when pinging Visa API endpoint.",
                "[2024-05-10 14:22 UTC] NetEng Lead: Visa confirmed a major fiber cut in Virginia data center. Traffic rerouted to backup portal."
            ],
            "work_log_before": "None. Upstream network issue.",
            "confluence_page": "https://confluence.internal.mock/display/SRE/PostMortem-INC-2024-8119-VisaOutage"
        },
        {
            "ticket_id": "INC-2024-7432",
            "date": "2024-03-12",
            "title": "Handshake Failure on Checkout",
            "root_cause": "Expired SSL/TLS Certificate for sandbox/production endpoint",
            "description": "Clients experienced SSL handshake exceptions. The certificate for braintree-sandbox.com had expired, causing all payment validation requests to fail.",
            "metrics_fingerprint": {
                "error_rate_percent": 100.0,
                "p99_latency_ms": 250,
                "db_pool_utilization_percent": 8.0,
                "cpu_usage_percent": 22.0,
                "ssl_handshake_errors_per_minute": 450
            },
            "jira_comments": [
                "[2024-03-12 09:10 UTC] SecOps: Identified expired certificate on the sandbox router interface.",
                "[2024-03-12 09:18 UTC] SRE: Renewed Let's Encrypt cert and reloaded proxy config. Validation succeeded."
            ],
            "work_log_before": "Scheduled SSL certificate rotation ticket SEC-902 was deferred from Q1 to Q2.",
            "confluence_page": "https://confluence.internal.mock/display/SRE/PostMortem-INC-2024-7432-ExpiredCert"
        },
        {
            "ticket_id": "INC-2024-6921",
            "date": "2024-01-20",
            "title": "Payment gateway DB connection timeout",
            "root_cause": "Database connection pool starvation (Max-Connections limit set too low)",
            "description": "Casading transaction timeouts occurred. Thread pool starvation observed as all threads blocked waiting for database connections from the limited connection pool.",
            "metrics_fingerprint": {
                "error_rate_percent": 82.0,
                "p99_latency_ms": 30000,
                "db_pool_utilization_percent": 100.0,
                "cpu_usage_percent": 95.0,
                "active_db_connections": 15
            },
            "jira_comments": [
                "[2024-01-20 18:33 UTC] DB-Admin: Connection pool size is capped at 15. We have 450 active threads blocking.",
                "[2024-01-20 18:42 UTC] SRE: Increased connection pool max size to 150 in values.yaml. Rolled out deployment."
            ],
            "work_log_before": "PROJ-3112 optimized DB connections by reducing idle connection timeout from 10m to 1m.",
            "confluence_page": "https://confluence.internal.mock/display/SRE/PostMortem-INC-2024-6921-DBConnectionLimit"
        }
    ],
    "kafka-order-consumer": [
        {
            "ticket_id": "INC-2024-7023",
            "date": "2024-02-15",
            "title": "Kafka Consumer Stalled",
            "root_cause": "JVM Heap Out of Memory (OOM) due to massive coupon payload recursion",
            "description": "Consumer crashed repeatedly with java.lang.OutOfMemoryError: Java heap space. Memory analysis showed nested JSON arrays in order validation.",
            "metrics_fingerprint": {
                "error_rate_percent": 45.0,
                "p99_latency_ms": 15000,
                "db_pool_utilization_percent": 15.0,
                "cpu_usage_percent": 100.0,
                "memory_leak_bytes": 1073741824
            },
            "jira_comments": [
                "[2024-02-15 11:22 UTC] Backend-Dev: Found a recursion bug in coupon code array matching.",
                "[2024-02-15 11:35 UTC] SRE: Increased JVM heap max size from 512MB to 2GB as a temporary mitigation, then applied hotfix patch."
            ],
            "work_log_before": "Change ticket deploys Java 17 runtime upgrade to kafka consumer pods.",
            "confluence_page": "https://confluence.internal.mock/display/SRE/PostMortem-INC-2024-7023-OOM"
        }
    ],
    "api-gateway": [
        {
            "ticket_id": "INC-2024-8390",
            "date": "2024-06-02",
            "title": "Gateway 502 Bad Gateway",
            "root_cause": "Container Crash Loop in auth-service upstream service",
            "description": "API Gateway could not route auth calls, responding with 502. Upstream auth-service pods were crash looping due to a bad config mapping key.",
            "metrics_fingerprint": {
                "error_rate_percent": 60.0,
                "p99_latency_ms": 5002,
                "db_pool_utilization_percent": 5.0,
                "cpu_usage_percent": 10.0
            },
            "jira_comments": [
                "[2024-06-02 23:45 UTC] SRE: Upstream auth service returns 502. Container status show CrashLoopBackOff.",
                "[2024-06-03 00:02 UTC] Infra: Rolled back auth service configmap to previous version."
            ],
            "work_log_before": "Configmap auth-config updated to add authentication keys for external user validation.",
            "confluence_page": "https://confluence.internal.mock/display/SRE/PostMortem-INC-2024-8390-AuthCrash"
        }
    ]
}

def get_historical_data_for_service(service: str) -> list:
    """
    Returns the list of historical incidents and relevant SRE logs for a service name.
    """
    # Clean service name to match keys
    cleaned_service = "unknown-service"
    if "payment" in service:
        cleaned_service = "payment-gateway-service"
    elif "kafka" in service or "consumer" in service:
        cleaned_service = "kafka-order-consumer"
    elif "gateway" in service or "api-gateway" in service:
        cleaned_service = "api-gateway"
        
    return HISTORICAL_INCIDENTS.get(cleaned_service, [])
