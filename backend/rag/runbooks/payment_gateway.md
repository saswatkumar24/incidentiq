# Payment Gateway Recovery Runbook v2.3

## Symptoms
- Payment service response latency > 10s
- Error rate > 50%
- Kafka consumer lag > 100K messages
- Client checkouts failing with HTTP 500 / 504 status codes

## Root Causes
- DB connection pool exhaustion (max connections set too low)
- Downstream payment aggregator service timeout
- Database locking during high transaction bursts

## Remediation Steps
1. Check connection pool configuration:
   `kubectl get configmap payment-config -o yaml`
2. If connection pool was recently misconfigured (e.g. max connections reduced):
   `kubectl rollout undo deploy/payment-svc`
3. Monitor pod health and recovery status:
   `watch kubectl get pods -l app=payment`
4. Clear Kafka consumer backlog and reset offsets if needed:
   `kafka-consumer-groups.sh --bootstrap-server kafka:9092 --group payment-processor --reset-offsets --to-latest --execute`
5. Verify health endpoint returns success:
   `curl -f https://payment-internal.company.com/health`

## Escalation
- L2 Support: platform-team@company.com
- L3 Support: VP of Engineering (P1 incidents only)
