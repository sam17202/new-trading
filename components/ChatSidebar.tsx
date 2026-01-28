
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatSidebarProps {
  history: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isThinking: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ history, onSendMessage, isThinking }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#1e2329] border-l border-[#2b2f36]">
      <div className="p-6 border-b border-[#2b2f36] bg-[#2b3139]/30">
        <h3 className="font-black text-xs text-[#eaecef] flex items-center gap-2 uppercase tracking-[0.2em]">
          <span className="w-2 h-2 rounded-full bg-[#f0b90b] shadow-[0_0_8px_#f0b90b]"></span>
          Strategy Auditor
        </h3>
        <p className="text-[10px] text-[#848e9c] font-bold mt-2 uppercase tracking-tighter italic">NIFTY Rule Interpretation Engine</p>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {history.map((msg, i) => (
          <div 
            key={i} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[95%] p-4 rounded-xl text-[13px] leading-relaxed shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-[#f0b90b] text-black rounded-tr-none font-bold' 
                  : 'bg-[#2b3139] text-[#eaecef] rounded-tl-none border border-[#3b424d] prose prose-invert prose-sm'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">
                {msg.content}
              </div>
            </div>
            <span className="text-[9px] text-[#5e6673] font-bold uppercase mt-2 px-1 tracking-widest">
              {msg.role === 'assistant' ? 'System Expert' : 'Trader'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {isThinking && (
          <div className="flex flex-col items-start">
            <div className="bg-[#2b3139] p-4 rounded-xl rounded-tl-none text-[13px] text-[#848e9c] border border-[#3b424d]">
              <span className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-[#f0b90b] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#f0b90b] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-[#f0b90b] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-2 font-mono text-[10px] uppercase font-black tracking-widest">Analyzing VWAP Filters...</span>
              </span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-[#1e2329] border-t border-[#2b2f36] shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Audit this trade..."
            className="w-full bg-[#2b3139] text-[#eaecef] text-sm rounded-lg pl-5 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-[#f0b90b]/50 border border-[#3b424d] transition-all group-hover:border-[#f0b90b]/30"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f0b90b] hover:text-white transition-all disabled:opacity-30 p-2"
            disabled={isThinking || !input.trim()}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-center text-[#5e6673] mt-4 font-bold uppercase tracking-widest leading-tight">
          Strict Audit: 10m VWAP • High + 5 Buffer • Next Candle Breakout
        </p>
      </form>
    </div>
  );
};

export default ChatSidebar;
