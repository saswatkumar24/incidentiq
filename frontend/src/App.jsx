import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-brand-accent/30 selection:text-white">
      <Dashboard />
    </div>
  );
}

export default App;
