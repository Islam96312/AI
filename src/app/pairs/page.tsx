"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { PairCard } from "@/components/dashboard/PairCard";
import { Button } from "@/components/ui/Button";
import { Badge, SignalBadge, TrendBadge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";
import { cn, formatPrice, formatPercent } from "@/lib/utils";
import { generateDemoPairData, type DemoPairData } from "@/lib/demo-data";
import {
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

type SortField = "symbol" | "price" | "change" | "signal" | "confidence";
type SortOrder = "asc" | "desc";
type ViewMode = "grid" | "table";
type FilterCategory = "all" | "major" | "cross" | "commodity";

export default function PairsPage() {
  const { t } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("symbol");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [filterSignal, setFilterSignal] = useState<string>("all");

  const allPairs = generateDemoPairData();

  const filteredAndSortedPairs = useMemo(() => {
    let result = [...allPairs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (pair) =>
          pair.symbol.toLowerCase().includes(query) ||
          pair.baseCurrency.toLowerCase().includes(query) ||
          pair.quoteCurrency.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      const categoryMap: Record<string, string[]> = {
        major: ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "NZD/USD", "USD/CAD"],
        cross: ["EUR/GBP", "EUR/JPY", "GBP/JPY"],
        commodity: ["XAU/USD"],
      };
      result = result.filter((pair) => categoryMap[filterCategory]?.includes(pair.symbol));
    }

    // Signal filter
    if (filterSignal !== "all") {
      result = result.filter((pair) => pair.signal === filterSignal);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "symbol":
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case "price":
          comparison = a.currentPrice - b.currentPrice;
          break;
        case "change":
          comparison = a.dailyChangePercent - b.dailyChangePercent;
          break;
        case "signal":
          const signalOrder = ["strong_buy", "buy", "neutral", "sell", "strong_sell"];
          comparison = signalOrder.indexOf(a.signal) - signalOrder.indexOf(b.signal);
          break;
        case "confidence":
          comparison = a.confidence - b.confidence;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [allPairs, searchQuery, sortField, sortOrder, filterCategory, filterSignal]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = sortOrder === "asc" ? SortAsc : SortDesc;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("nav.pairs")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              View and analyze all currency pairs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info">{filteredAndSortedPairs.length} pairs</Badge>
          </div>
        </div>

        {/* Filters & Controls */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pairs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2">
                {(["all", "major", "cross", "commodity"] as FilterCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      filterCategory === cat
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    )}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Signal Filter */}
              <select
                value={filterSignal}
                onChange={(e) => setFilterSignal(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Signals</option>
                <option value="strong_buy">Strong Buy</option>
                <option value="buy">Buy</option>
                <option value="neutral">Neutral</option>
                <option value="sell">Sell</option>
                <option value="strong_sell">Strong Sell</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded",
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 shadow"
                      : "hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "p-2 rounded",
                    viewMode === "table"
                      ? "bg-white dark:bg-gray-600 shadow"
                      : "hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedPairs.map((pair) => (
              <PairCard
                key={pair.symbol}
                pair={{
                  ...pair,
                  displayName: pair.displayName,
                  lastUpdated: pair.lastUpdated,
                }}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th
                        className="text-left px-4 py-3 text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => handleSort("symbol")}
                      >
                        <div className="flex items-center gap-1">
                          Pair
                          {sortField === "symbol" && <SortIcon className="h-4 w-4" />}
                        </div>
                      </th>
                      <th
                        className="text-right px-4 py-3 text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => handleSort("price")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Price
                          {sortField === "price" && <SortIcon className="h-4 w-4" />}
                        </div>
                      </th>
                      <th
                        className="text-right px-4 py-3 text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => handleSort("change")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Change
                          {sortField === "change" && <SortIcon className="h-4 w-4" />}
                        </div>
                      </th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">
                        Trend
                      </th>
                      <th
                        className="text-center px-4 py-3 text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => handleSort("signal")}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Signal
                          {sortField === "signal" && <SortIcon className="h-4 w-4" />}
                        </div>
                      </th>
                      <th
                        className="text-center px-4 py-3 text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => handleSort("confidence")}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Confidence
                          {sortField === "confidence" && <SortIcon className="h-4 w-4" />}
                        </div>
                      </th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-gray-500">
                        Spread
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedPairs.map((pair) => {
                      const isPositive = pair.dailyChangePercent >= 0;
                      const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

                      return (
                        <tr
                          key={pair.symbol}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="px-4 py-3">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {pair.symbol}
                            </div>
                            <div className="text-xs text-gray-500">
                              {pair.displayName}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-white">
                            {formatPrice(pair.currentPrice)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div
                              className={cn(
                                "flex items-center justify-end gap-1",
                                isPositive ? "text-green-500" : "text-red-500"
                              )}
                            >
                              <ChangeIcon className="h-4 w-4" />
                              <span className="font-medium">
                                {formatPercent(pair.dailyChangePercent)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <TrendBadge trend={pair.trend} size="sm" />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <SignalBadge signal={pair.signal} size="sm" />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={cn(
                                "font-medium",
                                pair.confidence >= 70
                                  ? "text-green-500"
                                  : pair.confidence >= 50
                                  ? "text-yellow-500"
                                  : "text-red-500"
                              )}
                            >
                              {pair.confidence}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-500">
                            {pair.spread.toFixed(1)}
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              href={`/pairs/${pair.symbol.replace("/", "-")}`}
                              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 inline-flex"
                            >
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredAndSortedPairs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No pairs found matching your criteria
              </p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setFilterCategory("all");
                  setFilterSignal("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
