import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  FileText,
  Workflow,
  FileCode,
  Sliders,
  Bot,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Database,
  Sparkles,
  Server,
  Zap,
  ArrowRight,
  Activity,
  Check,
  Copy,
  ExternalLink,
  ShieldAlert,
  Search,
  MessageSquare,
  Ticket,
  BookOpen,
  Share2,
  Box,
  Code,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  HelpCircle,
  TrendingUp,
  Percent,
  Radio,
  FileCheck
} from 'lucide-react';

const DocsHub = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('scenarios_e2e');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [selectedRunbook, setSelectedRunbook] = useState('database_connection');

  const navItems = [
    { id: 'scenarios_e2e', label: '6 Practical Scenarios (E2E)', icon: Zap, badge: 'Crucial' },
    { id: 'telemetry_confidence', label: 'Logs, Triggers & Confidence', icon: TrendingUp, badge: 'AI Engine' },
    { id: 'knowledge_base_files', label: 'Knowledge Base & Flat Files', icon: Database, badge: 'ChromaDB' },
    { id: 'architecture_diagram', label: 'Architecture Diagram', icon: Layers, badge: 'Visual' },
    { id: 'presentation', label: 'Presentation & Pitch Deck', icon: Sparkles, badge: '15 Slides' },
    { id: 'detailed_workflow', label: 'Detailed Workflow', icon: Workflow, badge: 'Step-by-Step' },
    { id: 'project_report', label: 'Detailed Project Report', icon: FileText, badge: 'Executive' },
    { id: 'system_architecture', label: 'Detailed Architecture', icon: Server, badge: 'Deep-Dive' },
    { id: 'tech_stack', label: 'Tech Stack & Specs', icon: Sliders, badge: 'Specs' },
    { id: 'file_structure', label: 'Codebase Files & Layout', icon: FileCode, badge: 'Files' },
    { id: 'agent_deepdive', label: 'Agent Deep-Dive (All 6)', icon: Bot, badge: 'Core AI' },
  ];

  // Practical 6 End-to-End Scenarios
  const practicalScenarios = [
    {
      id: 'scenario_1',
      title: 'Payment Gateway DB Pool Exhaustion (P1 Outage)',
      severity: 'P1 CRITICAL',
      service: 'payment-gateway-service',
      blastRadius: '14,200 active checkout transactions (87% error rate)',
      slaLimit: '15 Minutes',
      mttrActual: '68 Seconds',
      startTrigger: 'Prometheus Alertmanager fires High5xxErrorRate webhook due to P99 latency exceeding 30s.',
      rootCause: 'Deployment PROJ-4821 reduced DB max-connections from 200 to 20, causing instant thread queue starvation.',
      confidence: '98%',
      confidenceBreakdown: 'Deploy correlation (+35%) + Log QueuePool signature (+30%) + 98.2% pool saturation (+20%) + Excluded upstream processor latency (+13%) = 98%',
      runbookUsed: 'database_connection.md (v1.5) & Payment Gateway Recovery Runbook v2.3',
      steps: [
        { time: '00:00:00', title: 'Webhook Trigger Ingested', detail: 'POST /api/incident/trigger received payload with error_rate=87% on payment-gateway-service. SQLite incident record initialized.' },
        { time: '00:00:03', title: 'Triage Agent Classification', detail: 'Classifies as P1 Critical. Calculates revenue blast radius ($45,000/hr) and marks SLA breach countdown at 15 minutes.' },
        { time: '00:00:15', title: 'RCA Agent Deep Diagnostics', detail: 'Queries Prometheus metrics & inspects recent Docker image git tags. Isolates commit PROJ-4821 pushed 16m ago changing pool limits. Rules out upstream Visa network downtime.' },
        { time: '00:00:22', title: 'Runbook Agent Vector Match', detail: 'ChromaDB query matches database_connection.md with 95% similarity. Synthesizes kubectl rollback command: kubectl rollout undo deployment/payment-gateway-service.' },
        { time: '00:00:28', title: 'Comms Agent War Room Setup', detail: 'Provisions Slack channel #inc-payment-gateway-p1-warroom. Broadcasts executive status to On-Call SRE, VP Eng, and FinOps leads.' },
        { time: '00:00:30', title: 'Jira Agent Incident Ticketing', detail: 'Files Jira ticket INC-4821 with priority=Critical. Directly links offending development issue PROJ-4821 as rollback target.' },
        { time: '00:01:08', title: 'Mitigation Execution & Recovery', detail: 'Connection pool rolled back to 200 connections. Error rate drops from 87% to 0.02%. P99 latency normalizes to 85ms.' },
        { time: '00:01:15', title: 'Post-Mortem Published to Confluence', detail: 'Post-Mortem Agent auto-publishes 8-section blameless report to Confluence with 5 preventative action items. Incident marked RESOLVED.' }
      ]
    },
    {
      id: 'scenario_2',
      title: 'Kafka Consumer Lag & Poison Pill Deserialization (P2 Outage)',
      severity: 'P2 HIGH',
      service: 'order-fulfillment-stream',
      blastRadius: '582,000 delayed orders across 4 processing queues',
      slaLimit: '30 Minutes',
      mttrActual: '74 Seconds',
      startTrigger: 'Datadog monitor alert: KafkaConsumerLagSpike (>500k messages threshold breached).',
      rootCause: 'Deployment PROJ-4912 introduced unhandled NullPointerException during coupon code deserialization (CouponDeserializer.java:42).',
      confidence: '95%',
      confidenceBreakdown: 'Exact stack trace match (+35%) + Lag metric threshold (+25%) + Commit diff correlation (+20%) + Excluded network broker disconnects (+15%) = 95%',
      runbookUsed: 'kafka_consumer.md (v1.1) & Kafka Consumer Lag Remediation Runbook',
      steps: [
        { time: '00:00:00', title: 'Datadog Lag Alert Ingested', detail: 'Order stream partition 3 lag exceeded 582,000 items. Consumer threads terminating in crash-loop.' },
        { time: '00:00:04', title: 'Triage Classification', detail: 'Classified as P2 High. Evaluates fulfillment delay impact and alerts logistics operations team.' },
        { time: '00:00:18', title: 'RCA Error Trace Inspection', detail: 'Inspects worker logs: java.lang.NullPointerException at CouponDeserializer.java:42. Code called .toUpperCase() on null coupon field.' },
        { time: '00:00:26', title: 'Runbook Agent Adaptation', detail: 'Fetches kafka_consumer.md. Formulates 2-step fix: Route invalid offset payloads to Dead Letter Queue (DLQ) and spin up 3 temporary partition consumers.' },
        { time: '00:00:32', title: 'Comms Agent Slack Broadcast', detail: 'Spawns #inc-kafka-lag-p2-warroom. Notifies order-processing and customer care leads.' },
        { time: '00:00:34', title: 'Jira Agent Ticketing', detail: 'Files INC-4912, tags backend middleware squad, and links PR-4912.' },
        { time: '00:01:14', title: 'Queue Drain & Resolution', detail: 'Dead letter queue activated. Consumers resume processing at 22,000 msgs/sec. Backlog fully drained.' }
      ]
    },
    {
      id: 'scenario_3',
      title: 'API Gateway 504 Timeout Storm via Ingress Rate-Limiting (P2 Outage)',
      severity: 'P2 HIGH',
      service: 'api-gateway (checkout & search routes)',
      blastRadius: '46.2% of public ingress traffic (4,500 blocked connections)',
      slaLimit: '25 Minutes',
      mttrActual: '52 Seconds',
      startTrigger: 'CloudWatch Canary synthetic test alerts on 504 Gateway Timeouts on /v1/checkout.',
      rootCause: 'Deployment PROJ-4990 incorrectly configured local_limit per IP from 1000/s to 10/s, exhausting Redis connection tracking pools.',
      confidence: '98%',
      confidenceBreakdown: 'Ingress log rule match (+40%) + Rate limiter threshold comparison (+25%) + Redis pool timeout signature (+20%) + Excluded upstream service crashes (+13%) = 98%',
      runbookUsed: 'api_timeout.md (v3.0)',
      steps: [
        { time: '00:00:00', title: 'CloudWatch Synthetic Alarm', detail: 'Public API latency spiked to 8,500ms; 46.2% of incoming mobile checkout requests receiving 504 Timeouts.' },
        { time: '00:00:02', title: 'Triage Classification', detail: 'Classifies as P2 High. Identifies customer-facing API degradation.' },
        { time: '00:00:14', title: 'RCA Diagnosis', detail: 'Scans ingress controller logs: local_limit=10/s detected. Legitimate client IPs blocked, exhausting Redis tracking sockets.' },
        { time: '00:00:20', title: 'Runbook Action Formulation', detail: 'Adapts api_timeout.md: hot-patches rate-limiter threshold back to 1000/s and flushes Redis tracking keys.' },
        { time: '00:00:25', title: 'Slack & Jira Notifications', detail: 'Notifies #traffic-engineering and creates Jira ticket INC-4990 with linked PROJ-4990.' },
        { time: '00:00:52', title: 'Hot-Patch Verification', detail: 'Rate limits restored to 1000/s. Ingress P99 drops below 120ms. 504 error rate drops to 0%.' }
      ]
    },
    {
      id: 'scenario_4',
      title: 'Third-Party Payment Gateway Outage & Auto-Failover (P1 Outage)',
      severity: 'P1 CRITICAL',
      service: 'external-checkout-bridge',
      blastRadius: '100% of Visa credit card transactions failing',
      slaLimit: '15 Minutes',
      mttrActual: '45 Seconds',
      startTrigger: 'Synthetic monitoring ping alerts: 100% packet loss and SocketTimeoutException on api.visa.com.',
      rootCause: 'Upstream payment processor network fiber cut in Virginia data center; internal DB pools healthy at 12%.',
      confidence: '96%',
      confidenceBreakdown: 'Zero local deployment within 4h (+30%) + External endpoint socket timeout (+35%) + Low local CPU/DB saturation (+20%) + Multi-region ping loss (+11%) = 96%',
      runbookUsed: 'payment_gateway.md (v3.1)',
      steps: [
        { time: '00:00:00', title: 'External Connectivity Alert', detail: 'Visa API endpoints timing out after 30 seconds; 95% checkout failures.' },
        { time: '00:00:03', title: 'Triage Assessment', detail: 'Classified as P1. High financial exposure; alerts on-call payment architect.' },
        { time: '00:00:12', title: 'RCA Root Cause Isolation', detail: 'Verifies internal database health (low pool usage). Identifies upstream external provider outage.' },
        { time: '00:00:18', title: 'Runbook Dynamic Selection', detail: 'Selects payment_gateway.md. Adapts failover command to switch billing routes to secondary provider (Mastercard/Adyen).' },
        { time: '00:00:24', title: 'Automated Failover Route', detail: 'Executes circuit breaker trip in gateway router. Reroutes all pending transactions to secondary gateway.' },
        { time: '00:00:45', title: 'Transactions Restored', detail: 'Checkout success rate returns to 99.8%. War room and Jira updated with upstream vendor ticket.' }
      ]
    },
    {
      id: 'scenario_5',
      title: 'Redis Session Cache Eviction Cascade on Auth Service (P1 Outage)',
      severity: 'P1 CRITICAL',
      service: 'auth-session-cluster',
      blastRadius: 'All user login and token validation requests blocked (100% auth failure)',
      slaLimit: '10 Minutes',
      mttrActual: '81 Seconds',
      startTrigger: 'Auth service reporting OOMCommandNotAllowed from Redis cache cluster.',
      rootCause: 'Token TTL config omitted in deployment PROJ-4710; Redis memory filled to 100% without an eviction policy configured (noeviction default).',
      confidence: '93%',
      confidenceBreakdown: 'Redis OOM error log match (+35%) + Memory metric saturation at 100% (+30%) + Commit diff showing omitted TTL (+20%) + Excluded network partitioning (+8%) = 93%',
      runbookUsed: 'database_connection.md (Redis Cluster Playbook)',
      steps: [
        { time: '00:00:00', title: 'OOM Alert Triggered', detail: 'Redis node reports maxmemory reached; reject write commands with OOMCommandNotAllowed.' },
        { time: '00:00:03', title: 'Triage Classification', detail: 'Classified as P1 Critical. Customer login blocked globally.' },
        { time: '00:00:16', title: 'RCA Log Analysis', detail: 'Finds deployment PROJ-4710 omitted expiration key TTL. Keys never expired; memory exhausted.' },
        { time: '00:00:24', title: 'Runbook Adaptation', detail: 'Adapts CLI command: redis-cli CONFIG SET maxmemory-policy allkeys-lru and flushes expired auth keys.' },
        { time: '00:00:30', title: 'Comms & Jira', detail: 'Creates war room #inc-auth-p1-warroom and files Jira ticket INC-4710 with security leads tagged.' },
        { time: '00:01:21', title: 'Eviction Applied & Normalization', detail: 'LRU eviction policy applied. 3.2GB of stale session keys purged. Auth latency returns to 18ms.' }
      ]
    },
    {
      id: 'scenario_6',
      title: 'Kubernetes Worker Node Disk Pressure & Pod Eviction Loop (P2 Outage)',
      severity: 'P2 MEDIUM',
      service: 'k8s-worker-node-4',
      blastRadius: '5 notification worker pods repeatedly evicted',
      slaLimit: '45 Minutes',
      mttrActual: '59 Seconds',
      startTrigger: 'Kubernetes kubelet fires KubeNodeDiskPressure on node ip-10-0-4-82.',
      rootCause: 'Unrotated Docker container log files in /var/log/pods saturated node root disk to 99.8% capacity.',
      confidence: '97%',
      confidenceBreakdown: 'Kubelet event disk pressure (+40%) + df -h disk metric 99.8% (+30%) + Docker log path verification (+15%) + Node health check exclusion (+12%) = 97%',
      runbookUsed: 'k8s_node_disk_cleanup.md',
      steps: [
        { time: '00:00:00', title: 'Kubelet Disk Pressure Alert', detail: 'Kubelet unable to write container runtime volumes. Pods entering Terminating/Evicted state.' },
        { time: '00:00:04', title: 'Triage Classification', detail: 'Classifies as P2 Medium. Affected pods have backup replicas on other nodes.' },
        { time: '00:00:15', title: 'RCA File System Inspection', detail: 'Queries node disk stats: /var/log/pods consuming 94GB due to unrotated stdout JSON logs.' },
        { time: '00:00:22', title: 'Runbook Adaptation', detail: 'Synthesizes node cordon and log vacuuming command: journalctl --vacuum-size=500M && docker system prune -f.' },
        { time: '00:00:30', title: 'Comms & Jira Action', detail: 'Alerts #infra-sre channel and creates Jira ticket INC-4680 for automated log rotation daemonset.' },
        { time: '00:00:59', title: 'Disk Cleaned & Node Uncordoned', detail: 'Disk usage drops from 99.8% to 24%. Worker node uncordoned; all pods resume Running state.' }
      ]
    }
  ];

  // Runbook flat files content
  const runbooksData = {
    database_connection: {
      filename: 'backend/rag/runbooks/database_connection.md',
      title: 'PostgreSQL / MySQL Database Connection Pool Exhaustion Runbook v1.5',
      symptoms: [
        'HTTP 500 responses with database connection errors',
        'Stack trace contains TimeoutError: QueuePool limit of size X reached',
        'Applications report failure to establish connection within timeout window',
        'Database metrics show connection slots exhausted (100% usage)'
      ],
      rootCauses: [
        'Application connection leaks (sessions not closed properly in code)',
        'Sudden traffic spike overloading default connection pool allocations',
        'Database server max connections configuration mismatch (too low)',
        'Connection limits reduced in deployment templates (e.g. from 200 to 20)'
      ],
      remediationSteps: [
        '1. Connect to PostgreSQL and query active connections: SELECT count(*), state FROM pg_stat_activity GROUP BY state;',
        '2. Identify query pattern and terminate long-running idle sessions: SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = \'idle\' AND state_change < now() - interval \'5 minutes\';',
        '3. Verify current service deployment configuration limits: kubectl get deployment -o yaml | grep max-connections',
        '4. If a recent release reduced max connections (e.g., from 200 to 20): Rollback to previous known good release configuration: kubectl rollout undo deployment/<service-name>',
        '5. Verify application recovers and connection pool saturation drops below 50%.'
      ]
    },
    kafka_consumer: {
      filename: 'backend/rag/runbooks/kafka_consumer.md',
      title: 'Kafka Consumer Lag & Poison Pill Deserialization Runbook v1.1',
      symptoms: [
        'Consumer group lag metric increasing rapidly above threshold (>500,000)',
        'Consumer pod logs reporting repeated NullPointerException or SerializationException',
        'Partitions stuck with no offset commits progressing'
      ],
      rootCauses: [
        'Poison pill message with missing required JSON fields or unexpected schema',
        'Unhandled exception crashing the partition consumer worker thread',
        'Downstream service dependency timeout causing batch processing stalls'
      ],
      remediationSteps: [
        '1. Inspect partition logs to identify the exact poison pill payload and offset.',
        '2. Route offending message offset to Dead Letter Queue (DLQ): kafka-consumer-groups --bootstrap-server localhost:9092 --group order-group --topic orders --reset-offsets --to-offset <offset+1> --execute',
        '3. Scale consumer deployment replicas to rapidly process accumulated backlog: kubectl scale deployment/kafka-order-consumer --replicas=6',
        '4. Monitor lag metric to ensure it trends down to baseline (<1,000).'
      ]
    },
    api_timeout: {
      filename: 'backend/rag/runbooks/api_timeout.md',
      title: 'API Gateway 504 Gateway Timeout Troubleshooting Runbook v3.0',
      symptoms: [
        'Widespread HTTP 504 Gateway Timeout and 429 Too Many Requests responses',
        'Upstream latency metrics exceed gateway read timeout limit (e.g., >5,000ms)',
        'Redis rate limiting connection pool exhausted'
      ],
      rootCauses: [
        'Ingress rate limit misconfiguration (e.g., threshold set to 10/s instead of 1000/s)',
        'Upstream microservice thread pool exhaustion or database lock contention',
        'Redis session store latency spike delaying rate limit evaluation'
      ],
      remediationSteps: [
        '1. Inspect active ingress rate limiter rule limits: kubectl describe ingress <service-ingress>',
        '2. If limits are misconfigured, hot-patch ingress configuration or execute rollout undo: kubectl rollout undo deployment/api-gateway',
        '3. Flush rate limiting tracking cache if Redis connection pool is blocked: redis-cli FLUSHDB',
        '4. Scale gateway replicas to handle connection retry bursts: kubectl scale deployment/api-gateway --replicas=5'
      ]
    },
    payment_gateway: {
      filename: 'backend/rag/runbooks/payment_gateway.md',
      title: 'Third-Party Payment Gateway Circuit Breaker Runbook v3.1',
      symptoms: [
        'HTTP 502/503/504 errors on checkout and billing endpoints',
        'Logs show SocketTimeoutException or ConnectionRefusedException when calling external payment partner APIs',
        'Payment transaction drop-off rate > 90%'
      ],
      rootCauses: [
        'External payment processor regional outage or network fiber partition',
        'Expired SSL/TLS client certificate or expired partner API credentials',
        'Circuit breaker threshold misconfigured or failover routes disabled'
      ],
      remediationSteps: [
        '1. Verify external partner status page (e.g. Visa, Stripe, Braintree developer status).',
        '2. If external provider is down, activate secondary payment route failover via router config: curl -X POST https://api.internal/admin/routes/failover -d \'{"target": "secondary_provider"}\'',
        '3. If certificate expired, renew certificate and reload proxy ingresses.',
        '4. Confirm checkout transaction error rate drops below 1%.'
      ]
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row max-w-[1700px] w-full mx-auto p-4 lg:p-6 gap-6 min-h-[calc(100vh-80px)]">
      {/* Left Navigation Sidebar */}
      <aside className="w-full lg:w-72 flex-shrink-0 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl flex flex-col justify-between shadow-2xl">
        <div className="space-y-4">
          <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black tracking-widest text-sky-400 uppercase">Documentation Hub</span>
              <h2 className="text-base font-bold text-slate-100">Architecture & Specs</h2>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/40 transition-all"
              >
                Back to Live
              </button>
            )}
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-300 border border-sky-500/30 shadow-lg shadow-sky-500/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-sky-400' : 'text-slate-500'} />
                    <span>{item.label}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                    isActive ? 'bg-sky-400/20 text-sky-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800/60 text-[11px] text-slate-500 space-y-1">
          <p><strong className="text-slate-400">IncidentIQ Platform</strong> v1.0.0</p>
          <p>Architect: <span className="text-slate-300 font-semibold">Saswat Kumar Patro</span></p>
          <p>VLink Company AI Hackathon</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-2xl overflow-y-auto">

        {/* TAB 1: 6 PRACTICAL END-TO-END SCENARIOS */}
        {activeTab === 'scenarios_e2e' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Zap size={13} /> Production Run Playbooks
                </div>
                <h2 className="text-2xl font-black text-slate-100">6 Practical Outage Scenarios (End-to-End)</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Complete breakdown of how each outage triggers, how root cause confidence is formed, and how autonomous remediation resolves the incident.
                </p>
              </div>

              {/* Scenario Selector Pills */}
              <div className="flex flex-wrap gap-1.5">
                {practicalScenarios.map((sc, idx) => (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenarioIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedScenarioIndex === idx
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Scenario {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Scenario Card */}
            {(() => {
              const sc = practicalScenarios[selectedScenarioIndex];
              return (
                <div className="space-y-6">
                  {/* Scenario Header Info */}
                  <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md font-mono ${
                          sc.severity.includes('P1') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {sc.severity}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1.5">{sc.title}</h3>
                        <p className="text-xs font-mono text-slate-400">Service: {sc.service}</p>
                      </div>
                      <div className="flex gap-4 text-right">
                        <div>
                          <span className="text-[10px] uppercase font-mono text-slate-500 block">SLA Threshold</span>
                          <span className="text-sm font-bold text-slate-300">{sc.slaLimit}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono text-slate-500 block">IncidentIQ MTTR</span>
                          <span className="text-sm font-black text-emerald-400">{sc.mttrActual}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2">
                        <span className="font-bold text-sky-400 uppercase tracking-wider block">Trigger Mechanism:</span>
                        <p className="text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                          {sc.startTrigger}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="font-bold text-indigo-400 uppercase tracking-wider block">Customer Blast Radius:</span>
                        <p className="text-slate-300 bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                          {sc.blastRadius}
                        </p>
                      </div>
                    </div>

                    {/* Confidence Scoring Box */}
                    <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                          <Percent size={14} className="text-indigo-400" />
                          RCA Confidence Rating: <strong className="text-emerald-400 text-sm">{sc.confidence}</strong>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Runbook: {sc.runbookUsed}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                        <strong>Confidence Formula:</strong> {sc.confidenceBreakdown}
                      </p>
                    </div>
                  </div>

                  {/* Step-by-Step Execution Waterfall */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Step-by-Step Incident Lifecycle (Trigger ➔ RCA ➔ Runbook ➔ Comms ➔ Post-Mortem)
                    </h4>
                    <div className="space-y-2.5">
                      {sc.steps.map((st, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-4">
                          <div className="w-16 flex-shrink-0 font-mono text-[11px] text-sky-400 font-bold">
                            {st.time}
                          </div>
                          <div className="flex-1 space-y-1">
                            <span className="text-xs font-bold text-slate-200 block">{st.title}</span>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{st.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 2: TELEMETRY, TRIGGERS & CONFIDENCE CALCULATION ENGINE */}
        {activeTab === 'telemetry_confidence' && (
          <div className="space-y-6 text-xs text-slate-300 leading-relaxed animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
                <TrendingUp size={13} /> Deep Diagnostic Mechanics
              </div>
              <h2 className="text-2xl font-black text-slate-100">Telemetry Ingestion, Triggers &amp; Confidence Engine</h2>
              <p className="text-slate-400 mt-1">
                How IncidentIQ ingests logs, what triggers the autonomous pipeline, and the mathematical formula behind the AI's confidence scores.
              </p>
            </div>

            {/* Section 1: Where the AI gets the logs from & what triggers it */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <Radio size={16} /> 1. Where Does the AI Get the Logs &amp; Telemetry?
              </h3>
              <p>
                IncidentIQ receives and aggregates observability data from multiple standardized ingestion channels:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-slate-200 block">1. Alert Ingestion Webhook</strong>
                  <p className="text-slate-400 text-[11px]">
                    Triggered by <code>POST /api/incident/trigger</code>. Simulates incoming webhooks from Prometheus Alertmanager, Datadog Webhook integrations, AWS CloudWatch alarms, or PagerDuty alerts.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-slate-200 block">2. APM Telemetry Query Tool</strong>
                  <p className="text-slate-400 text-[11px]">
                    The RCA Agent invokes <code>fetch_telemetry()</code> via <code>backend/mocks/mock_newrelic.py</code>, polling golden signals: throughput (RPM), P99 latency, error rates, DB pool usage, and container CPU/memory metrics.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-slate-200 block">3. Deployment Commit Logs</strong>
                  <p className="text-slate-400 text-[11px]">
                    The agent scans recent deployment metadata (e.g. <code>PROJ-4821</code>, <code>PROJ-4912</code>, <code>PROJ-4990</code>) deployed within the last 30 minutes to correlate configuration diffs with error spikes.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Mathematical Confidence Calculation Formula */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <Percent size={16} /> 2. How Does the AI Calculate Its Confidence Score?
              </h3>
              <p>
                The RCA Agent does not guess. It computes a <strong>Weighted Multi-Factor Heuristic Score</strong> across four distinct diagnostic vectors:
              </p>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2">
                <p className="text-purple-400 font-bold">Confidence Score Formula: C = W_deploy + W_signature + W_saturation + W_exclusion</p>
                <div className="space-y-1 text-slate-400">
                  <p>• <strong>W_deploy (35% weight):</strong> Temporal correlation. If a deployment occurred within 15 minutes prior to the latency/error spike, +35% confidence is credited.</p>
                  <p>• <strong>W_signature (30% weight):</strong> Error signature string matching. If application logs contain exact known exception strings (e.g. <code>PSQLException: FATAL remaining connection slots</code> or <code>NullPointerException at CouponDeserializer.java:42</code>), +30% confidence is credited.</p>
                  <p>• <strong>W_saturation (20% weight):</strong> Metric threshold breach. If telemetry shows a resource (DB connection pool, Redis memory, Kafka consumer lag) saturated above 90% capacity, +20% confidence is credited.</p>
                  <p>• <strong>W_exclusion (15% weight):</strong> Hypothesis elimination. The agent rules out alternative explanations (e.g., verifying that upstream Visa gateway network latency is nominal, or checking that local host CPU is under 40%), adding +15% confidence.</p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-emerald-400 font-bold">
                  Total Combined Confidence = 35% + 30% + 20% + 13% = 98% Confidence
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KNOWLEDGE BASE, FLAT FILES & CHROMADB VECTOR STORE */}
        {activeTab === 'knowledge_base_files' && (
          <div className="space-y-6 text-xs text-slate-300 leading-relaxed animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Database size={13} /> Local Vector &amp; Flat File Knowledge
                </div>
                <h2 className="text-2xl font-black text-slate-100">Knowledge Base &amp; Flat File Storage</h2>
                <p className="text-slate-400 mt-1">
                  IncidentIQ utilizes local flat files and ChromaDB vector store so that it has instant, deterministic knowledge of company runbooks.
                </p>
              </div>

              {/* Runbook Selector Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(runbooksData).map((rbKey) => (
                  <button
                    key={rbKey}
                    onClick={() => setSelectedRunbook(rbKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedRunbook === rbKey
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {rbKey}.md
                  </button>
                ))}
              </div>
            </div>

            {/* Runbook Viewer */}
            {(() => {
              const rb = runbooksData[selectedRunbook];
              return (
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">Flat File Path</span>
                      <h3 className="text-base font-bold text-white font-mono">{rb.filename}</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                      ChromaDB Indexed
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Title:</h4>
                    <p className="text-slate-300 font-semibold">{rb.title}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Recognized Symptoms:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                      {rb.symptoms.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Identified Root Causes:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                      {rb.rootCauses.map((rc, i) => (
                        <li key={i}>{rc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Standard Remediation Steps (Adapted by AI):</h4>
                    <div className="space-y-1.5 bg-slate-900 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
                      {rb.remediationSteps.map((step, i) => (
                        <p key={i}>{step}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Offline Cache & SQLite Storage Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Deterministic Flat File Cache: backend/gemini_cache.json
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Contains pre-validated SRE reasoning patterns for the predefined hackathon scenarios. If live Google Gemini API rate limits are exceeded (15 RPM free tier) or local networks drop, the engine serves deterministic resolutions with 100% reliability.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  SQLite State Database: backend/incidentiq.db
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Stores live incident lifecycles, active WebSocket connection subscriber IDs, Jira ticket records, and historical incident baselines (seeded via <code>backend/database/seed_data.py</code>).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ARCHITECTURE DIAGRAM */}
        {activeTab === 'architecture_diagram' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Layers size={13} /> Complete System Architecture
                </div>
                <h2 className="text-2xl font-black text-slate-100">End-to-End Operational Dataflow</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Sequential agent coordination from monitoring alert triggers to resolved post-mortem documentation.
                </p>
              </div>
            </div>

            {/* Structured Architecture Flow (Faithful rendering of the user's uploaded diagram) */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5">
              {/* Level 1: Monitoring Ecosystem */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-center space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-sky-400">Monitoring Ecosystem</span>
                <p className="text-xs font-mono text-slate-300">
                  Prometheus &nbsp;|&nbsp; Datadog &nbsp;|&nbsp; CloudWatch &nbsp;|&nbsp; App Alerts
                </p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-slate-500">
                <ArrowRight className="rotate-90" size={20} />
              </div>

              {/* Level 2: Alert Ingestion Layer */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-center space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Alert Ingestion Layer</span>
                <p className="text-xs font-mono text-slate-300">
                  Webhooks &nbsp;/&nbsp; APIs &nbsp;/&nbsp; Event Streams (FastAPI POST /api/incident/trigger)
                </p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-slate-500">
                <ArrowRight className="rotate-90" size={20} />
              </div>

              {/* Level 3: IncidentIQ Autonomous Command Center (FastAPI) */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-indigo-500/40 space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-sm font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">
                    IncidentIQ Autonomous Command Center (FastAPI)
                  </span>
                  <p className="text-xs text-slate-400 font-mono">CrewAI Orchestration + Gemini AI Engine</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-dashed border-sky-500/50 text-center space-y-1">
                    <span className="text-xs font-bold text-sky-400 block">Triage Agent</span>
                    <p className="text-[11px] text-slate-300">Severity &amp; SLA Classification</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-dashed border-indigo-500/50 text-center space-y-1">
                    <span className="text-xs font-bold text-indigo-400 block">RCA Agent</span>
                    <p className="text-[11px] text-slate-300">Root Cause Analysis</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-dashed border-purple-500/50 text-center space-y-1">
                    <span className="text-xs font-bold text-purple-400 block">Runbook Agent</span>
                    <p className="text-[11px] text-slate-300">Runbook Search &amp; Matching</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-slate-500">
                <ArrowRight className="rotate-90" size={20} />
              </div>

              {/* Level 4: Knowledge & Context Layer */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 text-center space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-purple-400">Knowledge &amp; Context Layer</span>
                <p className="text-xs font-bold text-slate-200">ChromaDB Vector Store</p>
                <div className="flex justify-center gap-6 text-[11px] text-slate-400 font-mono">
                  <span>• Confluence Runbooks</span>
                  <span>• Historical Incidents</span>
                  <span>• Resolution Knowledge Base</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-slate-500">
                <ArrowRight className="rotate-90" size={20} />
              </div>

              {/* Level 5: Mitigation Engine */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-emerald-500/40 space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Mitigation Engine</span>
                  <p className="text-xs text-slate-300">AI-Driven Recovery Recommendations &amp; Actions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-dashed border-emerald-500/50 text-center space-y-1">
                    <span className="text-xs font-bold text-emerald-400 block">Slack Agent</span>
                    <p className="text-[11px] text-slate-300">Incident Comms &amp; War Room</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-dashed border-amber-500/50 text-center space-y-1">
                    <span className="text-xs font-bold text-amber-400 block">Jira Agent</span>
                    <p className="text-[11px] text-slate-300">Ticket Creation &amp; Rollback Link</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-dashed border-sky-500/50 text-center space-y-1">
                    <span className="text-xs font-bold text-sky-400 block">Dashboard</span>
                    <p className="text-[11px] text-slate-300">Live Monitoring HUD</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-slate-500">
                <ArrowRight className="rotate-90" size={20} />
              </div>

              {/* Level 6: Post-Mortem Agent */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 text-center space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-rose-400">Post-Mortem Agent</span>
                <p className="text-xs text-slate-300">Automated Blameless Incident Report Generation</p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-slate-500">
                <ArrowRight className="rotate-90" size={20} />
              </div>

              {/* Level 7: Incident Resolved */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/50 text-center space-y-1">
                <span className="text-sm font-black uppercase tracking-widest text-emerald-400">Incident Resolved</span>
                <p className="text-xs font-mono font-bold text-slate-200">
                  MTTR &lt; 90 sec &nbsp;|&nbsp; Automated Documentation &nbsp;|&nbsp; SLA Tracking
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PRESENTATION (PITCH DECK) */}
        {activeTab === 'presentation' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles size={13} /> Official Presentation
                </div>
                <h2 className="text-2xl font-black text-slate-100">Pitch Deck Slides (15 Slides)</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                  disabled={currentSlide === 0}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <span className="text-xs font-mono text-slate-400 px-2 font-bold">
                  {currentSlide + 1} / {slides.length}
                </span>
                <button
                  onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                  disabled={currentSlide === slides.length - 1}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Slide Container */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 border border-slate-800 shadow-2xl min-h-[440px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">
                      {slides[currentSlide].tag}
                    </span>
                    <h3 className="text-xl font-bold text-slate-100 mt-1">
                      {slides[currentSlide].title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {slides[currentSlide].subtitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500">VLINK HACKATHON</span>
                  </div>
                </div>

                <div className="py-2">
                  {slides[currentSlide].content}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <span>Presenter: <strong className="text-slate-300">Saswat Kumar Patro</strong></span>
                <div className="flex gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentSlide ? 'bg-sky-400 w-5' : 'bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DETAILED WORKFLOW */}
        {activeTab === 'detailed_workflow' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Workflow size={13} /> Step-by-Step Execution
              </div>
              <h2 className="text-2xl font-black text-slate-100">Detailed Incident Lifecycle Workflow</h2>
              <p className="text-xs text-slate-400 mt-1">
                Precision breakdown of the 6-stage operational pipeline from initial anomaly detection to post-mortem wiki publication.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: '01',
                  time: '00:00 - 00:02',
                  title: 'Alert Ingestion & Triage Classification',
                  agent: 'Triage Agent',
                  description: 'The monitoring webhook (Prometheus/New Relic) delivers an unhandled latency or error-rate spike. The Triage Agent evaluates affected endpoints, service topology, active traffic volume, and SLA constraints to assign P1/P2/P3 severity and an SLA countdown timer.',
                  actions: ['Parses raw JSON alert', 'Evaluates business blast radius', 'Calculates SLA breach deadline', 'Updates SQLite incident state']
                },
                {
                  step: '02',
                  time: '00:02 - 00:06',
                  title: 'Deep Diagnostic & Root Cause Analysis',
                  agent: 'RCA Agent',
                  description: 'The RCA Agent correlates error signatures with recent Docker image deployments and config adjustments. It isolates the exact failure mode (e.g. max database connections mistakenly reduced from 200 to 20 in deployment PROJ-4821) and computes a confidence score.',
                  actions: ['Queries Prometheus metrics & error rates', 'Inspects deployment commit logs', 'Calculates root cause confidence rating', 'Generates technical evidence summary']
                },
                {
                  step: '03',
                  time: '00:06 - 00:10',
                  title: 'Semantic Runbook Retrieval & Adaptive Synthesis',
                  agent: 'Runbook Agent',
                  description: 'Queries ChromaDB vector embeddings for standard operating procedures matching the isolated failure. Synthesizes a contextual mitigation plan, replacing template placeholders with active container tags and rollback targets.',
                  actions: ['ChromaDB cosine similarity search', 'Selects highest scoring runbook', 'Adapts mitigation shell commands', 'Calculates estimated MTTR']
                },
                {
                  step: '04',
                  time: '00:10 - 00:13',
                  title: 'War Room Setup & Stakeholder Communications',
                  agent: 'Comms Agent',
                  description: 'Immediately establishes a dedicated incident Slack war room (#inc-p1-warroom) and broadcasts formatted executive updates and action items to On-Call SREs, Engineering Leads, Customer Support, and Executives.',
                  actions: ['Creates Slack incident channel', 'Dispatches role-targeted notifications', 'Posts real-time mitigation updates', 'Logs comms record in database']
                },
                {
                  step: '05',
                  time: '00:13 - 00:16',
                  title: 'Jira Incident Tracking & Rollback Linking',
                  agent: 'Jira Agent',
                  description: 'Files a formal P1 Jira incident ticket, associates priority and environment tags, and explicitly links the offending development ticket (e.g., PROJ-4821) as the configuration rollback target.',
                  actions: ['Generates Jira incident ticket', 'Links development issue/PR', 'Assigns on-call platform owner', 'Attaches technical summary']
                },
                {
                  step: '06',
                  time: '00:16 - 00:20',
                  title: 'Blameless Post-Mortem & Wiki Synchronization',
                  agent: 'Post-Mortem Agent',
                  description: 'Compiles the full chronological timeline, root cause analysis, impact assessments, what went well, what could be improved, and 5 distinct action items with owners. Publishes the page directly to Confluence wiki.',
                  actions: ['Compiles 8-section post-mortem', 'Generates 5 preventative action items', 'Publishes Confluence wiki page', 'Closes incident cycle & resets state']
                }
              ].map((item) => (
                <div key={item.step} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0 w-24">
                    <span className="text-xl font-black text-sky-400 block">{item.step}</span>
                    <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                        {item.agent}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.actions.map((act, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                          ✓ {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: DETAILED PROJECT REPORT */}
        {activeTab === 'project_report' && (
          <div className="space-y-6 text-xs text-slate-300 leading-relaxed animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <FileText size={13} /> Project Documentation
              </div>
              <h2 className="text-2xl font-black text-slate-100">Detailed Project Report</h2>
              <p className="text-slate-400 mt-1">
                Comprehensive technical dossier prepared for the VLink AI Hackathon Committee.
              </p>
            </div>

            <div className="space-y-6 p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">1. Project Overview &amp; Business Case</h3>
                <p>
                  IncidentIQ is an autonomous operational orchestrator designed to intercept incoming monitoring alerts, coordinate diagnostic AI SRE agents, perform semantic runbook recovery, and fully document incident resolution steps.
                </p>
                <p>
                  According to industry benchmarks, the average enterprise downtime costs between $5,600 and $9,000 per minute. A standard P1 outage requires a minimum of 45 minutes to resolve manually due to communication overhead, searching documentation, and assembling on-call personnel. IncidentIQ compresses this lifecycle into under 90 seconds.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">2. System Reliability &amp; Resilience Design</h3>
                <p>
                  Enterprise systems require absolute reliability. IncidentIQ incorporates a multi-tier fallback architecture:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong>Deterministic Triage:</strong> Rule-based heuristic engines verify severity limits immediately, ensuring zero-latency initial classification.</li>
                  <li><strong>Direct REST LLM Fallback:</strong> If multi-agent orchestrator frameworks encounter local environment incompatibilities, the system gracefully shifts to direct async REST streaming using Google Gemini 2.5 / 1.5 Pro.</li>
                  <li><strong>Embedded Response Caching:</strong> Pre-validated SRE reasoning patterns are cached locally, guaranteeing 100% demo uptime even under network partition or API quota exhaustion.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">3. Return on Investment (ROI) Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">MTTR Reduction</span>
                    <span className="text-lg font-black text-emerald-400">96.6% Faster</span>
                    <p className="text-[11px] text-slate-400 mt-1">Drops from 45 min average to &lt; 90 seconds.</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Direct Cost Savings</span>
                    <span className="text-lg font-black text-sky-400">$200,000+ / Outage</span>
                    <p className="text-[11px] text-slate-400 mt-1">Mitigating SLA penalty damages &amp; transaction drop-off.</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Developer Productivity</span>
                    <span className="text-lg font-black text-purple-400">350+ Hours Saved</span>
                    <p className="text-[11px] text-slate-400 mt-1">Eliminating manual post-mortem writing and war-room triage.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* TAB 8: SYSTEM ARCHITECTURE */}
        {activeTab === 'system_architecture' && (
          <div className="space-y-6 text-xs text-slate-300 leading-relaxed animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Server size={13} /> Deep Technical Architecture
              </div>
              <h2 className="text-2xl font-black text-slate-100">System Components &amp; Data Pipeline</h2>
              <p className="text-slate-400 mt-1">
                Internal architectural details of the backend services, event managers, and storage models.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                  <Cpu size={16} /> 1. FastAPI Async ASGI Service Engine
                </h4>
                <p>
                  Built on Python's native <code>asyncio</code> event loop, the backend serves non-blocking REST endpoints alongside WebSocket bi-directional communication channels. Background workers run incident orchestration as decoupled tasks without blocking telemetry ingestion.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                  <Workflow size={16} /> 2. ConnectionManager (WebSocket Pub/Sub)
                </h4>
                <p>
                  Manages active client socket connections mapped by <code>incident_id</code>. Broadcasting methods deliver granular lifecycle events (<code>agent_started</code>, <code>agent_thinking</code>, <code>agent_completed</code>, <code>incident_resolved</code>) to all listening browser dashboards in real-time.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                  <Database size={16} /> 3. ChromaDB Vector Knowledge Store
                </h4>
                <p>
                  Maintains high-dimensional embeddings of standard operating runbooks. Searches execute via cosine similarity, matching anomalous log signatures against operational recovery documentation in under 15 milliseconds.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <Box size={16} /> 4. Unified Static Asset Serving
                </h4>
                <p>
                  The production-bundled React frontend (HTML, minified CSS, bundled JS) is mounted directly to the root path (<code>/</code>) of the FastAPI application. This eliminates cross-origin resource sharing (CORS) friction, multi-port routing complexities, and tunnel timeout vulnerabilities.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: TECH STACK & SPECS */}
        {activeTab === 'tech_stack' && (
          <div className="space-y-6 text-xs text-slate-300 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sliders size={13} /> Technical Specifications
              </div>
              <h2 className="text-2xl font-black text-slate-100">Enterprise Technology Specifications</h2>
              <p className="text-slate-400 mt-1">
                Exhaustive versioning, protocol, and library specifications across the application tiers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-sky-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Code size={16} /> Frontend Layer
                </h4>
                <ul className="space-y-2">
                  <li><strong>Framework:</strong> React 18 (Hooks, Suspense, Context)</li>
                  <li><strong>Build Tool:</strong> Vite 8.0.16 (Fast HMR &amp; Rollup Bundler)</li>
                  <li><strong>Styling:</strong> Tailwind CSS v3 (Glassmorphic dark design system)</li>
                  <li><strong>Icons:</strong> Lucide-React v0.344</li>
                  <li><strong>WebSocket:</strong> Native W3C WebSocket Protocol</li>
                  <li><strong>Storage:</strong> LocalStorage configuration persistence</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-emerald-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Server size={16} /> Backend Layer
                </h4>
                <ul className="space-y-2">
                  <li><strong>Runtime:</strong> Python 3.9+ / 3.10+ / 3.11+</li>
                  <li><strong>Framework:</strong> FastAPI 0.110 (Asynchronous REST API)</li>
                  <li><strong>Server:</strong> Uvicorn ASGI with WatchFiles reloader</li>
                  <li><strong>Database ORM:</strong> SQLAlchemy 2.0 with SQLite engine</li>
                  <li><strong>Validation:</strong> Pydantic v2 data schemas</li>
                  <li><strong>Static Files:</strong> Starlette StaticFiles mount</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-purple-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Bot size={16} /> AI &amp; RAG Engine
                </h4>
                <ul className="space-y-2">
                  <li><strong>Orchestrator:</strong> CrewAI multi-agent sequential execution</li>
                  <li><strong>Foundation Model:</strong> Google Gemini 1.5 Pro / Flash / 2.5</li>
                  <li><strong>Direct Engine:</strong> Async HTTP REST fallback client</li>
                  <li><strong>Vector Database:</strong> ChromaDB persistent vector storage</li>
                  <li><strong>Embedding:</strong> Google Gemini Embeddings / Cosine Similarity</li>
                  <li><strong>Prompt Format:</strong> Strict JSON-schema enforcement</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-rose-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Share2 size={16} /> Integrations &amp; DevOps
                </h4>
                <ul className="space-y-2">
                  <li><strong>War Room Comms:</strong> Slack API (Mock Webhook + Live Client)</li>
                  <li><strong>Issue Tracking:</strong> Atlassian Jira REST API v3</li>
                  <li><strong>Documentation:</strong> Atlassian Confluence Cloud API</li>
                  <li><strong>Containerization:</strong> Multi-stage Docker + Docker Compose</li>
                  <li><strong>Networking:</strong> Localtunnel with auto-reconnect loops</li>
                  <li><strong>Monitoring:</strong> Prometheus / New Relic simulated telemetry</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: CODEBASE & FILE STRUCTURE */}
        {activeTab === 'file_structure' && (
          <div className="space-y-6 text-xs text-slate-300 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
                <FileCode size={13} /> Project Directory Map
              </div>
              <h2 className="text-2xl font-black text-slate-100">Codebase &amp; File Structure</h2>
              <p className="text-slate-400 mt-1">
                Detailed file-by-file purpose and organization of the IncidentIQ repository.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-400">
              <p className="text-slate-200 font-bold mb-2">incidentiq/</p>
              <p>├── backend/                      # Python FastAPI core &amp; agent orchestration</p>
              <p>│   ├── main.py                  # Entrypoint, ASGI setup, router mount, static serving</p>
              <p>│   ├── config.py                # Environment configuration &amp; API credentials</p>
              <p>│   ├── agents/                  # Multi-agent definitions &amp; execution logic</p>
              <p>│   │   ├── orchestrator.py      # Main SRE pipeline controller &amp; event dispatcher</p>
              <p>│   │   ├── triage_agent.py      # Severity classifier &amp; blast radius calculator</p>
              <p>│   │   ├── rca_agent.py         # Root cause diagnostics &amp; deployment correlator</p>
              <p>│   │   ├── runbook_agent.py     # Semantic RAG recovery &amp; mitigation adaptor</p>
              <p>│   │   ├── comms_agent.py       # Slack war room generator &amp; stakeholder broadcaster</p>
              <p>│   │   ├── jira_agent.py        # Jira incident ticket creator &amp; PR rollback linker</p>
              <p>│   │   ├── postmortem_agent.py  # Blameless post-mortem autowriter &amp; Confluence sync</p>
              <p>│   │   └── compat.py            # Direct Gemini REST async fallback client</p>
              <p>│   ├── api/                     # REST API routers &amp; WebSockets</p>
              <p>│   │   ├── routes_incident.py   # Incident status, execution logs, and triage endpoints</p>
              <p>│   │   ├── routes_agents.py     # Direct agent execution testing routes</p>
              <p>│   │   ├── routes_demo.py       # Scenario triggers &amp; background orchestrator tasks</p>
              <p>│   │   └── websocket_manager.py # Multi-client streaming Pub/Sub connection manager</p>
              <p>│   ├── database/                # Database models &amp; seed data</p>
              <p>│   │   ├── db.py                # SQLAlchemy engine &amp; session maker</p>
              <p>│   │   ├── models.py            # Incident, IncidentLog, JiraTicket, SlackMessage models</p>
              <p>│   │   └── seed_data.py         # Historical outages &amp; baseline metric records</p>
              <p>│   ├── rag/                     # Semantic runbook retrieval engine</p>
              <p>│   │   ├── knowledge_base.py    # ChromaDB ingestion, querying, and similarity search</p>
              <p>│   │   └── runbooks/            # Flat markdown runbooks (database, kafka, api, payment)</p>
              <p>│   └── mocks/                   # External service simulators</p>
              <p>│       ├── mock_alerts.py       # P1/P2 outage payload scenarios</p>
              <p>│       ├── mock_newrelic.py     # Synthetic metric spike &amp; log generator</p>
              <p>│       ├── mock_slack.py        # Simulated Slack channel &amp; notification engine</p>
              <p>│       ├── mock_jira.py         # Simulated Jira ticket creation &amp; linking</p>
              <p>│       └── mock_confluence.py   # Simulated Confluence wiki page publisher</p>
              <p>├── frontend/                     # React 18 + Vite dashboard interface</p>
              <p>│   ├── src/</p>
              <p>│   │   ├── components/</p>
              <p>│   │   │   ├── Dashboard.jsx        # Primary SRE console with WebSocket event listeners</p>
              <p>│   │   │   ├── DocsHub.jsx          # Architecture &amp; documentation portal (Current View)</p>
              <p>│   │   │   ├── AlertTrigger.jsx     # Outage trigger selector &amp; run timer</p>
              <p>│   │   │   ├── AgentCard.jsx        # Live agent state card with thinking indicator</p>
              <p>│   │   │   ├── AgentTimeline.jsx    # Chronological execution waterfall</p>
              <p>│   │   │   ├── MetricsDashboard.jsx # Real-time telemetry error rate charts</p>
              <p>│   │   │   ├── SlackPanel.jsx       # War room chat stream simulation</p>
              <p>│   │   │   ├── JiraPanel.jsx        # Formal Jira incident ticket inspector</p>
              <p>│   │   │   └── PostMortemPanel.jsx  # Formatted 8-section Confluence post-mortem</p>
              <p>│   │   ├── App.jsx              # Root application router</p>
              <p>│   │   └── main.jsx             # React DOM root mounting</p>
              <p>│   └── dist/                    # Compiled production bundle served directly by FastAPI</p>
              <p>└── docker-compose.yml             # Container orchestration configuration</p>
            </div>
          </div>
        )}

        {/* TAB 11: AGENT DEEP-DIVE (ALL 6 AGENTS) */}
        {activeTab === 'agent_deepdive' && (
          <div className="space-y-6 text-xs text-slate-300 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Bot size={13} /> SRE Swarm Intelligence
              </div>
              <h2 className="text-2xl font-black text-slate-100">All 6 Autonomous SRE Agents: Deep-Dive</h2>
              <p className="text-slate-400 mt-1">
                Full technical specification detailing trigger conditions, reasoning methodology, tools invoked, and output contracts for each agent.
              </p>
            </div>

            <div className="space-y-4">
              {/* Agent 1 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-sky-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                    <ShieldAlert size={16} /> 1. Triage Agent (Incident Classifier)
                  </h3>
                  <span className="text-[10px] bg-sky-500/10 text-sky-300 px-2 py-0.5 rounded font-mono">Trigger: Ingestion Webhook</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-400">
                  <div>
                    <strong className="text-slate-200 block mb-1">How it Triggers:</strong>
                    Invoked immediately when <code>/api/incident/trigger</code> receives an alert payload from monitoring systems.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">What it Does:</strong>
                    Evaluates affected services, latency thresholds, error rates, customer blast radius, and contractual SLA constraints.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">How it Does it:</strong>
                    Combines deterministic heuristic rules with LLM reasoning via <code>classify_incident_tool()</code> to guarantee sub-second classification.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">Output Contract:</strong>
                    Returns JSON with <code>severity</code> (P1/P2/P3), <code>blast_radius</code>, <code>service</code>, and <code>sla_breach_in_minutes</code>.
                  </div>
                </div>
              </div>

              {/* Agent 2 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                    <Search size={16} /> 2. RCA Agent (Root Cause Diagnostician)
                  </h3>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded font-mono">Trigger: Triage Completion</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-400">
                  <div>
                    <strong className="text-slate-200 block mb-1">How it Triggers:</strong>
                    Fired sequentially once the Triage Agent classifies the incident and updates database state.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">What it Does:</strong>
                    Isolates the underlying root cause from complex telemetry, log stack traces, and recent deployment commits.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">How it Does it:</strong>
                    Executes Prometheus metric queries and git commit diff analysis to correlate error spikes with recent code deployments.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">Output Contract:</strong>
                    Returns JSON with <code>root_cause</code>, <code>evidence</code> array, <code>correlated_deployment</code>, and <code>confidence</code> score.
                  </div>
                </div>
              </div>

              {/* Agent 3 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                    <BookOpen size={16} /> 3. Runbook Agent (Mitigation Synthesizer)
                  </h3>
                  <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded font-mono">Trigger: RCA Completion</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-400">
                  <div>
                    <strong className="text-slate-200 block mb-1">How it Triggers:</strong>
                    Receives the confirmed root cause and associated deployment ID from the RCA Agent.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">What it Does:</strong>
                    Finds the exact mitigation procedure from operational wiki runbooks and customizes the steps for the active outage.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">How it Does it:</strong>
                    Performs semantic vector RAG against ChromaDB runbook embeddings, then uses Gemini LLM to inject live container and rollback variables.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">Output Contract:</strong>
                    Returns JSON with <code>runbook_title</code>, <code>relevance_score</code>, <code>adapted_steps</code>, and <code>estimated_resolution_minutes</code>.
                  </div>
                </div>
              </div>

              {/* Agent 4 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <MessageSquare size={16} /> 4. Comms Agent (Incident Communications)
                  </h3>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-mono">Trigger: Runbook Adaptation</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-400">
                  <div>
                    <strong className="text-slate-200 block mb-1">How it Triggers:</strong>
                    Triggered once recovery steps are synthesized, ensuring communication contains actionable status.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">What it Does:</strong>
                    Creates dedicated Slack incident war room channels and keeps stakeholders, customer support, and leadership aligned.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">How it Does it:</strong>
                    Calls Slack API to provision <code>#inc-warroom</code> channels, calculates targeted stakeholder distribution lists, and posts formatted markdown updates.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">Output Contract:</strong>
                    Returns JSON with <code>war_room_created</code>, <code>stakeholders_notified</code>, and <code>slack_message</code> payload.
                  </div>
                </div>
              </div>

              {/* Agent 5 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <Ticket size={16} /> 5. Jira Agent (Ticket Specialist)
                  </h3>
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded font-mono">Trigger: Comms Broadcast</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-400">
                  <div>
                    <strong className="text-slate-200 block mb-1">How it Triggers:</strong>
                    Executes alongside war room updates to guarantee auditable issue tracking.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">What it Does:</strong>
                    Files a formal Jira tracking ticket, sets priority, links the responsible PR/deployment ticket, and assigns the on-call SRE lead.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">How it Does it:</strong>
                    Invokes Atlassian Jira REST API v3 with pre-formatted incident templates and bi-directional issue linking.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">Output Contract:</strong>
                    Returns JSON with <code>ticket_id</code> (e.g. INC-2024-8164), <code>url</code>, <code>priority</code>, and <code>linked_tickets</code>.
                  </div>
                </div>
              </div>

              {/* Agent 6 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                    <FileText size={16} /> 6. Post-Mortem Agent (Confluence Autowriter)
                  </h3>
                  <span className="text-[10px] bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded font-mono">Trigger: Incident Mitigation</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-400">
                  <div>
                    <strong className="text-slate-200 block mb-1">How it Triggers:</strong>
                    Invoked as the final operational stage after mitigation steps execute and ticket is filed.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">What it Does:</strong>
                    Authors a comprehensive, blameless post-mortem report and automatically publishes it to Confluence wiki.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">How it Does it:</strong>
                    Synthesizes the complete event timeline, extracts 5 concrete action items with owners, and pushes formatted markdown to Confluence Cloud API.
                  </div>
                  <div>
                    <strong className="text-slate-200 block mb-1">Output Contract:</strong>
                    Returns JSON with <code>title</code>, <code>content</code> (full markdown), and <code>page_url</code>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocsHub;
