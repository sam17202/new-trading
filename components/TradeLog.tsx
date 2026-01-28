
import React from 'react';
import { Trade } from '../types';

interface TradeLogProps {
  trades: Trade[];
}

const TradeLog: React.FC<TradeLogProps> = ({ trades }) => {
  return (
    <div className="bg-[#1e2329] rounded-xl border border-[#2b2f36] overflow-hidden shadow-2xl">
      <div className="px-6 py-4 bg-[#2b3139]/50 border-b border-[#2b2f36] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#f0b90b]/10 rounded border border-[#f0b90b]/20">
            <svg className="w-4 h-4 text-[#f0b90b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xs font-black text-[#eaecef] uppercase tracking-widest">Execution Journal</h3>
        </div>
        <div className="flex gap-4">
           <span className="text-[10px] px-2 py-0.5 bg-[#2b3139] border border-[#3b424d] text-[#848e9c] rounded font-mono">
             STRAT: VWAP_BREAKOUT_10M
           </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead className="text-[#848e9c] bg-[#1e2329] border-b border-[#2b2f36]">
            <tr>
              <th className="px-6 py-4 font-black uppercase tracking-widest">Timestamp</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-center">Type</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest">Entry Level</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest">Exit Points</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest">P/L Points</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2b2f36]">
            {[...trades].reverse().map((trade) => (
              <tr key={trade.id} className="hover:bg-[#f0b90b]/5 transition-all group border-l-2 border-l-transparent hover:border-l-[#f0b90b]">
                <td className="px-6 py-4">
                   <div className="text-[#eaecef] font-black">{trade.date}</div>
                   <div className="text-[10px] text-[#5e6673] font-mono mt-0.5 uppercase tracking-tighter">Signal @ {trade.entryTime}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-4 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                    trade.type === 'BUY' ? 'bg-green-500/10 text-[#0ecb81] border-[#0ecb81]/20' : 'bg-red-500/10 text-[#f6465d] border-[#f6465d]/20'
                  }`}>
                    {trade.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono text-white text-sm font-bold">{trade.entryPrice.toFixed(2)}</div>
                  <div className="text-[9px] text-[#5e6673] font-bold uppercase tracking-tighter italic">1st High + 5.0 Buffer</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono text-[#848e9c]">{trade.exitPrice?.toFixed(2) || '---'}</div>
                  <div className="text-[9px] text-[#5e6673] uppercase tracking-tighter font-bold">Closed @ {trade.exitTime || 'ACTIVE'}</div>
                </td>
                <td className={`px-6 py-4 font-black text-base font-mono ${trade.pnl >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                  {trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(1)}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${
                    trade.status === 'WIN' ? 'bg-[#0ecb81]/20 text-[#0ecb81]' : 
                    trade.status === 'LOSS' ? 'bg-[#f6465d]/20 text-[#f6465d]' : 
                    trade.status === 'T1_HIT' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-[#2b3139] text-[#848e9c]'
                  }`}>
                    {trade.status === 'T1_HIT' ? 'Partial T1' : trade.status}
                  </span>
                </td>
              </tr>
            ))}
            {trades.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center opacity-40">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-[#2b3139] rounded-full">
                       <svg className="w-12 h-12 text-[#848e9c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] font-mono">Awaiting Live Signals...</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeLog;
