
import React from 'react';

interface HeaderProps {
  currentPrice: number;
  dayHigh: number;
  dayLow: number;
}

const Header: React.FC<HeaderProps> = ({ currentPrice, dayHigh, dayLow }) => {
  return (
    <header className="h-14 bg-[#1e2329] border-b border-[#2b2f36] flex items-center justify-between px-6 z-20 shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="bg-[#f0b90b] p-1.5 rounded shadow-[0_0_15px_rgba(240,185,11,0.2)]">
          <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.09-4-4L2 17.08l1.5 1.41z"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-black tracking-tighter text-[#eaecef] leading-none">
            NIFTY <span className="text-[#f0b90b]">AUDITOR</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
             <span className="text-[9px] text-[#848e9c] font-bold uppercase tracking-widest">NSE Live Node</span>
             <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="hidden lg:flex gap-6 items-center border-l border-[#2b2f36] pl-6 h-8">
           <div className="flex flex-col">
              <span className="text-[8px] text-[#848e9c] font-black uppercase">Day High</span>
              <span className="text-xs font-mono font-bold text-green-400">{dayHigh.toFixed(1)}</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[8px] text-[#848e9c] font-black uppercase">Day Low</span>
              <span className="text-xs font-mono font-bold text-red-400">{dayLow.toFixed(1)}</span>
           </div>
        </div>

        <div className="flex items-center gap-4 bg-[#2b3139] px-4 py-1.5 rounded-lg border border-[#3b424d] shadow-inner">
           <div className="flex flex-col items-end">
              <span className="text-[9px] text-[#848e9c] font-bold uppercase tracking-tighter">NIFTY_SPOT</span>
              <div className="flex items-center gap-3">
                 <span className="text-xl font-black font-mono tracking-tighter text-white">
                   {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </span>
                 <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
              </div>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
