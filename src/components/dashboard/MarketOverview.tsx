"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap,
  Clock,
  Globe
} from "lucide-react";

interface MarketSession {
  name: string;
  isOpen: boolean;
  nextChange: string;
}

interface MarketStats {
  totalPairs: number;
  bullishPairs: number;
  bearishPairs: number;
  neutralPairs: number;
  averageVolatility: number;
  marketSentiment: number;
}

interface MarketOverviewProps {
  sessions: MarketSession[];
  stats: MarketStats;
}

const sessionIcons: Record<string, string> = {
  Sydney: "🇦🇺",
  Tokyo: "🇯🇵",
  London: "🇬🇧",
  "New York": "🇺🇸",
};

export function MarketOverview({ sessions, stats }: MarketOverviewProps) {
  const { t } = useApp();

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 30) return { label: "Risk On", color: "text-green-500" };
    if (sentiment < -30) return { label: "Risk Off", color: "text-red-500" };
    return { label: "Mixed", color: "text-yellow-500" };
  };

  const sentimentInfo = getSentimentLabel(stats.marketSentiment);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Trading Sessions */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Trading Sessions
            </span>
          </div>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>{sessionIcons[session.name]}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      session.isOpen ? "bg-green-500" : "bg-gray-400"
                    )}
                  />
                  <span className="text-xs text-gray-500">
                    {session.nextChange}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Direction */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Market Direction
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Bullish
                </span>
              </div>
              <Badge variant="success">{stats.bullishPairs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Bearish
                </span>
              </div>
              <Badge variant="danger">{stats.bearishPairs}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Neutral
                </span>
              </div>
              <Badge variant="warning">{stats.neutralPairs}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Sentiment */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Market Sentiment
            </span>
          </div>
          <div className="text-center">
            <div className={cn("text-3xl font-bold", sentimentInfo.color)}>
              {stats.marketSentiment > 0 ? "+" : ""}{stats.marketSentiment}
            </div>
            <div className={cn("text-sm font-medium mt-1", sentimentInfo.color)}>
              {sentimentInfo.label}
            </div>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  stats.marketSentiment > 0 ? "bg-green-500" : "bg-red-500"
                )}
                style={{
                  width: `${Math.abs(stats.marketSentiment)}%`,
                  marginLeft: stats.marketSentiment > 0 ? "50%" : `${50 - Math.abs(stats.marketSentiment)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Bearish</span>
              <span>Bullish</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volatility */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Average Volatility
            </span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.averageVolatility.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {stats.averageVolatility > 1.5
                ? "High Volatility"
                : stats.averageVolatility > 0.8
                ? "Normal"
                : "Low Volatility"}
            </div>
            <div className="mt-3 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "w-4 h-8 rounded",
                    level <= Math.ceil(stats.averageVolatility / 0.5)
                      ? level <= 2
                        ? "bg-green-500"
                        : level <= 3
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  )}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
