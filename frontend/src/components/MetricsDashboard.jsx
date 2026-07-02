import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, Zap, Sparkles } from 'lucide-react';

const MetricCard = ({ title, beforeValue, afterValue, improvement, isNegative, triggerAnimate }) => {
  const [displayAfter, setDisplayAfter] = useState(beforeValue);

  useEffect(() => {
    if (triggerAnimate) {
      // Just toggle a small state to trigger entrance animations
      setDisplayAfter(afterValue);
    } else {
      setDisplayAfter(beforeValue);
    }
  }, [triggerAnimate, afterValue, beforeValue]);

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 glass-card">
      <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block mb-2">
        {title}
      </span>
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-slate-500">Legacy MTTR:</span>
            <span className="line-through">{beforeValue}</span>
          </div>
          <div className={`text-base font-extrabold text-slate-100 flex items-center gap-1.5 ${triggerAnimate ? 'scale-105 transition-transform text-brand-success' : ''}`}>
            {triggerAnimate && <Zap size={14} className="text-brand-success animate-bounce" />}
            {displayAfter}
          </div>
        </div>

        <div className={`flex items-center gap-0.5 px-2 py-0.75 rounded text-[10px] font-bold border ${
          isNegative
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
        }`}>
          {isNegative ? <ArrowDown size={10} /> : <ArrowUp size={10} />}
          <span>{improvement}</span>
        </div>
      </div>
    </div>
  );
};

const MetricsDashboard = ({ isResolved }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
        <Sparkles size={12} className="text-brand-success" />
        SRE Operational ROI Metrics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Mean Time To Resolve"
          beforeValue="4.2 hours"
          afterValue="23 minutes"
          improvement="-91%"
          isNegative={true}
          triggerAnimate={isResolved}
        />
        <MetricCard
          title="Detection Time"
          beforeValue="18 minutes"
          afterValue="90 seconds"
          improvement="-91%"
          isNegative={true}
          triggerAnimate={isResolved}
        />
        <MetricCard
          title="On-Call Page Fatigue"
          beforeValue="12 pages / wk"
          afterValue="3 alerts / wk"
          improvement="-75%"
          isNegative={true}
          triggerAnimate={isResolved}
        />
        <MetricCard
          title="Post-Mortem Rate"
          beforeValue="34% logs"
          afterValue="100% autogen"
          improvement="+194%"
          isNegative={false}
          triggerAnimate={isResolved}
        />
      </div>
    </div>
  );
};

export default MetricsDashboard;
