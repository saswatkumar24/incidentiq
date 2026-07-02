import React, { useState, useEffect } from 'react';
import { AlertOctagon, RefreshCw, Zap } from 'lucide-react';

const AlertTrigger = ({ scenarios, onTrigger, isProcessing, currentScenarioId }) => {
  const [selected, setSelected] = useState("");
  const [timer, setTimer] = useState(0);

  // Set default selection when scenarios list loads
  useEffect(() => {
    if (scenarios && scenarios.length > 0 && !selected) {
      setSelected(scenarios[0].id);
    }
  }, [scenarios, selected]);

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (isProcessing) {
      setTimer(35); // Estimated run time
      interval = setInterval(() => {
        setTimer((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selected && !isProcessing) {
      onTrigger(selected);
    }
  };

  const activeScenario = scenarios.find((s) => s.id === selected) || {};

  return (
    <div className="p-5 rounded-2xl glass-panel border border-slate-800">
      <h3 className="text-md font-bold text-slate-200 mb-4 flex items-center gap-2">
        <AlertOctagon className="text-brand-danger animate-pulse-slow" size={18} />
        Incident Control Panel
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Select Simulation Outage
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            disabled={isProcessing}
            className="w-full px-3 py-2.5 rounded-lg glass-input border border-slate-700/60 text-sm focus:border-brand-accent/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scenarios.map((sc) => (
              <option key={sc.id} value={sc.id} className="bg-slate-900 text-slate-100">
                [{sc.severity}] {sc.name}
              </option>
            ))}
          </select>
        </div>

        {activeScenario.description && (
          <div className="bg-slate-950/45 p-3 rounded-lg border border-slate-800/65 text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300 block mb-1">Scenario Details:</span>
            {activeScenario.description}
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || !selected}
          className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all duration-300 border ${
            isProcessing
              ? 'bg-slate-950/40 text-brand-accent border-brand-accent/20 cursor-not-allowed'
              : 'bg-brand-danger/20 hover:bg-brand-danger/30 text-brand-danger border-brand-danger/40 hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]'
          }`}
        >
          {isProcessing ? (
            <>
              <Zap className="animate-spin text-brand-accent" size={16} />
              <span>Agents Coordinating ({timer}s)</span>
            </>
          ) : (
            <>
              <AlertOctagon size={16} />
              <span>🚨 TRIGGER INCIDENT</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AlertTrigger;
