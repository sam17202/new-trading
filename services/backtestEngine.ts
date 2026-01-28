
import { Candle, Trade, BacktestResult, Timeframe } from '../types';
import { STRATEGY_RULES } from '../constants';

export const runBacktest = (data: Candle[]): BacktestResult => {
  const trades: Trade[] = [];
  const days = Array.from(new Set(data.map(c => c.time.split(' ')[0])));

  days.forEach(day => {
    const dayCandles = data.filter(c => c.time.startsWith(day));
    if (dayCandles.length < 5) return;

    // 09:15 candle
    const signalCandle = dayCandles.find(c => c.time.endsWith('09:15'));
    // 09:25 candle (next candle)
    const triggerCandle = dayCandles.find(c => c.time.endsWith('09:25'));

    if (!signalCandle || !triggerCandle) return;

    // Filter: close > vwapToday and close > prevDayVWAP
    const isValidLong = signalCandle.close > (signalCandle.vwap || 0) && 
                        signalCandle.close > (signalCandle.prevDayVwap || 0);
    
    const entryTrigger = signalCandle.high + STRATEGY_RULES.ENTRY_BUFFER;
    
    let trade: Trade | null = null;
    
    // Check if the next candle (09:25) breaks the trigger
    if (isValidLong && triggerCandle.high >= entryTrigger) {
      trade = {
        id: `T-${day}`,
        date: day,
        type: 'BUY',
        entryTime: '09:25',
        entryPrice: entryTrigger,
        stopLoss: entryTrigger - STRATEGY_RULES.STOP_LOSS,
        target1: entryTrigger + STRATEGY_RULES.TARGET_1,
        target2: entryTrigger + STRATEGY_RULES.TARGET_2,
        pnl: 0,
        status: 'OPEN'
      };
    }

    if (trade) {
      let t1Hit = false;
      // Start checking from the trigger candle onwards
      const startIndex = dayCandles.indexOf(triggerCandle);
      
      for (let i = startIndex; i < dayCandles.length; i++) {
        const c = dayCandles[i];
        const time = c.time.split(' ')[1];

        // SL Hit
        if (c.low <= trade.stopLoss) {
          trade.exitTime = time;
          trade.exitPrice = trade.stopLoss;
          trade.pnl = -STRATEGY_RULES.STOP_LOSS;
          trade.status = 'LOSS';
          break;
        }

        // T1 Hit (50% qty)
        if (!t1Hit && c.high >= trade.target1) {
          t1Hit = true;
          trade.status = 'T1_HIT';
        }

        // T2 Hit (remaining 50% qty)
        if (c.high >= trade.target2) {
          trade.exitTime = time;
          trade.exitPrice = trade.target2;
          // T1 gives 100, T2 gives 200. Avg = 150 total points if T2 is hit.
          trade.pnl = 150; 
          trade.status = 'WIN';
          break;
        }

        // Force EOD Exit at 15:15
        if (time >= STRATEGY_RULES.FORCE_EXIT) {
          trade.exitTime = time;
          trade.exitPrice = c.close;
          const pointsFromEntry = c.close - trade.entryPrice;
          trade.pnl = t1Hit ? (50 + pointsFromEntry/2) : pointsFromEntry;
          trade.status = 'SQUARED_OFF';
          break;
        }
      }
      trades.push(trade);
    }
  });

  const wins = trades.filter(t => t.status === 'WIN' || (t.status === 'SQUARED_OFF' && t.pnl > 0)).length;
  const losses = trades.filter(t => t.status === 'LOSS' || (t.status === 'SQUARED_OFF' && t.pnl <= 0)).length;

  return {
    totalTrades: trades.length,
    wins,
    losses,
    totalPnl: trades.reduce((acc, t) => acc + t.pnl, 0),
    winRate: trades.length > 0 ? (wins / trades.length) * 100 : 0,
    trades
  };
};

export const generateRealisticNiftyData = (days: number): Candle[] => {
  const data: Candle[] = [];
  let basePrice = 24500; 
  let prevDayVwap = 24450;
  const now = new Date();

  for (let d = days; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const dayStr = date.toISOString().split('T')[0];
    let dayVwapSum = 0;
    let dayVolSum = 0;

    // Generate morning 10m intervals
    for (let h = 9; h <= 15; h++) {
      for (let m = 0; m < 60; m += 10) {
        if (h === 9 && m < 15) continue;
        if (h === 15 && m > 30) continue;

        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        const open = basePrice;
        // Logic to simulate more valid signals (bullish morning)
        const bias = (h === 9) ? 20 : (Math.random() - 0.48) * 15;
        const close = open + bias + (Math.random() - 0.5) * 30;
        const high = Math.max(open, close) + Math.random() * 15;
        const low = Math.min(open, close) - Math.random() * 15;
        const volume = Math.floor(Math.random() * 100000) + 50000;

        dayVwapSum += ((high + low + close) / 3) * volume;
        dayVolSum += volume;
        const vwap = dayVwapSum / dayVolSum;

        data.push({
          time: `${dayStr} ${timeStr}`,
          open, high, low, close, volume, vwap,
          prevDayVwap
        });
        basePrice = close;
      }
    }
    prevDayVwap = dayVwapSum / dayVolSum;
  }
  return data;
};
