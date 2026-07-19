"use client";

import { useState, useEffect, use } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { SignalBadge, TrendBadge, ImpactBadge, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfidenceMeter, Progress, ScoreBar } from "@/components/ui/Progress";
import { useApp } from "@/context/AppContext";
import { cn, formatPrice, formatPercent } from "@/lib/utils";
import { TIMEFRAMES } from "@/lib/constants";
import {
  generateDemoPairData,
  generateDemoEconomicEvents,
  generateDemoCurrencyStrength,
} from "@/lib/demo-data";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Bell,
  Share2,
  Download,
  Clock,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default function PairDetailPage({ params }: PageProps) {
  const { symbol: symbolParam } = use(params);
  const symbol = symbolParam.replace("-", "/");
  const { t } = useApp();
  const [selectedTimeframe, setSelectedTimeframe] = useState("H4");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const pairs = generateDemoPairData();
  const pair = pairs.find((p) => p.symbol === symbol) || pairs[0];
  const currencyStrength = generateDemoCurrencyStrength();
  const events = generateDemoEconomicEvents().filter(
    (e) => e.currency === pair?.baseCurrency || e.currency === pair?.quoteCurrency
  );

  const baseCurrencyStrength = currencyStrength.find(
    (c) => c.currency === pair?.baseCurrency
  );
  const quoteCurrencyStrength = currencyStrength.find(
    (c) => c.currency === pair?.quoteCurrency
  );

  // Demo analysis data
  const analysisData = {
    technicalScore: Math.round((Math.random() - 0.3) * 100),
    fundamentalScore: Math.round((Math.random() - 0.5) * 100),
    sentimentScore: Math.round((Math.random() - 0.4) * 100),
    mtfScore: Math.round((Math.random() - 0.3) * 100),
    structureScore: Math.round((Math.random() - 0.4) * 100),

    entryZone: {
      low: pair.currentPrice * 0.998,
      high: pair.currentPrice * 1.002,
    },
    stopLoss: pair.trend === "bullish" 
      ? pair.currentPrice * 0.99 
      : pair.currentPrice * 1.01,
    targets: [
      pair.currentPrice * (pair.trend === "bullish" ? 1.01 : 0.99),
      pair.currentPrice * (pair.trend === "bullish" ? 1.02 : 0.98),
      pair.currentPrice * (pair.trend === "bullish" ? 1.03 : 0.97),
    ],
    invalidation: pair.trend === "bullish" 
      ? pair.currentPrice * 0.985 
      : pair.currentPrice * 1.015,

    timeframeAnalysis: TIMEFRAMES.slice(4, 8).map((tf) => ({
      timeframe: tf.value,
      trend: ["bullish", "bearish", "sideways"][Math.floor(Math.random() * 3)],
      strength: Math.round(Math.random() * 100),
      signal: ["buy", "sell", "neutral"][Math.floor(Math.random() * 3)],
    })),

    bullishFactors: [
      "Price above 200 EMA on daily timeframe",
      "Strong bullish momentum on H4",
      "Higher highs and higher lows structure",
      "RSI showing bullish divergence",
    ],
    bearishFactors: [
      "Resistance zone approaching",
      "High impact news event in 2 hours",
      "Quote currency showing strength",
    ],
    risks: [
      "FOMC meeting tomorrow may cause volatility",
      "Spread typically widens during London close",
      "Conflicting signals on lower timeframes",
    ],
  };

  const isPositive = pair.dailyChange >= 0;
  const TrendIcon = pair.trend === "sideways" ? Minus : isPositive ? TrendingUp : TrendingDown;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pair.symbol}
                </h1>
                <TrendBadge trend={pair.trend} />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {pair.displayName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-1" />
              Watchlist
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-1" />
              Alert
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Price & Signal Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Price Card */}
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
                    {formatPrice(pair.currentPrice)}
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-2 text-lg font-medium mt-2",
                      isPositive ? "text-green-500" : "text-red-500"
                    )}
                  >
                    <TrendIcon className="h-5 w-5" />
                    <span>{formatPercent(pair.dailyChangePercent)}</span>
                    <span className="text-gray-400">
                      ({isPositive ? "+" : ""}{formatPrice(pair.dailyChange)})
                    </span>
                  </div>
                  <div className="flex gap-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      <span>H:</span>{" "}
                      <span className="font-mono text-green-500">
                        {formatPrice(pair.dailyHigh)}
                      </span>
                    </div>
                    <div>
                      <span>L:</span>{" "}
                      <span className="font-mono text-red-500">
                        {formatPrice(pair.dailyLow)}
                      </span>
                    </div>
                    <div>
                      <span>O:</span>{" "}
                      <span className="font-mono">
                        {formatPrice(pair.dailyOpen)}
                      </span>
                    </div>
                    <div>
                      <span>Spread:</span>{" "}
                      <span className="font-mono">{pair.spread.toFixed(1)} pips</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <ConfidenceMeter confidence={pair.confidence} size="lg" />
                  <div className="mt-2">
                    <SignalBadge signal={pair.signal} size="lg" />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Score: {pair.signalScore}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Signal Card */}
          <Card>
            <CardHeader>
              <CardTitle>Signal Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Direction</span>
                <span className={cn(
                  "font-semibold",
                  pair.trend === "bullish" ? "text-green-500" : 
                  pair.trend === "bearish" ? "text-red-500" : "text-yellow-500"
                )}>
                  {pair.trend.charAt(0).toUpperCase() + pair.trend.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Confidence</span>
                <span className="font-semibold">{pair.confidence}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Horizon</span>
                <Badge>Intraday</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Risk/Reward</span>
                <span className="font-semibold text-green-500">1:2.5</span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ScoreBar
                score={analysisData.technicalScore}
                label={t("analysis.technical")}
              />
              <ScoreBar
                score={analysisData.fundamentalScore}
                label={t("analysis.fundamental")}
              />
              <ScoreBar
                score={analysisData.sentimentScore}
                label={t("analysis.sentiment")}
              />
              <ScoreBar
                score={analysisData.mtfScore}
                label={t("analysis.multiTimeframe")}
              />
              <ScoreBar
                score={analysisData.structureScore}
                label={t("analysis.structure")}
              />
              <ScoreBar
                score={
                  (baseCurrencyStrength?.score || 0) -
                  (quoteCurrencyStrength?.score || 0)
                }
                label={t("analysis.currencyStrength")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeframe Analysis */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t("analysis.multiTimeframe")}</CardTitle>
                  <div className="flex gap-1">
                    {TIMEFRAMES.slice(4, 8).map((tf) => (
                      <button
                        key={tf.value}
                        onClick={() => setSelectedTimeframe(tf.value)}
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded",
                          selectedTimeframe === tf.value
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {tf.value}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 text-sm font-medium text-gray-500">
                          Timeframe
                        </th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">
                          Trend
                        </th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">
                          Signal
                        </th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">
                          Strength
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisData.timeframeAnalysis.map((tf) => (
                        <tr
                          key={tf.timeframe}
                          className="border-b border-gray-100 dark:border-gray-800"
                        >
                          <td className="py-3 font-medium">{tf.timeframe}</td>
                          <td className="py-3">
                            <TrendBadge trend={tf.trend} size="sm" />
                          </td>
                          <td className="py-3">
                            <SignalBadge signal={tf.signal} size="sm" />
                          </td>
                          <td className="py-3">
                            <Progress value={tf.strength} variant="signal" size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Price Levels */}
            <Card>
              <CardHeader>
                <CardTitle>Price Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Entry Zone</span>
                      </div>
                      <span className="font-mono text-sm">
                        {formatPrice(analysisData.entryZone.low)} -{" "}
                        {formatPrice(analysisData.entryZone.high)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Stop Loss</span>
                      </div>
                      <span className="font-mono text-sm text-red-500">
                        {formatPrice(analysisData.stopLoss)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Invalidation</span>
                      </div>
                      <span className="font-mono text-sm text-yellow-600">
                        {formatPrice(analysisData.invalidation)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {analysisData.targets.map((target, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Target {i + 1}</span>
                        </div>
                        <span className="font-mono text-sm text-green-500">
                          {formatPrice(target)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Signal Explanation */}
            <Card>
              <CardHeader>
                <CardTitle>{t("signals.explanation")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Bullish Factors */}
                <div
                  className="border border-green-200 dark:border-green-800 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection("bullish")}
                    className="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-700 dark:text-green-400">
                        {t("signals.bullishFactors")} ({analysisData.bullishFactors.length})
                      </span>
                    </div>
                    {expandedSection === "bullish" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSection === "bullish" && (
                    <div className="p-3 space-y-2">
                      {analysisData.bullishFactors.map((factor, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span className="text-gray-700 dark:text-gray-300">{factor}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bearish Factors */}
                <div
                  className="border border-red-200 dark:border-red-800 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection("bearish")}
                    className="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20"
                  >
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-red-700 dark:text-red-400">
                        {t("signals.bearishFactors")} ({analysisData.bearishFactors.length})
                      </span>
                    </div>
                    {expandedSection === "bearish" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSection === "bearish" && (
                    <div className="p-3 space-y-2">
                      {analysisData.bearishFactors.map((factor, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-red-500 mt-0.5">✗</span>
                          <span className="text-gray-700 dark:text-gray-300">{factor}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Risks */}
                <div
                  className="border border-yellow-200 dark:border-yellow-800 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection("risks")}
                    className="w-full flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-yellow-700 dark:text-yellow-400">
                        {t("signals.risks")} ({analysisData.risks.length})
                      </span>
                    </div>
                    {expandedSection === "risks" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSection === "risks" && (
                    <div className="p-3 space-y-2">
                      {analysisData.risks.map((risk, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-yellow-500 mt-0.5">⚠</span>
                          <span className="text-gray-700 dark:text-gray-300">{risk}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Currency Strength */}
            <Card>
              <CardHeader>
                <CardTitle>{t("analysis.currencyStrength")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {pair.baseCurrency === "EUR" ? "🇪🇺" : pair.baseCurrency === "USD" ? "🇺🇸" : "💱"}
                    </span>
                    <span className="font-medium">{pair.baseCurrency}</span>
                  </div>
                  <span
                    className={cn(
                      "font-bold",
                      (baseCurrencyStrength?.score || 0) > 0
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    {(baseCurrencyStrength?.score || 0) > 0 ? "+" : ""}
                    {baseCurrencyStrength?.score || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {pair.quoteCurrency === "USD" ? "🇺🇸" : pair.quoteCurrency === "JPY" ? "🇯🇵" : "💱"}
                    </span>
                    <span className="font-medium">{pair.quoteCurrency}</span>
                  </div>
                  <span
                    className={cn(
                      "font-bold",
                      (quoteCurrencyStrength?.score || 0) > 0
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    {(quoteCurrencyStrength?.score || 0) > 0 ? "+" : ""}
                    {quoteCurrencyStrength?.score || 0}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                  {(baseCurrencyStrength?.score || 0) > (quoteCurrencyStrength?.score || 0)
                    ? `${pair.baseCurrency} is stronger, supporting bullish bias`
                    : `${pair.quoteCurrency} is stronger, supporting bearish bias`}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.upcomingEvents")}</CardTitle>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No upcoming events for this pair
                  </p>
                ) : (
                  <div className="space-y-3">
                    {events.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">
                            {event.title}
                          </span>
                          <ImpactBadge impact={event.impact} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {event.eventTime.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price Data</span>
                    <Badge variant="warning">Demo</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Technical Analysis</span>
                    <Badge variant="success">Calculated</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">News Sentiment</span>
                    <Badge variant="neutral">Offline</Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Analysis generated at: {new Date().toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Disclaimer:</strong> {t("common.disclaimer")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
