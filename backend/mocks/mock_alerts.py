SCENARIOS = {
    "payment_gateway_p1": {
        "alert_id": "ALT-20240615-0247-PG",
        "severity_hint": "critical",
        "service": "payment-gateway-service",
        "environment": "production",
        "region": "EU-WEST-1",
        "triggered_at": "2024-06-15T02:47:33Z",
        "alert_message": "Payment service P99 latency exceeded 30s threshold",
        "metrics_snapshot": {
            "error_rate_percent": 87,
            "p99_latency_ms": 31450,
            "requests_per_minute": 14230,
            "kafka_consumer_lag": 847000,
            "db_connection_pool_used_percent": 98
        },
        "recent_deployments": [
            {
                "ticket": "PROJ-4821",
                "deployed_at": "2024-06-15T02:31:00Z",
                "description": "Update payment service DB config",
                "deployed_by": "developer@company.com",
                "change_summary": "Reduced max-connections: 200 to 20"
            }
        ]
    },
    "kafka_consumer_lag_p2": {
        "alert_id": "ALT-20240615-1012-KF",
        "severity_hint": "warning",
        "service": "kafka-order-consumer",
        "environment": "production",
        "region": "US-EAST-1",
        "triggered_at": "2024-06-15T10:12:15Z",
        "alert_message": "Kafka consumer group 'order-processor' lag exceeded 500,000 threshold",
        "metrics_snapshot": {
            "error_rate_percent": 24,
            "p99_latency_ms": 12500,
            "requests_per_minute": 8200,
            "kafka_consumer_lag": 582000,
            "db_connection_pool_used_percent": 45
        },
        "recent_deployments": [
            {
                "ticket": "PROJ-4912",
                "deployed_at": "2024-06-15T09:45:00Z",
                "description": "Add coupon code validation processing",
                "deployed_by": "developer@company.com",
                "change_summary": "Introduced complex coupon check with external service dependency"
            }
        ]
    },
    "api_timeout_p2": {
        "alert_id": "ALT-20240615-1530-API",
        "severity_hint": "warning",
        "service": "api-gateway",
        "environment": "production",
        "region": "AP-NORTHEAST-1",
        "triggered_at": "2024-06-15T15:30:20Z",
        "alert_message": "API Gateway response timeouts (504 Gateway Timeout) spiked to 46%",
        "metrics_snapshot": {
            "error_rate_percent": 46,
            "p99_latency_ms": 8500,
            "requests_per_minute": 25000,
            "kafka_consumer_lag": 12000,
            "db_connection_pool_used_percent": 32
        },
        "recent_deployments": [
            {
                "ticket": "PROJ-4990",
                "deployed_at": "2024-06-15T15:15:00Z",
                "description": "Update ingress rate limit config",
                "deployed_by": "infra-engineer@company.com",
                "change_summary": "Tightened ingress rate limit per IP from 1000/s to 10/s accidentally"
            }
        ]
    }
}
