import React from 'react';
import Sidebar from '../components/Sidebar';
import ExpensePrediction from '../components/ExpensePrediction';
import WhatIfSimulator from '../components/WhatIfSimulator';
import AIAdvisorBot from '../components/AIAdvisorBot';

const AnalyticsPage = () => (
  <div className="flex min-h-screen" style={{ background: '#F0F4F3' }}>
    <Sidebar />
    <main className="flex-1 ml-64 p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-black" style={{ color: '#111827' }}>Analytics</h2>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>AI-powered predictions and simulations</p>
      </header>
      <div className="grid grid-cols-2 gap-6">
        <ExpensePrediction />
        <WhatIfSimulator />
      </div>
    </main>
    <AIAdvisorBot />
  </div>
);

export default AnalyticsPage;