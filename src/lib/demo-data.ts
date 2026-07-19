// Demo data for development and testing
// WARNING: This is simulated data for demonstration purposes only.
// Do NOT use for real trading decisions.

import { FOREX_PAIRS, CURRENCIES } from "./constants";

export interface DemoPairData {
  symbol: string;
  displayName: string;
  baseCurrency: string;
  quoteCurrency: string;
  currentPrice: number;
  dailyOpen: number;
  dailyHigh: number;
  dailyLow: number;
  dailyChange: number;
  dailyChangePercent: number;
  bid: number;
  ask: number;
  spread: number;
  signal: string;
  signalScore: number;
  confidence: number;
  trend: string;
  lastUpdated: Date;
}

export interface DemoCurrencyStrength {
  currency: string;
  score: number;
  change: number;
  rank: number;
}

export interface DemoEconomicEvent {
  id: string;
  title: string;
  country: string;
  currency: string;
  eventTime: Date;
  impact: "high" | "medium" | "low";
  previous?: string;
  forecast?: string;
  actual?: string;
}

// Base prices for pairs (approximate real values for demonstration)
const basePrices: Record<string, number> = {
  "EUR/USD": 1.0850,
  "GBP/USD": 1.2650,
  "USD/JPY": 149.50,
  "USD/CHF": 0.8850,
  "AUD/USD": 0.6550,
  "NZD/USD": 0.6050,
  "USD/CAD": 1.3650,
  "EUR/GBP": 0.8580,
  "EUR/JPY": 162.20,
  "GBP/JPY": 189.10,
  "XAU/USD": 2025.50,
};

// Generate random variation
function randomVariation(base: number, maxPercent: number = 0.5): number {
  const variation = (Math.random() - 0.5) * 2 * (maxPercent / 100);
  return base * (1 + variation);
}

// Generate signal based on simple rules
function generateSignal(changePercent: number): { signal: string; score: number; confidence: number } {
  const absChange = Math.abs(changePercent);
  let signal: string;
  let score: number;
  let confidence: number;

  if (changePercent > 0.5) {
    signal = "strong_buy";
    score = 85 + Math.random() * 15;
    confidence = 70 + Math.random() * 20;
  } else if (changePercent > 0.2) {
    signal = "buy";
    score = 65 + Math.random() * 15;
    confidence = 60 + Math.random() * 20;
  } else if (changePercent < -0.5) {
    signal = "strong_sell";
    score = 5 + Math.random() * 15;
    confidence = 70 + Math.random() * 20;
  } else if (changePercent < -0.2) {
    signal = "sell";
    score = 25 + Math.random() * 15;
    confidence = 60 + Math.random() * 20;
  } else {
    signal = "neutral";
    score = 40 + Math.random() * 20;
    confidence = 40 + Math.random() * 30;
  }

  return {
    signal,
    score: Math.round(score),
    confidence: Math.round(confidence),
  };
}

// Generate trend based on change
function generateTrend(changePercent: number): string {
  if (changePercent > 0.1) return "bullish";
  if (changePercent < -0.1) return "bearish";
  return "sideways";
}

export function generateDemoPairData(): DemoPairData[] {
  const now = new Date();
  
  return FOREX_PAIRS.map((pair) => {
    const basePrice = basePrices[pair.symbol] || 1.0;
    const currentPrice = randomVariation(basePrice, 0.3);
    const dailyOpen = randomVariation(basePrice, 0.2);
    const dailyChange = currentPrice - dailyOpen;
    const dailyChangePercent = (dailyChange / dailyOpen) * 100;
    const isJPY = pair.symbol.includes("JPY") || pair.symbol.includes("XAU");
    const spreadPips = pair.symbol === "XAU/USD" ? 30 : isJPY ? 1.5 : 1.2;
    const spread = spreadPips * (isJPY ? 0.01 : 0.0001);
    
    const signalData = generateSignal(dailyChangePercent);
    const trend = generateTrend(dailyChangePercent);
    
    return {
      symbol: pair.symbol,
      displayName: `${pair.base} vs ${pair.quote}`,
      baseCurrency: pair.base,
      quoteCurrency: pair.quote,
      currentPrice,
      dailyOpen,
      dailyHigh: Math.max(currentPrice, dailyOpen) * (1 + Math.random() * 0.002),
      dailyLow: Math.min(currentPrice, dailyOpen) * (1 - Math.random() * 0.002),
      dailyChange,
      dailyChangePercent,
      bid: currentPrice - spread / 2,
      ask: currentPrice + spread / 2,
      spread: spreadPips,
      signal: signalData.signal,
      signalScore: signalData.score,
      confidence: signalData.confidence,
      trend,
      lastUpdated: now,
    };
  });
}

