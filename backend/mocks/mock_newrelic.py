import datetime

class MockNewRelicClient:
    def __init__(self):
        pass

    def get_metrics(self, service: str, time_window: str = "1h", run_index: int = 0) -> dict:
        """
        Returns metric snapshot summaries for a given service.
        Supports alternating metrics for payment gateway service using run_index.
        """
        if "payment-gateway" in service or "payment" in service:
            if run_index == 1:  # Expired TLS Cert
                return {
                    "service": "payment-gateway-service",
                    "time_window": time_window,
                    "response_time_p99_ms": 250,
                    "error_rate_percent": 100.0,
                    "throughput_rpm": 14230,
                    "kafka_consumer_lag": 50,
                    "db_connection_pool_utilization_percent": 8.0,
                    "cpu_usage_percent": 22.0,
                    "memory_usage_percent": 45.0,
                    "ssl_handshake_errors_per_minute": 450
                }
            elif run_index == 2:  # Upstream Visa network outage
                return {
                    "service": "payment-gateway-service",
                    "time_window": time_window,
                    "response_time_p99_ms": 35000,
                    "error_rate_percent": 95.0,
                    "throughput_rpm": 14230,
                    "kafka_consumer_lag": 847000,
                    "db_connection_pool_utilization_percent": 12.0,
                    "cpu_usage_percent": 15.0,
                    "memory_usage_percent": 40.0,
                    "upstream_packet_loss_percent": 100.0
                }
            else:  # run_index == 0 (DB connection pool exhaustion)
                return {
                    "service": "payment-gateway-service",
                    "time_window": time_window,
                    "response_time_p99_ms": 31450,
                    "error_rate_percent": 87.4,
                    "throughput_rpm": 14230,
                    "kafka_consumer_lag": 847000,
                    "db_connection_pool_utilization_percent": 98.2,
                    "cpu_usage_percent": 88.0,
                    "memory_usage_percent": 72.5
                }
        elif "kafka" in service or "consumer" in service:
            return {
                "service": "kafka-order-consumer",
                "time_window": time_window,
                "response_time_p99_ms": 12500,
                "error_rate_percent": 24.1,
                "throughput_rpm": 8200,
                "kafka_consumer_lag": 582000,
                "db_connection_pool_utilization_percent": 45.0,
                "cpu_usage_percent": 94.2,
                "memory_usage_percent": 85.1
            }
        elif "api-gateway" in service or "gateway" in service:
            return {
                "service": "api-gateway",
                "time_window": time_window,
                "response_time_p99_ms": 8500,
                "error_rate_percent": 46.2,
                "throughput_rpm": 25000,
                "kafka_consumer_lag": 12000,
                "db_connection_pool_utilization_percent": 32.0,
                "cpu_usage_percent": 41.5,
                "memory_usage_percent": 55.0
            }
        else:
            return {
                "service": service,
                "time_window": time_window,
                "response_time_p99_ms": 120,
                "error_rate_percent": 0.05,
                "throughput_rpm": 1500,
                "kafka_consumer_lag": 5,
                "db_connection_pool_utilization_percent": 12.0
            }

    def get_logs(self, service: str, time_window: str = "1h", run_index: int = 0) -> list:
        """
        Returns log entries matching the service and error states.
        """
        if "payment-gateway" in service or "payment" in service:
            if run_index == 1:
                return [
                    {"timestamp": "02:32:10 UTC", "level": "WARNING", "message": "SSL Handshake warning: server certificate close to expiration date"},
                    {"timestamp": "02:33:15 UTC", "level": "ERROR", "message": "javax.net.ssl.SSLHandshakeException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target"},
                    {"timestamp": "02:34:02 UTC", "level": "ERROR", "message": "Handshake failed for api.braintree.com: SSL certificate expired on 2024-03-12"},
                    {"timestamp": "02:35:10 UTC", "level": "ERROR", "message": "Failed to complete client payment validation due to peer SSL validation errors"}
                ]
            elif run_index == 2:
                return [
                    {"timestamp": "02:32:00 UTC", "level": "WARNING", "message": "Upstream response latency exceeding SLA for api.visa.com"},
                    {"timestamp": "02:33:14 UTC", "level": "ERROR", "message": "java.net.SocketTimeoutException: Read timed out when invoking POST https://api.visa.com/v2/payments"},
                    {"timestamp": "02:34:40 UTC", "level": "ERROR", "message": "Gateway timeout: upstream host api.visa.com unreachable. Network packet loss 100%"},
                    {"timestamp": "02:36:01 UTC", "level": "ERROR", "message": "Payment processing halted due to Visa gateway service degradation"}
                ]
            else:
                return [
                    {"timestamp": "02:32:05 UTC", "level": "WARNING", "message": "Connection pool usage exceeded 90%"},
                    {"timestamp": "02:33:14 UTC", "level": "ERROR", "message": "Timeout acquiring database connection: pool exhausted"},
                    {"timestamp": "02:34:20 UTC", "level": "ERROR", "message": "SQLAlchemy.exc.TimeoutError: QueuePool limit of size 20 overflow 10 reached, connection timed out"},
                    {"timestamp": "02:35:01 UTC", "level": "ERROR", "message": "org.postgresql.util.PSQLException: FATAL: remaining connection slots are reserved for non-replication superuser connections"},
                    {"timestamp": "02:36:12 UTC", "level": "WARNING", "message": "Thread pool capacity warning: 100% busy threads"}
                ]
        elif "kafka" in service or "consumer" in service:
            return [
                {"timestamp": "10:02:11 UTC", "level": "INFO", "message": "Processing batch of 500 orders"},
                {"timestamp": "10:02:15 UTC", "level": "ERROR", "message": "java.lang.NullPointerException: Cannot invoke 'String.equals(Object)' because the return value of 'com.company.order.Coupon.getCode()' is null"},
                {"timestamp": "10:02:15 UTC", "level": "ERROR", "message": "\tat com.company.order.OrderCouponSerializer.serialize(OrderCouponSerializer.java:45)"},
                {"timestamp": "10:02:15 UTC", "level": "ERROR", "message": "\tat com.company.order.OrderConsumer.processRecord(OrderConsumer.java:112)"},
                {"timestamp": "10:03:00 UTC", "level": "WARNING", "message": "Consumer group partition assignment failed. Retrying in 5000ms..."},
                {"timestamp": "10:03:05 UTC", "level": "ERROR", "message": "Serialization exception caught. Offset 1849201 blocked. Thread execution paused."}
            ]
        elif "api-gateway" in service or "gateway" in service:
            return [
                {"timestamp": "15:16:00 UTC", "level": "INFO", "message": "Rate limiter updated rules: local_limit=10/s"},
                {"timestamp": "15:17:15 UTC", "level": "WARNING", "message": "IP 194.22.44.11 rate-limit blocked: threshold reached"},
                {"timestamp": "15:20:00 UTC", "level": "ERROR", "message": "504 Gateway Timeout: backend service upstream response took longer than 5000ms"},
                {"timestamp": "15:22:30 UTC", "level": "ERROR", "message": "Gateway timed out on route /v1/checkout. Pending client connections: 4500"},
                {"timestamp": "15:25:00 UTC", "level": "WARNING", "message": "Redis connection pool error: client connections blocked."}
            ]
        else:
            return [
                {"timestamp": "00:00:00 UTC", "level": "INFO", "message": "Service operational. Heartbeat OK."}
            ]

    def get_recent_deployments(self, service: str, hours: int = 2, run_index: int = 0) -> list:
        """
        Returns deployment event history for the given service.
        """
        if "payment-gateway" in service or "payment" in service:
            if run_index == 1:
                return [
                    {
                        "ticket": "PROJ-4830",
                        "deployed_at": "2024-06-15T01:10:00Z",
                        "description": "Library version upgrades and routing configurations",
                        "deployed_by": "infra-engineer@company.com",
                        "change_summary": "Updated Let's Encrypt client helper; deferred rotation ticket SEC-902."
                    }
                ]
            elif run_index == 2:
                return []  # External network outage, no internal deployments
            else:
                return [
                    {
                        "ticket": "PROJ-4821",
                        "deployed_at": "2024-06-15T02:31:00Z",
                        "description": "Update payment service DB config",
                        "deployed_by": "developer@company.com",
                        "change_summary": "Reduced max-connections: 200 -> 20"
                    }
                ]
        elif "kafka" in service or "consumer" in service:
            return [
                {
                    "ticket": "PROJ-4912",
                    "deployed_at": "2024-06-15T09:45:00Z",
                    "description": "Add coupon code validation processing",
                    "deployed_by": "developer@company.com",
                    "change_summary": "Introduced complex coupon check with external service dependency"
                }
            ]
        elif "api-gateway" in service or "gateway" in service:
            return [
                {
                    "ticket": "PROJ-4990",
                    "deployed_at": "2024-06-15T15:15:00Z",
                    "description": "Update ingress rate limit config",
                    "deployed_by": "infra-engineer@company.com",
                    "change_summary": "Tightened ingress rate limit per IP from 1000/s to 10/s accidentally"
                }
            ]
        else:
            return []
