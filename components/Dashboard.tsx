
import React from 'react';
import { BacktestResult } from '../types';

interface DashboardProps {
  results: BacktestResult | null;
}

const Dashboard: React.FC<DashboardProps> = ({ results }) => {
  if (!results) return null;

  return (
    <div className="bg-[#1e2329] rounded-xl border border-[#2b2f36] p-6 h-full flex flex-col shadow-xl">
      <h2 className="text-[#848e9c] text-[10px] font-black tracking-[0.4em] uppercase mb-8 border-b border-[#2b2f36] pb-4">
        Strategy Health
      </h2>

      <div className="space-y-8 flex-1">
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-[#848e9c] text-[10px] font-bold uppercase tracking-widest">Efficiency (WR)</span>
            <span className="text-3xl font-black text-[#0ecb81] font-mono tracking-tighter">{results.winRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-[#0b0e11] h-1 rounded-full overflow-hidden">
             <div className="bg-[#0ecb81] h-full transition-all duration-1000 shadow-[0_0_10px_#0ecb81]" style={{ width: `${results.winRate}%` }}></div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="bg-[#2b3139] p-4 rounded-lg border border-[#3b424d] flex justify-between items-center group transition-all hover:border-[#f0b90b]/30">
            <div className="flex flex-col">
               <span className="text-[#848e9c] text-[9px] font-black uppercase tracking-widest mb-1">Total P/L Pts</span>
               <div className={`text-xl font-black font-mono ${results.totalPnl >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                 {results.totalPnl > 0 ? '+' : ''}{results.totalPnl.toLocaleString()}
               </div>
            </div>
            <div className="p-2 bg-[#0b0e11] rounded border border-[#2b2f36]">
               <svg className="w-4 h-4 text-[#f0b90b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
               </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#2b3139] p-4 rounded-lg border border-[#3b424d] text-center">
              <span className="text-[#848e9c] text-[8px] font-black uppercase tracking-widest block mb-1">Trades</span>
              <span className="text-lg font-black font-mono text-white">{results.totalTrades}</span>
            </div>
            <div className="bg-[#2b3139] p-4 rounded-lg border border-[#3b424d] text-center">
              <span className="text-[#848e9c] text-[8px] font-black uppercase tracking-widest block mb-1">Ratio (W/L)</span>
              <span className="text-lg font-black font-mono text-white">{results.wins}/{results.losses}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 bg-[#f0b90b]/5 border border-[#f0b90b]/10 rounded-xl space-y-3">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 bg-[#f0b90b] rounded-full"></div>
             <span className="text-[#f0b90b] text-[9px] font-black uppercase tracking-[0.2em]">Pine Logic v5</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-[10px] font-mono">
            <span className="text-[#848e9c]">TF:</span><span className="text-white text-right">10m Intraday</span>
            <span className="text-[#848e9c]">ENTRY:</span><span className="text-white text-right">High + 5</span>
            <span className="text-[#848e9c]">SL:</span><span className="text-white text-right">100 Pts</span>
            <span className="text-[#848e9c]">TGTS:</span><span className="text-white text-right">100/200 Pts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
