import React from 'react';
import { ExternalLink, Tag, ShieldAlert } from 'lucide-react';

const JiraPanel = ({ ticket }) => {
  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-slate-500 italic text-sm border border-dashed border-slate-800 rounded-2xl">
        <span>No incident ticket logged yet.</span>
        <span className="text-xs mt-1">Run an incident trigger to generate Jira tracking records.</span>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (String(priority).toLowerCase()) {
      case 'critical':
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 flex flex-col h-full space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-brand-accent text-xs font-bold font-mono tracking-wider uppercase bg-brand-accent/10 px-2 py-0.5 rounded">
            {ticket.ticket_id}
          </span>
          <h4 className="text-slate-100 font-bold mt-1.5 leading-snug">{ticket.title}</h4>
        </div>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/30"
        >
          <span>Open Jira</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Attributes */}
      <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/40">
        <div>
          <span className="text-slate-500 block font-semibold uppercase tracking-wide mb-1">Status</span>
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded font-bold">
            OPEN
          </span>
        </div>
        <div>
          <span className="text-slate-500 block font-semibold uppercase tracking-wide mb-1">Priority</span>
          <span className={`border px-2.5 py-0.5 rounded font-bold ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </span>
        </div>
        <div className="col-span-2">
          <span className="text-slate-500 block font-semibold uppercase tracking-wide mb-1">Assignee</span>
          <span className="text-slate-300 font-semibold">{ticket.assignee || "platform-oncall@company.com"}</span>
        </div>
      </div>

      {/* Description */}
      <div className="flex-1 overflow-y-auto text-xs leading-relaxed text-slate-300 space-y-3 pr-1">
        <div>
          <span className="text-slate-500 font-bold block mb-1">EXECUTIVE SUMMARY</span>
          <p className="bg-slate-950/20 p-2.5 rounded border border-slate-800/30">
            {ticket.description}
          </p>
        </div>

        {ticket.linked_tickets && ticket.linked_tickets.length > 0 && (
          <div>
            <span className="text-slate-500 font-bold block mb-1">LINKED DEVELOPMENT ISSUES</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {ticket.linked_tickets.map((t) => (
                <span key={t} className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded font-mono text-[10px] border border-slate-700/40 flex items-center gap-1.5">
                  <ShieldAlert size={10} className="text-red-400" />
                  {t} (Config Rollback Target)
                </span>
              ))}
            </div>
          </div>
        )}

        {ticket.labels && ticket.labels.length > 0 && (
          <div>
            <span className="text-slate-500 font-bold block mb-1">LABELS</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {ticket.labels.map((l) => (
                <span key={l} className="bg-slate-950 text-slate-400 px-2 py-0.5 rounded-md text-[10px] border border-slate-800 flex items-center gap-1">
                  <Tag size={8} />
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JiraPanel;
