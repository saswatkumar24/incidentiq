# Database Connection Troubleshooting Runbook v1.5

## Symptoms
- HTTP 500 responses with database connection errors
- Stack trace contains `TimeoutError: QueuePool limit of size X reached`
- Applications report failure to establish connection within timeout window
- Database metrics show connection slots exhausted (100% usage)

## Root Causes
- Application connection leaks (sessions not closed properly in code)
- Sudden traffic spike overloading default connection pool allocations
- Database server max connections configuration mismatch (too low)
- Connection limits reduced in deployment templates

## Remediation Steps
1. Connect to PostgreSQL and query active connections:
   `SELECT count(*), state FROM pg_stat_activity GROUP BY state;`
2. If leak is detected, identify query pattern and terminate long-running idle sessions:
   `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND state_change < now() - interval '5 minutes';`
3. Verify current service deployment configuration limits:
   `kubectl get deployment -o yaml | grep max-connections`
4. If a recent release reduced max connections (e.g., from 200 to 20):
   Rollback to previous known good release configuration:
   `kubectl rollout undo deployment/<service-name>`
5. Verify application recovers and connection pool saturation drops below 50%.

## Escalation
- L2 Support: dba-ops@company.com
- L3 Support: DB Architect
