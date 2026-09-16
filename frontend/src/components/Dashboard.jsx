import React, { useState, useEffect, useRef } from 'react';
import AlertTrigger from './AlertTrigger';
import AgentTimeline from './AgentTimeline';
import JiraPanel from './JiraPanel';
import SlackPanel from './SlackPanel';
import PostMortemPanel from './PostMortemPanel';
import MetricsDashboard from './MetricsDashboard';
import { Activity, Clock, Zap, History, RefreshCw, Layers } from 'lucide-react';

const getBackendUrls = () => {
  const savedApi = localStorage.getItem("VITE_API_URL");
  const defaultBase = (typeof window !== "undefined" && window.location.port !== "3000")
    ? window.location.origin
    : (import.meta.env.VITE_API_URL || "https://incidentiq-v3-be.loca.lt");
  const apiBase = savedApi || defaultBase;
  const wsBase = apiBase.replace(/^http/, 'ws');
  return { apiBase, wsBase };
};

const { apiBase: API_BASE, wsBase: WS_BASE } = getBackendUrls();

const Dashboard = () => {
  const [scenarios, setScenarios] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeIncidentId, setActiveIncidentId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [activeTab, setActiveTab] = useState("jira");

  // Output logs from agents
  const [jiraTicket, setJiraTicket] = useState(null);
  const [slackMessage, setSlackMessage] = useState(null);
  const [slackChannel, setSlackChannel] = useState("");
  const [slackStakeholders, setSlackStakeholders] = useState([]);
  const [postmortemDoc, setPostmortemDoc] = useState(null);

  // States for all 6 agents
  const [agentStates, setAgentStates] = useState({
    triage_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
    rca_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
    runbook_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
    comms_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
    jira_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
    postmortem_agent: { status: "WAITING", thought: "", duration: 0, summary: "" }
  });

  const wsRef = useRef(null);

  // Clock Update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch scenarios and history
  const fetchScenariosAndHistory = async () => {
    try {
      const scRes = await fetch(`${API_BASE}/api/demo/scenarios`);
      const scData = await scRes.json();
      setScenarios(scData);

      const histRes = await fetch(`${API_BASE}/api/incidents/history`);
      const histData = await histRes.json();
      setHistory(histData);
    } catch (e) {
      console.error("Failed to fetch scenarios/history:", e);
    }
  };

  useEffect(() => {
    fetchScenariosAndHistory();
  }, []);

  // Reset demo environment
  const handleResetDemo = async () => {
    if (window.confirm("Are you sure you want to clear current demo runs and restore historical defaults?")) {
      try {
        setIsProcessing(false);
        setIsResolved(false);
        setActiveIncidentId(null);
        setJiraTicket(null);
        setSlackMessage(null);
        setPostmortemDoc(null);
        setAgentStates({
          triage_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
          rca_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
          runbook_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
          comms_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
          jira_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
          postmortem_agent: { status: "WAITING", thought: "", duration: 0, summary: "" }
        });
        
        const res = await fetch(`${API_BASE}/api/demo/reset`, { method: 'POST' });
        const data = await res.json();
        alert(data.message);
        fetchScenariosAndHistory();
      } catch (e) {
        console.error("Failed to reset demo:", e);
      }
    }
  };

  // Configure custom backend API URL for presentation machines
  const handleConfigureBackend = () => {
    const currentUrl = localStorage.getItem("VITE_API_URL") || "http://localhost:8000";
    const newUrl = window.prompt("Enter your Backend API URL (e.g. your localtunnel backend link):\nLeave blank to reset to default http://localhost:8000.", currentUrl);
    if (newUrl !== null) {
      const trimmed = newUrl.trim();
      if (trimmed) {
        localStorage.setItem("VITE_API_URL", trimmed);
      } else {
        localStorage.removeItem("VITE_API_URL");
      }
      window.location.reload();
    }
  };

  // Trigger scenario
  const handleTriggerIncident = async (scenarioId) => {
    try {
      setIsProcessing(true);
      setIsResolved(false);
      setJiraTicket(null);
      setSlackMessage(null);
      setPostmortemDoc(null);
      
      // Reset agent statuses to waiting
      setAgentStates({
        triage_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
        rca_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
        runbook_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
        comms_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
        jira_agent: { status: "WAITING", thought: "", duration: 0, summary: "" },
        postmortem_agent: { status: "WAITING", thought: "", duration: 0, summary: "" }
      });

      const res = await fetch(`${API_BASE}/api/incident/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: scenarioId })
      });
      const data = await res.json();
      const incId = data.incident_id;
      setActiveIncidentId(incId);

      // Connect to WebSocket endpoint
      connectWebSocket(incId);
    } catch (e) {
      console.error("Trigger failed:", e);
      setIsProcessing(false);
    }
  };

  // WebSocket Connection
  const connectWebSocket = (incId) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`${WS_BASE}/ws/incident/${incId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`[WS] Connection established for incident: ${incId}`);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("[WS] Received message:", msg);

      // Handle custom ping/pong heartbeats
      if (msg.type === "pong") return;

      const agent = msg.agent;

      switch (msg.type) {
        case "agent_started":
          setAgentStates((prev) => ({
            ...prev,
            [agent]: { ...prev[agent], status: "ACTIVE" }
          }));
          break;
          
        case "agent_thinking":
          setAgentStates((prev) => ({
            ...prev,
            [agent]: { ...prev[agent], status: "ACTIVE", thought: msg.thought }
          }));
          break;
          
        case "agent_completed":
          const res = msg.result;
          let summary = "";
          
          if (agent === "triage_agent") {
            summary = `Classified as ${res?.severity || 'unknown'} severity on service '${res?.service || 'unknown'}'. Blast radius: ${res?.blast_radius || 'unknown'}. Business impact: ${res?.business_impact || 'unknown'}. SLA limit: ${res?.sla_breach_in_minutes || 0} mins.`;
          } else if (agent === "rca_agent") {
            summary = `Identified root cause (Confidence: ${Math.round((res?.confidence || 0) * 100)}%): ${res?.root_cause || 'unknown'}. Evidence elements: ${res?.evidence?.length || 0}.`;
          } else if (agent === "runbook_agent") {
            summary = `Located runbook: '${res?.runbook_title || 'unknown'}' (Relevance: ${Math.round((res?.relevance_score || 0) * 100)}%). Adapted ${res?.adapted_steps?.length || 0} mitigation steps. Estimated resolution: ${res?.estimated_resolution_minutes || 0} minutes.`;
          } else if (agent === "comms_agent") {
            summary = `Created war room ${res?.war_room_created || 'unknown'}. Dispatched incident alerts to stakeholders: ${res?.stakeholders_notified?.join(', ') || 'none'}.`;
            setSlackChannel(res?.war_room_created || '');
            setSlackStakeholders(res?.stakeholders_notified || []);
            setSlackMessage(res?.slack_message || '');
          } else if (agent === "jira_agent") {
            summary = `Logged Jira incident ticket ${res?.ticket_id || 'unknown'} (Priority: ${res?.priority || 'unknown'}). Assigned to SRE lead and linked deployment tags.`;
            setJiraTicket(res?.result || res || {});
          } else if (agent === "postmortem_agent") {
            summary = `Generated blameless post-mortem report '${res?.title || 'unknown'}' and synchronized layout to Confluence wiki page.`;
            setPostmortemDoc({ content: res?.content || '', page_url: res?.page_url || '' });
          }

          setAgentStates((prev) => ({
            ...prev,
            [agent]: {
              status: "COMPLETE",
              thought: "",
              duration: msg.duration_seconds || 0,
              summary: summary
            }
          }));
          break;
          
        case "incident_resolved":
          console.log("[WS] Incident resolved. Closing socket.");
          setIsProcessing(false);
          setIsResolved(true);
          ws.close();
          fetchScenariosAndHistory();
          break;
          
        case "incident_failed":
          console.error("[WS] Incident execution failed.");
          setIsProcessing(false);
          ws.close();
          alert("Incident execution failed. Review backend server logs.");
          break;
          
        default:
          break;
      }
    };

    ws.onclose = () => {
      console.log(`[WS] Connection closed for: ${incId}`);
    };

    ws.onerror = (err) => {
      console.error("[WS] Socket error:", err);
    };
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-lg shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            ⚡
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              IncidentIQ
              <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.25 rounded font-black font-mono">
                SRE COMMAND
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">Autonomous SRE Incident Commander</p>
          </div>
        </div>

        {/* Live system state banner */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 border px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-500 ${
            isProcessing
              ? 'bg-red-500/10 text-red-400 border-red-500/25 glow-alert-active'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
            <span>{isProcessing ? "🚨 P1 OUTAGE IN PROGRESS" : "✓ ALL SYSTEMS OPERATIONAL"}</span>
          </div>

          <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5 bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-700/20">
            <Clock size={12} />
            <span>{currentTime || "00:00:00"}</span>
          </div>

          <button
            onClick={handleResetDemo}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-transparent hover:border-slate-700/40 transition-all"
            title="Reset simulation environment"
          >
            <RefreshCw size={14} />
          </button>

          <button
            onClick={handleConfigureBackend}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-transparent hover:border-slate-700/40 transition-all"
            title="Configure Backend Connection"
          >
            <Layers size={14} />
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] w-full mx-auto">
        {/* Left Side Column: Config & History (3 cols) */}
        <section className="lg:col-span-3 space-y-6">
          <AlertTrigger
            scenarios={scenarios}
            onTrigger={handleTriggerIncident}
            isProcessing={isProcessing}
            currentScenarioId={activeIncidentId}
          />

          {/* Historical Logs List */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col max-h-[350px]">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <History size={13} />
              Simulation Outage History
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {history.map((inc) => (
                <div key={inc.id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 hover:border-slate-700/50 transition-colors flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.25 rounded text-[10px] font-black ${
                        inc.severity === "P1" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="text-slate-350 font-bold font-mono tracking-tight text-[10px]">
                        {inc.service_name}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] truncate leading-tight">{inc.summary_preview}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 block font-semibold">MTTR</span>
                    <span className="font-extrabold text-brand-success">{inc.mttr_minutes}m</span>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-slate-600 text-xs italic text-center py-4">No simulations registered.</div>
              )}
            </div>
          </div>
        </section>

        {/* Center Column: SRE Agent Execution Feed (5 cols) */}
        <section className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 h-full flex flex-col">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Activity className="text-brand-accent animate-pulse-slow" size={16} />
              Autonomous SRE Crew Agent Feed
            </h3>
            <div className="flex-1 overflow-y-auto pr-1">
              <AgentTimeline agentStates={agentStates} />
            </div>
          </div>
        </section>

        {/* Right Column: Output Tabs (4 cols) */}
        <section className="lg:col-span-4 flex flex-col min-h-[500px]">
          <div className="flex-1 p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col overflow-hidden">
            {/* Tabs Selector Bar */}
            <div className="flex border-b border-slate-800 pb-3 mb-4 gap-1.5">
              <button
                onClick={() => setActiveTab("jira")}
                className={`flex-1 py-2 rounded-lg font-bold text-xs transition-colors ${
                  activeTab === "jira"
                    ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
                    : "text-slate-450 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                }`}
              >
                🎫 Jira Ticket
              </button>
              <button
                onClick={() => setActiveTab("slack")}
                className={`flex-1 py-2 rounded-lg font-bold text-xs transition-colors ${
                  activeTab === "slack"
                    ? "bg-[#1A1D21] text-[#E01E5A] border border-[#E01E5A]/20"
                    : "text-slate-450 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                }`}
              >
                📢 Slack Room
              </button>
              <button
                onClick={() => setActiveTab("postmortem")}
                className={`flex-1 py-2 rounded-lg font-bold text-xs transition-colors ${
                  activeTab === "postmortem"
                    ? "bg-brand-success/10 text-brand-success border border-brand-success/20"
                    : "text-slate-450 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
                }`}
              >
                📝 Post-Mortem
              </button>
            </div>

            {/* Tabs Output Panel */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "jira" && <JiraPanel ticket={jiraTicket} />}
              {activeTab === "slack" && (
                <SlackPanel
                  channelName={slackChannel}
                  messageText={slackMessage}
                  stakeholders={slackStakeholders}
                />
              )}
              {activeTab === "postmortem" && <PostMortemPanel postmortem={postmortemDoc} />}
            </div>
          </div>
        </section>
      </main>

      {/* Bottom KPI Row */}
      <footer className="border-t border-slate-800 bg-slate-900/40 backdrop-blur-md px-6 py-4">
        <MetricsDashboard isResolved={isResolved || history.length > 3} />
      </footer>
    </div>
  );
};

export default Dashboard;
