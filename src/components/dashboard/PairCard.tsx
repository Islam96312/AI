"use client";

import { Card } from "@/components/ui/Card";
import { SignalBadge, TrendBadge } from "@/components/ui/Badge";
import { ConfidenceMeter } from "@/components/ui/Progress";
import { cn, formatPrice, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface PairData {
  symbol: string;
  displayName: string;
  currentPrice: number;
  dailyChange: number;
  dailyChangePercent: number;
  signal: string;
  signalScore: number;
  confidence: number;
  trend: string;
  spread: number;
  lastUpdated: Date;
}

interface PairCardProps {
  pair: PairData;
  compact?: boolean;
}

export function PairCard({ pair, compact = false }: PairCardProps) {
  const isPositive = pair.dailyChange >= 0;
  const isNeutral = Math.abs(pair.dailyChangePercent) < 0.01;

  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  if (compact) {
    return (
      <Link href={`/pairs/${pair.symbol.replace("/", "-")}`}>
        <Card hover className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {pair.symbol}
              </div>
              <div className="text-lg font-mono text-gray-700 dark:text-gray-300">
                {formatPrice(pair.currentPrice)}
              </div>
            </div>
            <div className="text-right">
              <div
                className={cn(
                  "flex items-center gap-1 font-medium",
                  isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                <TrendIcon className="h-4 w-4" />
                {formatPercent(pair.dailyChangePercent)}
              </div>
              <SignalBadge signal={pair.signal} size="sm" />
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/pairs/${pair.symbol.replace("/", "-")}`}>
      <Card hover className="overflow-hidden">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {pair.symbol}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {pair.displayName}
              </p>
            </div>
            <TrendBadge trend={pair.trend} />
          </div>

          {/* Price */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                {formatPrice(pair.currentPrice)}
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium mt-1",
                  isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                <TrendIcon className="h-4 w-4" />
                <span>{formatPercent(pair.dailyChangePercent)}</span>
                <span className="text-gray-400">
                  ({isPositive ? "+" : ""}{formatPrice(pair.dailyChange)})
                </span>
              </div>
            </div>
            <ConfidenceMeter confidence={pair.confidence} size="sm" />
          </div>

          {/* Signal */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <SignalBadge signal={pair.signal} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Score: {pair.signalScore}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>

          {/* Spread */}
          <div className="mt-2 text-xs text-gray-400">
            Spread: {pair.spread.toFixed(1)} pips
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function PairCardSkeleton() {
  return (
    <Card className="p-4 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
        </div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
        </div>
        <div className="h-14 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
    </Card>
  );
}
