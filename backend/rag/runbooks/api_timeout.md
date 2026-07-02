# API Gateway Timeout Troubleshooting Runbook v3.0

## Symptoms
- API Gateway returns HTTP 504 Gateway Timeout or HTTP 429 Too Many Requests
- Gateway latency (P95/P99) exceeds 8000ms
- Backend request queues are saturated
- Ingress logs show massive rate limiter blocks

## Root Causes
- Misconfigured API rate limiting rules (e.g. per IP limit set too low)
- Upstream backend services responding slowly, blocking gateway threads
- Massive traffic surges (DDoS or flash sale event) bypassing caching layers

## Remediation Steps
1. Inspect the API Gateway rate limit rules:
   `kubectl get configmap api-gateway-rules -o yaml`
2. If the rate limit per IP was accidentally restricted (e.g. 1000/s to 10/s):
   Edit configmap to restore original rates or rollback rate limit deployment:
   `kubectl rollout undo deployment/api-gateway`
3. Scale the gateway pod count to distribute current socket connection backlog:
   `kubectl scale deployment/api-gateway --replicas=5`
4. Flush the Redis rate limiting counters if rules cache is stuck:
   `redis-cli -h redis-service FLUSHDB`
5. Test basic connectivity to upstream services through the gateway:
   `curl -i -X GET https://api.company.com/v1/health`

## Escalation
- L2 Support: traffic-eng@company.com
- L3 Support: Infrastructure Lead
