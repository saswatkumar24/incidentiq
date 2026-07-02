import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Clock } from 'lucide-react';

const AgentCard = ({ name, icon, role, status, thought, duration, summary, result }) => {
  const [typedThought, setTypedThought] = useState("");

  // Simulated typewriter animation for thinking state
  useEffect(() => {
    if (status === "ACTIVE" && thought) {
      setTypedThought("");
      let i = 0;
      const interval = setInterval(() => {
        setTypedThought((prev) => prev + thought.charAt(i));
        i++;
        if (i >= thought.length) {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    } else {
      setTypedThought("");
    }
  }, [status, thought]);

  const getStatusColor = () => {
    switch (status) {
      case "ACTIVE":
        return "border-brand-accent/50 bg-brand-accent/5 shadow-[0_0_15px_rgba(59,130,246,0.15)]";
      case "COMPLETE":
        return "border-brand-success/40 bg-brand-success/5";
      default:
        return "border-slate-800 bg-slate-900/40 opacity-50";
    }
  };

  return (
    <div className={`p-4 rounded-xl border glass-card transition-all duration-300 ${getStatusColor()}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`text-2xl p-2 rounded-lg ${status === 'ACTIVE' ? 'bg-brand-accent/20 animate-pulse' : 'bg-slate-800'}`}>
            {icon}
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 flex items-center gap-2">
              {name}
              {status === "ACTIVE" && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-400">{role}</p>
          </div>
        </div>

        {status === "COMPLETE" && (
          <div className="flex items-center gap-2 text-brand-success text-xs font-semibold bg-brand-success/15 px-2.5 py-1 rounded-full border border-brand-success/25">
            <CheckCircle2 size={12} />
            <span>{duration}s</span>
          </div>
        )}
        {status === "ACTIVE" && (
          <div className="flex items-center gap-1.5 text-brand-accent text-xs font-semibold bg-brand-accent/15 px-2.5 py-1 rounded-full border border-brand-accent/25 animate-pulse">
            <Play size={10} fill="currentColor" />
            <span>THINKING</span>
          </div>
        )}
        {status === "WAITING" && (
          <div className="text-slate-500 text-xs font-semibold bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700/35">
            QUEUED
          </div>
        )}
      </div>

      {/* Main active thought or completed summary output */}
      <div className="mt-3 text-sm min-h-[40px]">
        {status === "ACTIVE" && (
          <div className="font-mono text-xs text-brand-accent/90 bg-slate-950/60 p-2.5 rounded border border-brand-accent/10 whitespace-pre-wrap">
            <span className="text-brand-accent font-bold">$ </span>{typedThought}
            <span className="animate-pulse font-bold text-blue-400">|</span>
          </div>
        )}

        {status === "COMPLETE" && summary && (
          <div className="text-slate-300 bg-slate-950/45 p-2.5 rounded border border-slate-800/40 text-xs leading-relaxed">
            {summary}
          </div>
        )}
        
        {status === "WAITING" && (
          <div className="text-slate-600 italic text-xs flex items-center justify-center h-10 border border-dashed border-slate-800/50 rounded">
            Waiting for preceding execution dependencies...
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentCard;
