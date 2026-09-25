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
  AlertTriangle
} from 'lucide-react';

const DocsHub = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('architecture_diagram');
  const [currentSlide, setCurrentSlide] = useState(0);

  const navItems = [
    { id: 'architecture_diagram', label: 'Architecture Diagram', icon: Layers, badge: 'Visual Blueprint' },
    { id: 'presentation', label: 'Presentation & Pitch Deck', icon: Sparkles, badge: '15 Slides' },
    { id: 'detailed_workflow', label: 'Detailed Workflow', icon: Workflow, badge: 'Step-by-Step' },
    { id: 'project_report', label: 'Detailed Project Report', icon: FileText, badge: 'Executive' },
    { id: 'system_architecture', label: 'Detailed Architecture', icon: Server, badge: 'Deep-Dive' },
    { id: 'tech_stack', label: 'Tech Stack & Specs', icon: Sliders, badge: 'Specs' },
    { id: 'file_structure', label: 'Codebase Files & Layout', icon: FileCode, badge: 'Files' },
    { id: 'agent_deepdive', label: 'Agent Deep-Dive (All 6)', icon: Bot, badge: 'Core AI' },
  ];

  // Exact 15 Presentation Slides matching the user's PDF & slides
  const slides = [
    {
      id: 1,
      title: "IncidentIQ",
      subtitle: "Autonomous Incident Command Center Powered by Multi-Agent AI",
      tag: "VLINK AI HACKATHON",
      content: (
        <div className="space-y-6 text-center py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-sky-400 font-mono text-[11px] font-bold uppercase tracking-widest border border-slate-700">
            VLINK AI HACKATHON
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white">
            Incident<span className="text-emerald-400">IQ</span>
          </h1>
          <h2 className="text-lg lg:text-xl font-bold text-slate-300 max-w-2xl mx-auto">
            Autonomous Incident Command Center Powered by Multi-Agent AI
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            An automated command center that reduces Mean Time to Resolution (MTTR) to under 90 seconds — coordinating AI agents to triage, diagnose, mitigate, and write post-mortems for outages.
          </p>
          <div className="pt-6 border-t border-slate-800/80 max-w-md mx-auto text-left">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">ARCHITECT</span>
            <span className="text-sm font-bold text-slate-200">SASWAT KUMAR PATRO</span>
            <p className="text-xs text-slate-400">Lead SRE & AI Architect • VLINK</p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Executive Summary",
      subtitle: "The Next Generation of Incident Operations",
      tag: "Slide 2 / 15",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-6">
          <div className="space-y-4 text-slate-300">
            <h3 className="text-2xl font-bold text-white">The Next Generation of Incident Operations</h3>
            <p className="text-base leading-relaxed">
              <strong className="text-white">IncidentIQ</strong> is an autonomous operational system that intercepts system alerts, correlates telemetry, and resolves issues — <span className="text-emerald-400 font-semibold">eliminating human delays in the operational loop.</span>
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-slate-800 flex items-center justify-center min-h-[220px]">
            <div className="text-center space-y-3">
              <Bot className="text-sky-400 mx-auto animate-pulse" size={48} />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Autonomous SRE Swarm</span>
              <p className="text-xs text-slate-300 font-semibold">Zero-Human Handoff Operational Loop</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Core Capabilities",
      subtitle: "Three Pillars of Autonomous Operations",
      tag: "Slide 3 / 15",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Bot size={20} />
            </div>
            <h4 className="text-sm font-bold text-white">6 Specialized AI Agents</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sequential crew running on Gemini 1.5 Pro / Flash, executing complex diagnostic logic.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Activity size={20} />
            </div>
            <h4 className="text-sm font-bold text-white">Real-Time Telemetry</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrates live metrics, historical outage DBs, and Confluence runbooks.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap size={20} />
            </div>
            <h4 className="text-sm font-bold text-white">Zero Human Handoff</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full lifecycle automation from initial alert trigger to final post-mortem.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "The SRE Challenge",
      subtitle: "The Broken Incident Response Pipeline",
      tag: "Slide 4 / 15",
      content: (
        <div className="space-y-4 py-4">
          <p className="text-xs text-slate-400">The traditional incident response pipeline suffers from four critical pain points:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
              <ShieldAlert className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h5 className="text-xs font-bold text-slate-200">Alert Fatigue</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Operations engineers are flooded with hundreds of uncorrelated alerts daily, masking critical incidents.</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
              <Clock className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h5 className="text-xs font-bold text-slate-200">High MTTR</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Finding root cause, searching wikis, and applying fixes manually takes hours every single time.</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
              <Database className="text-sky-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h5 className="text-xs font-bold text-slate-200">Knowledge Silos</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Prior incident logs and engineer comments are buried and rarely shared across teams.</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
              <FileText className="text-purple-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h5 className="text-xs font-bold text-slate-200">Missing Documentation</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">Writing blameless post-mortems is often delayed, causing organizations to lose critical learning.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "The Solution: IncidentIQ",
      subtitle: "Fully Autonomous Incident Lifecycle Control",
      tag: "Slide 5 / 15",
      content: (
        <div className="space-y-6 py-4 text-center">
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            IncidentIQ intercepts every alert, runs a coordinated AI crew through diagnosis and remediation, and closes the loop with auto-generated documentation — <span className="text-emerald-400 font-bold">all in under 90 seconds.</span>
          </p>
          <div className="grid grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-lg font-black text-sky-400">1. Intercept</span>
              <p className="text-[11px] text-slate-400">Alert Ingestion</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-lg font-black text-indigo-400">2. Diagnose</span>
              <p className="text-[11px] text-slate-400">Multi-Agent RCA</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-lg font-black text-purple-400">3. Mitigate</span>
              <p className="text-[11px] text-slate-400">Parametrized Fix</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-lg font-black text-emerald-400">4. Close</span>
              <p className="text-[11px] text-slate-400">Zero-Touch Comms</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Enterprise Technology Stack",
      subtitle: "Built for Speed, Typesafety, and Reliability",
      tag: "Slide 6 / 15",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">Core Backend</span>
            <p className="text-sm font-semibold text-slate-200">Python 3.11 + FastAPI on Uvicorn</p>
            <p className="text-xs text-slate-400">For high-performance async operations and WebSocket event loops.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">SRE Agent Framework</span>
            <p className="text-sm font-semibold text-slate-200">CrewAI + Gemini 1.5 Pro</p>
            <p className="text-xs text-slate-400">For sequential, persona-driven agent workflows and diagnostics.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Vector Database</span>
            <p className="text-sm font-semibold text-slate-200">ChromaDB</p>
            <p className="text-xs text-slate-400">Storing vectorized Confluence runbooks for semantic RAG retrieval.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Frontend Interface</span>
            <p className="text-sm font-semibold text-slate-200">React.js + Tailwind CSS</p>
            <p className="text-xs text-slate-400">Delivering glassmorphic dark-theme real-time SRE dashboards.</p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "SRE Multi-Agent Crew",
      subtitle: "6 Persona-Based AI Agents Collaborating Sequentially",
      tag: "Slide 7 / 15",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-sky-400 block">01. Triage Agent</span>
            <p className="text-slate-400 text-[11px]">Classifies alert severity and verifies SLA windows.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-indigo-400 block">02. RCA Agent</span>
            <p className="text-slate-400 text-[11px]">Pulls metrics and compares telemetry against past outages.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-purple-400 block">03. Runbook Agent</span>
            <p className="text-slate-400 text-[11px]">Semantic vector search on wikis to find the correct recovery guide.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block">04. Comms Agent</span>
            <p className="text-slate-400 text-[11px]">Moderates Slack channels and broadcasts status cards.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400 block">05. Jira Agent</span>
            <p className="text-slate-400 text-[11px]">Creates tickets and records deployment change logs.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-rose-400 block">06. Post-Mortem Agent</span>
            <p className="text-slate-400 text-[11px]">Automatically generates structured blameless post-mortems.</p>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Diagnostic Workflow & Pipeline",
      subtitle: "Step-by-Step Reasoning Flow",
      tag: "Slide 8 / 15",
      content: (
        <div className="space-y-6 py-6">
          <div className="flex items-center justify-between max-w-lg mx-auto text-center">
            <div>
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-sky-400 font-bold mb-1">1</div>
              <span className="text-xs font-semibold text-slate-300">Trigger</span>
            </div>
            <ArrowRight size={16} className="text-slate-600" />
            <div>
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-indigo-400 font-bold mb-1">2</div>
              <span className="text-xs font-semibold text-slate-300">Query</span>
            </div>
            <ArrowRight size={16} className="text-slate-600" />
            <div>
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-purple-400 font-bold mb-1">3</div>
              <span className="text-xs font-semibold text-slate-300">Correlation</span>
            </div>
            <ArrowRight size={16} className="text-slate-600" />
            <div>
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-emerald-400 font-bold mb-1">4</div>
              <span className="text-xs font-semibold text-slate-300">Decision</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border-l-4 border-indigo-500 text-xs text-slate-300">
            The <strong>RCA Agent</strong> drives comparative analysis, outputting likelihood weightings to eliminate operational guesswork.
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "Comparative RCA Output",
      subtitle: "Data-Driven Root Cause Identification",
      tag: "Slide 9 / 15",
      content: (
        <div className="space-y-4 py-4">
          <span className="text-xs font-mono text-slate-400 uppercase block">Root Cause Hypotheses &amp; Likelihood %:</span>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1">
                <span>DB Pool Limitation</span>
                <span className="text-emerald-400 font-bold">85%</span>
              </div>
              <div className="w-full bg-slate-800 h-6 rounded-lg overflow-hidden flex">
                <div className="bg-emerald-500 h-full rounded-lg" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Upstream Visa Outage</span>
                <span className="text-slate-400 font-bold">10%</span>
              </div>
              <div className="w-full bg-slate-800 h-6 rounded-lg overflow-hidden flex">
                <div className="bg-sky-600/50 h-full rounded-lg" style={{ width: '10%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Expired TLS Certificate</span>
                <span className="text-slate-400 font-bold">5%</span>
              </div>
              <div className="w-full bg-slate-800 h-6 rounded-lg overflow-hidden flex">
                <div className="bg-slate-600 h-full rounded-lg" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-2">
            IncidentIQ outputs weighted likelihood scores, clearly rules out alternative causes, and recommends secondary fallbacks if primary mitigations fail.
          </p>
        </div>
      )
    },
    {
      id: 10,
      title: "Runbook Adaptation & Sync",
      subtitle: "Semantic RAG Retrieval + Enterprise Tool Sync",
      tag: "Slide 10 / 15",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 py-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-bold text-purple-400 block">1. ChromaDB Playbook Index</span>
            <p className="text-slate-400 text-[11px]">Confluence playbooks vectorized for semantic similarity matching.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-bold text-sky-400 block">2. Context Adaptation</span>
            <p className="text-slate-400 text-[11px]">Generic wiki instructions translated into parameter-mapped commands with live IDs.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 block">3. Toolchain Integration</span>
            <p className="text-slate-400 text-[11px]">Auto-creates Slack channels, logs Jira tickets with SLA bounds, writes post-mortems.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 block">4. Real-Time Dashboard</span>
            <p className="text-slate-400 text-[11px]">Glassmorphic WebSocket console broadcasting agent steps and live preview panels.</p>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: "Live Operations Console",
      subtitle: "Real-Time Agent Observation and Metric Correlation",
      tag: "Slide 11 / 15",
      content: (
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-4 py-8">
          <Activity className="text-sky-400 mx-auto" size={40} />
          <h4 className="text-lg font-bold text-white">Interactive SRE Dashboard</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Real-time multi-agent execution timeline, live simulated Prometheus metrics HUD, active war room chat, and instantaneous ticket creation.
          </p>
        </div>
      )
    },
    {
      id: 12,
      title: "Business ROI & SLA Gains",
      subtitle: "Maximizing Operations Efficiency",
      tag: "Slide 12 / 15",
      content: (
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-4xl font-black text-emerald-400">2s</span>
              <span className="text-xs font-bold text-slate-200 uppercase block">MTTD</span>
              <p className="text-[11px] text-slate-500">Mean Time to Detection — down from 15 minutes</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-4xl font-black text-purple-400">90s</span>
              <span className="text-xs font-bold text-slate-200 uppercase block">MTTR</span>
              <p className="text-[11px] text-slate-500">Mean Time to Resolution — down from 90 minutes</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-4xl font-black text-sky-400">0min</span>
              <span className="text-xs font-bold text-slate-200 uppercase block">Doc Overhead</span>
              <p className="text-[11px] text-slate-500">Post-mortem writing time — down from hours of manual effort</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
            <span>Team burnout significantly minimized by automatically filtering noisy alerts and alert storms.</span>
          </div>
        </div>
      )
    },
    {
      id: 13,
      title: "Stability & Roadmap",
      subtitle: "Scaling IncidentIQ Enterprise-Wide",
      tag: "Slide 13 / 15",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 text-xs">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-sky-400 flex items-center gap-2">
              <ShieldAlert size={16} /> Demo Reliability Strategy
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Gemini API free tier limits requests to 15 RPM. IncidentIQ pre-seeds a local JSON resolution cache mapping prompt hashes to responses — enabling 100% offline operation with zero failures during live pitches.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <Workflow size={16} /> Future Roadmap
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><strong>Live Integrations:</strong> Direct hooks to Kubernetes clusters and Terraform state.</li>
              <li><strong>Self-Healing Actions:</strong> Automated canary rollbacks and dynamic replica scaling.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 14,
      title: "Questions?",
      subtitle: "Thank you for your time and attention.",
      tag: "Slide 14 / 15",
      content: (
        <div className="text-center py-10 space-y-6">
          <h2 className="text-4xl font-black text-white">Questions?</h2>
          <p className="text-slate-400 text-sm">Thank you for your time and attention.</p>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 max-w-sm mx-auto space-y-1">
            <h3 className="text-sm font-bold text-emerald-400">Saswat Kumar Patro</h3>
            <p className="text-xs text-slate-300">Lead SRE &amp; AI Architect</p>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block pt-1">VLINK</span>
          </div>
        </div>
      )
    },
    {
      id: 15,
      title: "Image Sources & References",
      subtitle: "Attributions & Technical Assets",
      tag: "Slide 15 / 15",
      content: (
        <div className="space-y-3 py-4 text-xs font-mono text-slate-400">
          <p className="text-slate-300 font-bold mb-2">Attributions &amp; External References:</p>
          <p>• VLINK Corporate Brand &amp; Guidelines</p>
          <p>• Google Gemini 1.5 Pro / Flash Generative Models API</p>
          <p>• CrewAI Autonomous Agent Framework</p>
          <p>• ChromaDB Open-Source Embedding Vector Database</p>
          <p>• FastAPI Asynchronous High-Performance Web Framework</p>
        </div>
      )
    }
  ];

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
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/40"
              >
                Back
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
          <p>Lead Architect: <span className="text-slate-300 font-semibold">Saswat Kumar Patro</span></p>
          <p>VLink Company AI Hackathon</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-2xl overflow-y-auto">
        {/* TAB 1: EXACT ARCHITECTURE DIAGRAM (MATCHING USER IMAGE) */}
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

        {/* TAB 2: PRESENTATION (PITCH DECK) */}
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

        {/* TAB 3: DETAILED WORKFLOW */}
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

        {/* TAB 4: DETAILED PROJECT REPORT */}
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

        {/* TAB 5: SYSTEM ARCHITECTURE */}
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

        {/* TAB 6: TECH STACK & SPECS */}
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

        {/* TAB 7: CODEBASE & FILE STRUCTURE */}
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
              <p>│   │   └── runbooks/            # Markdown runbooks for DB, Kafka, API outages</p>
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

        {/* TAB 8: AGENT DEEP-DIVE (ALL 6 AGENTS) */}
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
