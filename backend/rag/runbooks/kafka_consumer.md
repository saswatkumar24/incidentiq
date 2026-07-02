# Kafka Consumer Lag Remediation Runbook v1.1

## Symptoms
- Kafka consumer group 'order-processor' lag exceeds 200,000 records
- Order processing throughput drops to 0 events/sec
- Repeated NullPointerExceptions or parsing exceptions in consumer logs
- CPU utilization spikes on worker containers

## Root Causes
- Poison pill messages in partition queues (e.g. coupon code serialization NullPointerException)
- Consumer group deadlock or partition lockup due to thread starvation
- Downstream microservice timeouts causing retry loops

## Remediation Steps
1. Inspect logs for exception stack trace to locate the failing field:
   `kubectl logs -l app=order-consumer --tail=100`
2. If deserialization or validation is failing on a specific field (e.g., null coupon code):
   Apply hotfix deployment containing validation check:
   `kubectl rollout restart deployment/kafka-order-consumer`
3. Check and monitor consumer offset progress:
   `kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group order-processor`
4. If the consumer continues to stall on a poison pill message and data loss is acceptable for the partition, skip the offset:
   `kafka-consumer-groups.sh --bootstrap-server kafka:9092 --group order-processor --reset-offsets --shift-by 1 --execute`
5. Verify consumer lag is decreasing and processing rate normalizes.

## Escalation
- L2 Support: data-platform@company.com
- L3 Support: VP of Engineering (P1 incidents only)
