"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { PairCard, PairCardSkeleton } from "@/components/dashboard/PairCard";
import { CurrencyStrengthMeter, CurrencyStrengthHeatmap } from "@/components/dashboard/CurrencyStrengthMeter";
import { EconomicCalendarWidget } from "@/components/dashboard/EconomicCalendarWidget";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import {
  generateDemoPairData,
  generateDemoCurrencyStrength,
  generateDemoEconomicEvents,
  generateDemoMarketStats,
  generateDemoTradingSessions,
  DEMO_DISCLAIMER,
  type DemoPairData,
} from "@/lib/demo-data";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Info,
  X
} from "lucide-react";

export default function Dashboard() {
  const { t } = useApp();
  const [pairs, setPairs] = useState<DemoPairData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setPairs(generateDemoPairData());
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const currencyStrength = generateDemoCurrencyStrength();
  const economicEvents = generateDemoEconomicEvents();
  const marketStats = generateDemoMarketStats(pairs);
  const tradingSessions = generateDemoTradingSessions();

  // Get top movers
  const topGainers = [...pairs]
    .sort((a, b) => b.dailyChangePercent - a.dailyChangePercent)
    .slice(0, 3);
  
  const topLosers = [...pairs]
    .sort((a, b) => a.dailyChangePercent - b.dailyChangePercent)
    .slice(0, 3);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Demo Data Warning */}
        {showDisclaimer && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Demo Data Mode
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  This platform is displaying simulated data for demonstration purposes only.
                  Do NOT use for real trading decisions. Real-time data requires configured API providers.
                </p>
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("dashboard.title")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Demo
              </span>
            </Badge>
          </div>
        </div>

        {/* Market Overview */}
        <MarketOverview sessions={tradingSessions} stats={marketStats} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Pairs Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Currency Pairs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Currency Pairs
                </h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <PairCardSkeleton key={i} />
                    ))
                  : pairs.slice(0, 6).map((pair) => (
                      <PairCard
                        key={pair.symbol}
                        pair={{
                          ...pair,
                          displayName: pair.displayName,
                        }}
                      />
                    ))}
              </div>
            </div>

            {/* Top Movers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Gainers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    {t("dashboard.topGainers")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topGainers.map((pair) => (
                    <div
                      key={pair.symbol}
                      className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        {pair.symbol}
                      </span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        +{pair.dailyChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top Losers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    {t("dashboard.topLosers")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topLosers.map((pair) => (
                    <div
                      key={pair.symbol}
                      className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/20"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        {pair.symbol}
                      </span>
                      <span className="text-red-600 dark:text-red-400 font-semibold">
                        {pair.dailyChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="space-y-6">
            {/* Currency Strength */}
            <CurrencyStrengthMeter currencies={currencyStrength} />

            {/* Economic Calendar */}
            <EconomicCalendarWidget events={economicEvents} maxEvents={5} />

            {/* Data Provider Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {t("dashboard.dataProviders")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Market Data
                  </span>
                  <Badge variant="warning">Demo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Economic Calendar
                  </span>
                  <Badge variant="warning">Demo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    News Feed
                  </span>
                  <Badge variant="neutral">Offline</Badge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                  Configure API keys in settings to enable live data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <Card className="bg-gray-50 dark:bg-gray-900/50 border-dashed">
          <CardContent className="py-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {t("common.disclaimer")}
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