export function generateDemoCurrencyStrength(): DemoCurrencyStrength[] {
  const scores = CURRENCIES.map((currency) => ({
    currency,
    score: Math.round((Math.random() - 0.5) * 100),
    change: Math.round((Math.random() - 0.5) * 20),
    rank: 0,
  }));

  // Sort and assign ranks
  scores.sort((a, b) => b.score - a.score);
  scores.forEach((s, i) => {
    s.rank = i + 1;
  });

  return scores;
}

export function generateDemoEconomicEvents(): DemoEconomicEvent[] {
  const now = new Date();
  
  const events: Omit<DemoEconomicEvent, "id" | "eventTime">[] = [
    { title: "FOMC Interest Rate Decision", country: "US", currency: "USD", impact: "high", previous: "5.50%", forecast: "5.50%" },
    { title: "Non-Farm Payrolls", country: "US", currency: "USD", impact: "high", previous: "216K", forecast: "180K" },
    { title: "ECB Interest Rate Decision", country: "EU", currency: "EUR", impact: "high", previous: "4.50%", forecast: "4.50%" },
    { title: "UK CPI y/y", country: "GB", currency: "GBP", impact: "high", previous: "4.0%", forecast: "3.8%" },
    { title: "BOJ Policy Statement", country: "JP", currency: "JPY", impact: "high", previous: "-0.10%", forecast: "-0.10%" },
    { title: "Australian Employment Change", country: "AU", currency: "AUD", impact: "medium", previous: "61.5K", forecast: "25.0K" },
    { title: "CAD Retail Sales m/m", country: "CA", currency: "CAD", impact: "medium", previous: "0.7%", forecast: "0.5%" },
    { title: "CHF CPI m/m", country: "CH", currency: "CHF", impact: "medium", previous: "0.0%", forecast: "0.1%" },
    { title: "NZD Trade Balance", country: "NZ", currency: "NZD", impact: "low", previous: "-1.32B", forecast: "-0.90B" },
    { title: "US Jobless Claims", country: "US", currency: "USD", impact: "medium", previous: "212K", forecast: "215K" },
  ];

  return events.map((event, index) => ({
    ...event,
    id: `event-${index}`,
    eventTime: new Date(now.getTime() + (index + 1) * 2 * 60 * 60 * 1000), // Spread events over next hours
  }));
}

export interface DemoMarketStats {
  totalPairs: number;
  bullishPairs: number;
  bearishPairs: number;
  neutralPairs: number;
  averageVolatility: number;
  marketSentiment: number;
}

export function generateDemoMarketStats(pairs: DemoPairData[]): DemoMarketStats {
  const bullishPairs = pairs.filter((p) => p.trend === "bullish").length;
  const bearishPairs = pairs.filter((p) => p.trend === "bearish").length;
  const neutralPairs = pairs.filter((p) => p.trend === "sideways").length;
  
  return {
    totalPairs: pairs.length,
    bullishPairs,
    bearishPairs,
    neutralPairs,
    averageVolatility: 0.8 + Math.random() * 1.2,
    marketSentiment: Math.round((bullishPairs - bearishPairs) / pairs.length * 100),
  };
}

export interface DemoTradingSession {
  name: string;
  isOpen: boolean;
  nextChange: string;
}

export function generateDemoTradingSessions(): DemoTradingSession[] {
  const now = new Date();
  const hour = now.getUTCHours();

  return [
    {
      name: "Sydney",
      isOpen: hour >= 22 || hour < 7,
      nextChange: hour >= 22 || hour < 7 ? "Closes in 3h" : "Opens in 2h",
    },
    {
      name: "Tokyo",
      isOpen: hour >= 0 && hour < 9,
      nextChange: hour >= 0 && hour < 9 ? "Closes in 2h" : "Opens in 5h",
    },
    {
      name: "London",
      isOpen: hour >= 8 && hour < 17,
      nextChange: hour >= 8 && hour < 17 ? "Closes in 4h" : "Opens in 1h",
    },
    {
      name: "New York",
      isOpen: hour >= 13 && hour < 22,
      nextChange: hour >= 13 && hour < 22 ? "Closes in 5h" : "Opens in 3h",
    },
  ];
}

// Disclaimer text
export const DEMO_DISCLAIMER = `
⚠️ DEMO DATA NOTICE

This platform is currently displaying SIMULATED DATA for demonstration purposes only.
These are NOT real market prices and should NOT be used for any trading decisions.

Real-time market data requires integration with licensed data providers.
Contact your administrator to configure live data feeds.
`;
