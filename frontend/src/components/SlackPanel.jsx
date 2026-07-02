import React from 'react';
import { Hash, Send, Users, ExternalLink } from 'lucide-react';

const SlackPanel = ({ channelName, messageText, stakeholders }) => {
  if (!messageText) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-slate-500 italic text-sm border border-dashed border-slate-800 rounded-2xl">
        <span>No Slack messages broadcasted yet.</span>
        <span className="text-xs mt-1">Run an incident trigger to monitor war room notifications.</span>
      </div>
    );
  }

  const formatStakeholders = () => {
    if (!stakeholders || stakeholders.length === 0) return "@channel";
    return stakeholders.map(s => `@${s}`).join(", ");
  };

  return (
    <div className="bg-[#1A1D21] text-[#D1D2D3] rounded-2xl border border-slate-800 flex flex-col h-full overflow-hidden font-sans">
      {/* Slack Header */}
      <div className="bg-[#121519] border-b border-[#2A2E33] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash size={18} className="text-[#3b82f6]" />
          <span className="font-bold text-slate-200 text-sm tracking-wide">{channelName || "#inc-general"}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Users size={12} />
            <span>8 active</span>
          </div>
          <button
            onClick={(e) => e.preventDefault()}
            className="hover:text-slate-200 flex items-center gap-1 bg-slate-800/50 px-2.5 py-1 rounded"
          >
            <span>Launch Slack</span>
            <ExternalLink size={10} />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs leading-relaxed">
        {/* System Message */}
        <div className="text-center">
          <span className="bg-[#2A2E33]/40 text-slate-400 px-3 py-1 rounded-full text-[10px]">
            Today — channel created by IncidentIQ Automated SRE Agent
          </span>
        </div>

        {/* Bot Message */}
        <div className="flex items-start gap-3">
          {/* Bot Avatar */}
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0">
            IQ
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm">IncidentIQ Bot</span>
              <span className="bg-[#2A2E33] text-blue-400 text-[9px] font-bold px-1.5 py-0.25 rounded">
                APP
              </span>
              <span className="text-[10px] text-slate-500">2:47 AM</span>
            </div>
            
            <div className="bg-[#222529] border border-[#2A2E33] rounded-lg p-3 space-y-2 text-slate-200">
              <div className="font-mono whitespace-pre-wrap leading-relaxed text-xs">
                {messageText}
              </div>
              
              <div className="border-t border-[#2A2E33] pt-2 mt-2 flex flex-col gap-1 text-[11px] text-slate-400">
                <div>
                  <span className="text-amber-400 font-semibold">Stakeholders Notified: </span>
                  <span className="font-mono text-slate-300 bg-slate-950/40 px-1 py-0.5 rounded">
                    {formatStakeholders()}
                  </span>
                </div>
                <div>
                  <span className="text-blue-400 font-semibold">Next Step: </span>
                  <span>Executing adapted SRE runbook commands.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation update */}
        <div className="flex items-start gap-3 opacity-60">
          <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
            SL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Sarah Lee</span>
              <span className="text-[10px] text-slate-500">2:48 AM</span>
            </div>
            <p className="text-slate-400 mt-1">
              Acknowledged. I see the rollback was already identified and prepared. Approving rollback execution now.
            </p>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="p-3 bg-[#121519] border-t border-[#2A2E33] flex items-center gap-2">
        <div className="flex-1 bg-[#222529] border border-[#2A2E33] rounded-md px-3 py-2 text-xs text-slate-500 flex items-center justify-between">
          <span>Reply to IncidentIQ Bot...</span>
          <Send size={12} className="text-slate-600" />
        </div>
      </div>
    </div>
  );
};

export default SlackPanel;
