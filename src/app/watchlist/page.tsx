"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, SignalBadge, TrendBadge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";
import { cn, formatPrice, formatPercent } from "@/lib/utils";
import { generateDemoPairData } from "@/lib/demo-data";
import {
  Star,
  Plus,
  Trash2,
  GripVertical,
  TrendingUp,
  TrendingDown,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function WatchlistPage() {
  const { t } = useApp();
  const allPairs = generateDemoPairData();
  
  const [watchlist, setWatchlist] = useState<string[]>([
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "XAU/USD",
  ]);

  const watchlistPairs = allPairs.filter((p) => watchlist.includes(p.symbol));
  const availablePairs = allPairs.filter((p) => !watchlist.includes(p.symbol));

  const addToWatchlist = (symbol: string) => {
    setWatchlist((prev) => [...prev, symbol]);
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((s) => s !== symbol));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              {t("nav.watchlist")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Track your favorite currency pairs
            </p>
          </div>
          <Badge variant="info">{watchlist.length} pairs</Badge>
        </div>

        {/* Watchlist */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Watchlist</CardTitle>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {watchlistPairs.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Your watchlist is empty
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Add pairs from the list below
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {watchlistPairs.map((pair, index) => {
                  const isPositive = pair.dailyChangePercent >= 0;
                  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

                  return (
                    <div
                      key={pair.symbol}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                      
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {pair.symbol}
                          </div>
                          <div className="text-xs text-gray-500">
                            {pair.displayName}
                          </div>
                        </div>
                        
                        <div className="text-right md:text-left">
                          <div className="font-mono text-gray-900 dark:text-white">
                            {formatPrice(pair.currentPrice)}
                          </div>
                          <div
                            className={cn(
                              "flex items-center gap-1 text-sm",
                              isPositive ? "text-green-500" : "text-red-500"
                            )}
                          >
                            <ChangeIcon className="h-3 w-3" />
                            {formatPercent(pair.dailyChangePercent)}
                          </div>
                        </div>
                        
                        <div className="hidden md:block">
                          <TrendBadge trend={pair.trend} size="sm" />
                        </div>
                        
                        <div className="hidden md:flex items-center gap-2">
                          <SignalBadge signal={pair.signal} size="sm" />
                          <span className="text-xs text-gray-500">
                            {pair.confidence}%
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/pairs/${pair.symbol.replace("/", "-")}`}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          >
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </Link>
                          <button
                            onClick={() => removeFromWatchlist(pair.symbol)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Pairs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add to Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {availablePairs.map((pair) => (
                <button
                  key={pair.symbol}
                  onClick={() => addToWatchlist(pair.symbol)}
                  className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {pair.symbol}
                    </span>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatPrice(pair.currentPrice)}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
