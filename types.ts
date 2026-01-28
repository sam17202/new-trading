
export type Timeframe = '1m' | '5m' | '10m' | '15m' | '1h';

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap?: number;
  prevDayVwap?: number;
}

export interface Trade {
  id: string;
  date: string;
  type: 'BUY' | 'SELL';
  entryTime: string;
  entryPrice: number;
  stopLoss: number;
  target1: number;
  target2: number;
  exitTime?: string;
  exitPrice?: number;
  pnl: number;
  status: 'WIN' | 'LOSS' | 'OPEN' | 'SQUARED_OFF' | 'T1_HIT';
  reason?: string;
}

export interface BacktestResult {
  totalTrades: number;
  wins: number;
  losses: number;
  totalPnl: number;
  winRate: number;
  trades: Trade[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
