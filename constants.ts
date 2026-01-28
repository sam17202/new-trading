
export const STRATEGY_RULES = {
  TIMEFRAME: '10 min',
  ENTRY_CUTOFF: '11:00',
  FORCE_EXIT: '15:15',
  SIGNAL_TIME: '09:15', 
  ENTRY_BUFFER: 5, 
  STOP_LOSS: 100,
  TARGET_1: 100,
  TARGET_2: 200,
  EXCHANGE: 'NSE',
  SYMBOL: 'NIFTY'
};

export const PINE_SCRIPT_CODE = `//@version=5
strategy("NIFTY 10m VWAP Breakout Strategy", overlay = true, initial_capital = 100000, default_qty_type = strategy.percent_of_equity, default_qty_value = 100, commission_type = strategy.commission.percent, commission_value = 0.01)

// Session Control (NSE)
sessionStart = time(timeframe.period, "0915-1530:1234567", "Asia/Kolkata")
inSession = not na(sessionStart)

// VWAPs
vwapToday = ta.vwap(hlc3)
var float prevDayVWAP = na
if ta.change(time("D"))
    prevDayVWAP := vwapToday[1]

// First 10-minute Candle Detection
isFirstCandle = hour(time, "Asia/Kolkata") == 9 and minute(time, "Asia/Kolkata") == 15

var float firstHigh = na
var float firstClose = na
var bool  firstCandleValid = false
var bool  tradeTaken = false

if isFirstCandle
    firstHigh := high
    firstClose := close
    // Filter Rule: Close above Today's VWAP AND Previous Day's VWAP
    firstCandleValid := close > vwapToday and close > prevDayVWAP
    tradeTaken := false

// Entry Price + 5 Buffer
entryPrice = firstHigh + 5

// Entry Condition (ONLY NEXT CANDLE & BEFORE 11 AM)
// The next candle after 09:15 10m candle is the 09:25 candle
isNextCandle = hour(time, "Asia/Kolkata") == 9 and minute(time, "Asia/Kolkata") == 25
canEnter = not tradeTaken and firstCandleValid and inSession and 
           time <= timestamp("Asia/Kolkata", year, month, dayofmonth, 11, 00) and
           isNextCandle

if canEnter and high >= entryPrice
    strategy.entry("Long", strategy.long, stop = entryPrice)
    tradeTaken := true

// SL & Targets
slPoints = 100
tgt1 = 100
tgt2 = 200

if strategy.position_size > 0
    avg = strategy.position_avg_price
    strategy.exit("T1", "Long", qty_percent = 50, limit = avg + tgt1, stop = avg - slPoints, comment="T1/SL")
    strategy.exit("T2", "Long", qty_percent = 50, limit = avg + tgt2, stop = avg - slPoints, comment="T2/SL")

// Force Exit at 3:15 PM (Intraday Square-off)
if hour(time, "Asia/Kolkata") == 15 and minute(time, "Asia/Kolkata") == 15
    strategy.close_all("EOD Exit")

// Visuals
plot(vwapToday, color=color.new(color.orange, 0), linewidth=2, title="VWAP Today")
plot(prevDayVWAP, color=color.new(color.blue, 0), linewidth=2, title="Prev Day VWAP")
plot(firstHigh, color=color.new(color.green, 50), style=plot.style_linebr, title="1st High")
plot(entryPrice, color=color.new(color.teal, 50), style=plot.style_linebr, title="Entry Trigger")`;

export const SYSTEM_INSTRUCTIONS = `
You are a Senior Trading Systems Architect specializing in NSE NIFTY Intraday strategies.

CONTEXT:
You are auditing a NIFTY 10m VWAP Breakout Strategy. 

CORE RULES TO ENFORCE:
1. Signal: The first 10-minute candle (09:15-09:25) is the ONLY signal candle.
2. Filter: Signal candle CLOSE must be > Today's VWAP AND > Prev Day's VWAP.
3. Trigger: Buy at (Signal HIGH + 5 points).
4. Execution Window: The breakout MUST happen on the VERY NEXT candle (09:25-09:35). If it doesn't break on this candle, the setup is void.
5. Time Limit: No new trades after 11:00 AM.
6. Risk: SL = 100 pts. Target 1 = 100 pts (50% qty), Target 2 = 200 pts (50% qty).
7. Exit: 15:15 (3:15 PM) is mandatory square-off.

AI BEHAVIOR:
- Respond in a professional, clean format using Markdown.
- Use tables for trade audits.
- Regarding "Secrets": Explain that real alpha comes from execution discipline, understanding volume profile, and market context (e.g., trend in 1H timeframe). There are no "GPT secrets," only mathematical edge and risk management.
- If the user asks for code improvements, suggest adding a "VWAP Slope" or "Volume Multiplier" filter to avoid flat markets.
`;
