// Core Currency Pairs
export const FOREX_PAIRS = [
  { symbol: "EUR/USD", base: "EUR", quote: "USD", category: "major", pipSize: 0.0001 },
  { symbol: "GBP/USD", base: "GBP", quote: "USD", category: "major", pipSize: 0.0001 },
  { symbol: "USD/JPY", base: "USD", quote: "JPY", category: "major", pipSize: 0.01 },
  { symbol: "USD/CHF", base: "USD", quote: "CHF", category: "major", pipSize: 0.0001 },
  { symbol: "AUD/USD", base: "AUD", quote: "USD", category: "major", pipSize: 0.0001 },
  { symbol: "NZD/USD", base: "NZD", quote: "USD", category: "major", pipSize: 0.0001 },
  { symbol: "USD/CAD", base: "USD", quote: "CAD", category: "major", pipSize: 0.0001 },
  { symbol: "EUR/GBP", base: "EUR", quote: "GBP", category: "cross", pipSize: 0.0001 },
  { symbol: "EUR/JPY", base: "EUR", quote: "JPY", category: "cross", pipSize: 0.01 },
  { symbol: "GBP/JPY", base: "GBP", quote: "JPY", category: "cross", pipSize: 0.01 },
  { symbol: "XAU/USD", base: "XAU", quote: "USD", category: "commodity", pipSize: 0.01 },
] as const;

export const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "NZD", "CAD"] as const;

export const TIMEFRAMES = [
  { value: "M1", label: "1 Minute", minutes: 1 },
  { value: "M5", label: "5 Minutes", minutes: 5 },
  { value: "M15", label: "15 Minutes", minutes: 15 },
  { value: "M30", label: "30 Minutes", minutes: 30 },
  { value: "H1", label: "1 Hour", minutes: 60 },
  { value: "H4", label: "4 Hours", minutes: 240 },
  { value: "D1", label: "Daily", minutes: 1440 },
  { value: "W1", label: "Weekly", minutes: 10080 },
  { value: "MN1", label: "Monthly", minutes: 43200 },
] as const;

// Signal Classification
export const SIGNAL_TYPES = {
  STRONG_BUY: { value: "strong_buy", label: "Strong Buy", labelAr: "شراء قوي", color: "green", minScore: 80, minConfidence: 70 },
  BUY: { value: "buy", label: "Buy", labelAr: "شراء", color: "green", minScore: 60, minConfidence: 60 },
  NEUTRAL: { value: "neutral", label: "Neutral", labelAr: "محايد", color: "yellow", minScore: 40, minConfidence: 0 },
  SELL: { value: "sell", label: "Sell", labelAr: "بيع", color: "red", minScore: 21, minConfidence: 60 },
  STRONG_SELL: { value: "strong_sell", label: "Strong Sell", labelAr: "بيع قوي", color: "red", minScore: 0, minConfidence: 70 },
} as const;

// Analysis Engine Weights (Default)
export const DEFAULT_WEIGHTS = {
  technical: 0.25,
  mtf: 0.15,
  fundamental: 0.20,
  sentiment: 0.15,
  currencyStrength: 0.10,
  structure: 0.10,
  volatility: 0.025,
  correlation: 0.025,
} as const;

// Technical Indicators Configuration
export const INDICATOR_CONFIG = {
  // Moving Averages
  SMA: [20, 50, 100, 200],
  EMA: [9, 20, 50, 100, 200],
  
  // Momentum
  RSI: { period: 14, overbought: 70, oversold: 30 },
  MACD: { fast: 12, slow: 26, signal: 9 },
  STOCHASTIC: { k: 14, d: 3, smooth: 3, overbought: 80, oversold: 20 },
  CCI: { period: 20, overbought: 100, oversold: -100 },
  WILLIAMS_R: { period: 14, overbought: -20, oversold: -80 },
  ROC: { period: 12 },
  
  // Trend
  ADX: { period: 14, strongTrend: 25, veryStrongTrend: 50 },
  SUPERTREND: { period: 10, multiplier: 3 },
  ICHIMOKU: { tenkan: 9, kijun: 26, senkou: 52 },
  PSAR: { step: 0.02, max: 0.2 },
  
  // Volatility
  ATR: { period: 14 },
  BOLLINGER: { period: 20, stdDev: 2 },
  
  // Volume
  OBV: {},
  MFI: { period: 14, overbought: 80, oversold: 20 },
} as const;

// Impact Levels
export const IMPACT_LEVELS = {
  HIGH: { value: "high", label: "High Impact", labelAr: "تأثير عالي", color: "red" },
  MEDIUM: { value: "medium", label: "Medium Impact", labelAr: "تأثير متوسط", color: "yellow" },
  LOW: { value: "low", label: "Low Impact", labelAr: "تأثير منخفض", color: "green" },
} as const;

// Trading Sessions
export const TRADING_SESSIONS = {
  SYDNEY: { start: "22:00", end: "07:00", timezone: "UTC" },
  TOKYO: { start: "00:00", end: "09:00", timezone: "UTC" },
  LONDON: { start: "08:00", end: "17:00", timezone: "UTC" },
  NEW_YORK: { start: "13:00", end: "22:00", timezone: "UTC" },
} as const;

// Confidence Adjustments
export const CONFIDENCE_ADJUSTMENTS = {
  STALE_DATA_PER_HOUR: -5,
  TECHNICAL_FUNDAMENTAL_CONFLICT: -20,
  LOW_DATA_QUALITY: -15,
  PRE_NEWS_HIGH_IMPACT: -25,
  HIGH_AGREEMENT: 10,
  MISSING_DATA_SOURCE: -10,
} as const;

// Risk Management Defaults
export const RISK_DEFAULTS = {
  maxRiskPercent: 2,
  defaultRiskPercent: 1,
  maxLeverage: 30,
  defaultLeverage: 10,
  minRiskRewardRatio: 1.5,
} as const;
