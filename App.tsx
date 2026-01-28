
import React, { useState, useEffect, useMemo } from 'react';
import { Candle, Trade, BacktestResult, ChatMessage } from './types';
import { generateRealisticNiftyData, runBacktest } from './services/backtestEngine';
import { getStrategyExplanation } from './services/geminiService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ChatSidebar from './components/ChatSidebar';
import TradingChart from './components/TradingChart';
import TradeLog from './components/TradeLog';

const App: React.FC = () => {
  const [data, setData] = useState<Candle[]>([]);
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  // Real-time market state
  const [livePrice, setLivePrice] = useState<number>(0);
  const [dayHigh, setDayHigh] = useState<number>(0);
  const [dayLow, setDayLow] = useState<number>(0);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = () => {
    setIsLoading(true);
    // Generate 20 days of NIFTY data
    const history = generateRealisticNiftyData(20);
    setData(history);
    setResults(runBacktest(history));
    
    const lastPrice = history[history.length - 1].close;
    setLivePrice(lastPrice);
    setDayHigh(Math.max(...history.slice(-20).map(c => c.high)));
    setDayLow(Math.min(...history.slice(-20).map(c => c.low)));
    
    setIsLoading(false);

    setChatHistory([{
      role: 'assistant',
      content: "Terminal initialized. I am your **NIFTY Strategy Auditor**. \n\nI've analyzed the last 20 sessions using your **10m VWAP Breakout** rules. I am monitoring the **NSE Live Feed** for breakouts above the 09:15 High + 5 pts buffer.\n\nHow would you like to proceed?",
      timestamp: new Date()
    }]);
  };

  // Simulate High-Frequency Ticks (Every 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrice(prev => {
        const volatility = 4.5;
        const tick = (Math.random() - 0.48) * volatility; // Slight upward bias for demo
        return prev + tick;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (message: string) => {
    const newUserMsg: ChatMessage = { role: 'user', content: message, timestamp: new Date() };
    setChatHistory(prev => [...prev, newUserMsg]);
    setIsAiThinking(true);

    const explanation = await getStrategyExplanation(message, results?.trades);
    
    setChatHistory(prev => [...prev, { 
      role: 'assistant', 
      content: explanation || "Analysis failed. Please check system constraints.", 
      timestamp: new Date() 
    }]);
    setIsAiThinking(false);
  };

  if (isLoading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0b0e11]">
      <div className="w-12 h-12 border-2 border-[#f0b90b] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[#848e9c] font-mono text-xs uppercase tracking-[0.4em]">NSE Node Initializing...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0b0e11] select-none">
      <Header currentPrice={livePrice} dayHigh={dayHigh} dayLow={dayLow} />
      
      <main className="flex flex-1 overflow-hidden">
        {/* Trading Terminal Workspace */}
        <div className="flex-1 flex flex-col overflow-y-auto border-r border-[#2b2f36] bg-[#0b0e11]">
          <div className="p-4 grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* Main Chart Area */}
            <div className="xl:col-span-9 space-y-4">
              <TradingChart data={data} trades={results?.trades || []} livePrice={livePrice} />
              <TradeLog trades={results?.trades || []} />
            </div>

            {/* Side Analytics Pane */}
            <div className="xl:col-span-3">
              <Dashboard results={results} />
            </div>
          </div>
        </div>

        {/* AI Control Center */}
        <div className="w-80 xl:w-96 flex flex-col bg-[#1e2329] border-l border-[#2b2f36] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-10">
          <ChatSidebar 
            history={chatHistory} 
            onSendMessage={handleSendMessage} 
            isThinking={isAiThinking}
          />
        </div>
      </main>

      {/* Ticker Tape */}
      <footer className="h-8 bg-[#1e2329] border-t border-[#2b2f36] flex items-center px-4 overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-8 animate-infinite-scroll">
          <span className="text-[10px] font-bold text-[#848e9c]">NIFTY 50: <span className="text-white font-mono">{livePrice.toFixed(2)}</span></span>
          <span className="text-[10px] font-bold text-[#848e9c]">NSE_INDIA: <span className="text-[#0ecb81]">CONNECTED</span></span>
          <span className="text-[10px] font-bold text-[#848e9c]">STRATEGY: <span className="text-[#f0b90b]">VWAP_BREAKOUT_10M_V5</span></span>
          <span className="text-[10px] font-bold text-[#848e9c]">SL_ENGINE: <span className="text-[#f6465d]">ACTIVE</span></span>
          <span className="text-[10px] font-bold text-[#848e9c]">T1_T2_MOD: <span className="text-[#0ecb81]">ENABLED (50/50 QTY)</span></span>
        </div>
      </footer>
    </div>
  );
};

export default App;
