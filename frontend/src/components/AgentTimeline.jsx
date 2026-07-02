import React from 'react';
import AgentCard from './AgentCard';

const AgentTimeline = ({ agentStates }) => {
  const agentsConfig = [
    {
      id: "triage_agent",
      name: "Triage Agent",
      role: "Senior SRE Triage Specialist",
      icon: "🚨"
    },
    {
      id: "rca_agent",
      name: "RCA Agent",
      role: "Principal Root Cause Analysis Engineer",
      icon: "🔍"
    },
    {
      id: "runbook_agent",
      name: "Runbook Agent",
      role: "Institutional Memory Specialist",
      icon: "📖"
    },
    {
      id: "comms_agent",
      name: "Comms Agent",
      role: "SRE Communications Lead",
      icon: "📢"
    },
    {
      id: "jira_agent",
      name: "Jira Agent",
      role: "Automated Ticketing Specialist",
      icon: "🎫"
    },
    {
      id: "postmortem_agent",
      name: "Post-Mortem Agent",
      role: "Post-Mortem Autowriter",
      icon: "📝"
    }
  ];

  return (
    <div className="space-y-4 relative pl-3 border-l border-slate-800">
      <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-gradient-to-b from-brand-danger via-brand-accent to-brand-success opacity-30"></div>
      
      {agentsConfig.map((agent, index) => {
        const state = agentStates[agent.id] || { status: "WAITING", thought: "", duration: 0, summary: "" };
        
        return (
          <div key={agent.id} className="relative">
            {/* Pulsing indicator node */}
            <div className={`absolute -left-[19px] top-6 w-3.5 h-3.5 rounded-full border-2 bg-slate-950 transition-all duration-300 ${
              state.status === "COMPLETE"
                ? "border-brand-success bg-brand-success/20"
                : state.status === "ACTIVE"
                  ? "border-brand-accent bg-brand-accent/20 animate-pulse"
                  : "border-slate-800 bg-slate-950"
            }`}></div>
            
            <AgentCard
              name={agent.name}
              icon={agent.icon}
              role={agent.role}
              status={state.status}
              thought={state.thought}
              duration={state.duration}
              summary={state.summary}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AgentTimeline;
