
import React, { useMemo } from 'react';
import { 
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, Bar, ResponsiveContainer, Cell, ReferenceLine, Area
} from 'recharts';
import { Candle, Trade } from '../types';

interface TradingChartProps {
  data: Candle[];
  trades: Trade[];
  livePrice: number;
}

const TradingChart: React.FC<TradingChartProps> = ({ data, trades, livePrice }) => {
  // Focus on the most recent candles for clarity
  const displayData = useMemo(() => {
    const subset = data.slice(-50);
    const last = { ...subset[subset.length - 1] };
    if (last) {
      last.close = livePrice;
      if (livePrice > last.high) last.high = livePrice;
      if (livePrice < last.low) last.low = livePrice;
      return [...subset.slice(0, -1), last];
    }
    return subset;
  }, [data, livePrice]);

  const signalLevels = useMemo(() => {
    const today = [...data].reverse().find(d => d.time.includes('09:15'));
    return today ? {
      high: today.high,
      trigger: today.high + 5,
      vwap: today.vwap,
      pvwap: today.prevDayVwap
    } : null;
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-[#1e2329] border border-[#2b2f36] p-4 text-[11px] shadow-2xl rounded-lg backdrop-blur-xl bg-opacity-90">
          <p className="text-[#848e9c] font-black mb-3 border-b border-[#2b2f36] pb-2 font-mono uppercase tracking-widest">{d.time}</p>
          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between gap-6">
              <span className="text-[#848e9c]">OHLC</span>
              <span className="text-white font-bold">{d.open.toFixed(1)} / {d.high.toFixed(1)} / {d.low.toFixed(1)} / {d.close.toFixed(1)}</span>
            </div>
            <div className="flex justify-between gap-6 border-t border-[#2b2f36] pt-1.5 mt-1.5">
              <span className="text-[#f0b90b]">VWAP TODAY</span>
              <span className="text-[#f0b90b] font-bold">{d.vwap?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-blue-400">VWAP PREV</span>
              <span className="text-blue-400 font-bold">{d.prevDayVwap?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#1e2329] rounded-xl border border-[#2b2f36] h-[550px] w-full p-6 flex flex-col relative overflow-hidden">
      {/* Chart Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#f0b90b]/5 blur-[120px] -z-10"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
           <h3 className="text-[10px] font-black text-[#848e9c] tracking-[0.3em] uppercase flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-[#f0b90b] rounded-full"></span>
             NIFTY Performance Tracker
           </h3>
           <div className="h-4 w-px bg-[#2b2f36]"></div>
           <div className="flex gap-4 text-[10px] font-bold">
              <span className="text-[#f0b90b] flex items-center gap-1.5">
                <div className="w-2 h-0.5 bg-[#f0b90b]"></div> VWAP_T
              </span>
              <span className="text-blue-400 flex items-center gap-1.5">
                <div className="w-2 h-0.5 bg-blue-500"></div> VWAP_P
              </span>
           </div>
        </div>
        <div className="px-3 py-1 bg-[#2b3139] border border-[#3b424d] rounded text-[10px] font-mono text-white flex items-center gap-2">
           <span className="text-[#848e9c]">SYMBOL:</span> NIFTY_SPOT
        </div>
      </div>
      
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={displayData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVwap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f0b90b" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f0b90b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2b2f36" vertical={false} opacity={0.2} />
            <XAxis dataKey="time" stroke="#5e6673" fontSize={9} tickFormatter={(val) => val.split(' ')[1]} axisLine={false} tickLine={false} dy={10} />
            <YAxis domain={['auto', 'auto']} orientation="right" stroke="#5e6673" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => v.toLocaleString()} dx={5} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f0b90b', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            <Bar dataKey="high" fill="#5e6673">
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.close > entry.open ? '#0ecb81' : '#f6465d'} fillOpacity={0.8} />
              ))}
            </Bar>

            <Area type="monotone" dataKey="vwap" stroke="none" fillOpacity={1} fill="url(#colorVwap)" isAnimationActive={false} />
            <Line type="monotone" dataKey="vwap" stroke="#f0b90b" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="stepAfter" dataKey="prevDayVwap" stroke="#3b82f6" strokeWidth={1} strokeDasharray="8 4" dot={false} isAnimationActive={false} />
            
            {/* Real-time price cursor */}
            <ReferenceLine y={livePrice} stroke="#f0b90b" strokeWidth={1} strokeDasharray="2 2" />

            {/* Strategy Specific Levels */}
            {signalLevels && (
              <>
                <ReferenceLine 
                  y={signalLevels.trigger} 
                  stroke="#0ecb81" 
                  strokeWidth={2}
                  strokeDasharray="6 3" 
                  label={{ 
                    position: 'insideLeft', 
                    value: `ENTRY_TRIGGER: ${signalLevels.trigger.toFixed(1)}`, 
                    fill: '#0ecb81', 
                    fontSize: 10, 
                    fontWeight: 'black',
                    offset: 10
                  }} 
                />
                <ReferenceLine 
                  y={signalLevels.high} 
                  stroke="#848e9c" 
                  strokeWidth={1}
                  strokeDasharray="2 2" 
                  label={{ position: 'left', value: '1ST_CANDLE_H', fill: '#848e9c', fontSize: 9 }} 
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TradingChart;
