import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPrice(price: number, decimals: number = 5): string {
  return price.toFixed(decimals);
}

export function formatPercent(value: number, showSign: boolean = true): string {
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function getSignalColor(signal: string): string {
  switch (signal) {
    case "strong_buy":
      return "text-green-500";
    case "buy":
      return "text-green-400";
    case "neutral":
      return "text-yellow-500";
    case "sell":
      return "text-red-400";
    case "strong_sell":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

export function getSignalBgColor(signal: string): string {
  switch (signal) {
    case "strong_buy":
      return "bg-green-500/20";
    case "buy":
      return "bg-green-400/20";
    case "neutral":
      return "bg-yellow-500/20";
    case "sell":
      return "bg-red-400/20";
    case "strong_sell":
      return "bg-red-500/20";
    default:
      return "bg-gray-500/20";
  }
}

export function getTrendColor(trend: string): string {
  switch (trend) {
    case "bullish":
      return "text-green-500";
    case "bearish":
      return "text-red-500";
    case "sideways":
      return "text-yellow-500";
    default:
      return "text-gray-500";
  }
}

export function getImpactColor(impact: string): string {
  switch (impact) {
    case "high":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
}

export function calculatePips(pair: string, entryPrice: number, exitPrice: number): number {
  const isJPY = pair.includes("JPY");
  const pipSize = isJPY ? 0.01 : 0.0001;
  return (exitPrice - entryPrice) / pipSize;
}

export function calculateRiskReward(
  entryPrice: number,
  stopLoss: number,
  takeProfit: number
): number {
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);
  return risk > 0 ? reward / risk : 0;
}

export function normalizeScore(score: number, min: number = -100, max: number = 100): number {
  return Math.max(min, Math.min(max, score));
}

export function scoreToSignal(score: number, confidence: number): string {
  if (confidence < 50) return "neutral";
  
  if (score >= 80 && confidence >= 70) return "strong_buy";
  if (score >= 60 && confidence >= 60) return "buy";
  if (score <= 20 && confidence >= 70) return "strong_sell";
  if (score <= 40 && confidence >= 60) return "sell";
  return "neutral";
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function getTimeframeMinutes(timeframe: string): number {
  const map: Record<string, number> = {
    M1: 1,
    M5: 5,
    M15: 15,
    M30: 30,
    H1: 60,
    H4: 240,
    D1: 1440,
    W1: 10080,
    MN1: 43200,
  };
  return map[timeframe] || 60;
}
