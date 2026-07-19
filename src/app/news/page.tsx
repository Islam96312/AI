"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, ImpactBadge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import {
  Newspaper,
  ExternalLink,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  publishedAt: Date;
  currencies: string[];
  sentiment: "bullish" | "bearish" | "neutral";
  impact: "high" | "medium" | "low";
}

const demoNews: NewsItem[] = [
  {
    id: "1",
    title: "Federal Reserve Signals Potential Rate Pause in Coming Months",
    summary: "Fed officials indicated they may hold rates steady as inflation shows signs of cooling, potentially impacting USD strength across major pairs.",
    source: "Reuters",
    sourceUrl: "https://reuters.com",
    publishedAt: new Date(Date.now() - 30 * 60 * 1000),
    currencies: ["USD"],
    sentiment: "bearish",
    impact: "high",
  },
  {
    id: "2",
    title: "ECB Maintains Hawkish Stance Despite Economic Slowdown",
    summary: "European Central Bank officials continue to emphasize the need for further tightening to combat persistent inflation in the eurozone.",
    source: "Bloomberg",
    sourceUrl: "https://bloomberg.com",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    currencies: ["EUR"],
    sentiment: "bullish",
    impact: "high",
  },
  {
    id: "3",
    title: "UK Employment Data Beats Expectations",
    summary: "British job market remains resilient with unemployment rate holding steady, supporting GBP against major currencies.",
    source: "Financial Times",
    sourceUrl: "https://ft.com",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    currencies: ["GBP"],
    sentiment: "bullish",
    impact: "medium",
  },
  {
    id: "4",
    title: "Bank of Japan Maintains Ultra-Loose Policy",
    summary: "BOJ keeps yield curve control unchanged, widening the policy divergence with other major central banks.",
    source: "Nikkei",
    sourceUrl: "https://nikkei.com",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    currencies: ["JPY"],
    sentiment: "bearish",
    impact: "high",
  },
  {
    id: "5",
    title: "Gold Prices Surge on Safe-Haven Demand",
    summary: "XAU/USD climbs to multi-week highs as geopolitical tensions and economic uncertainty drive investors to precious metals.",
    source: "Kitco",
    sourceUrl: "https://kitco.com",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    currencies: ["XAU"],
    sentiment: "bullish",
    impact: "medium",
  },
];

export default function NewsPage() {
  const { t, language } = useApp();
  const [filterSentiment, setFilterSentiment] = useState<string>("all");
  const [filterCurrency, setFilterCurrency] = useState<string>("all");

  const filteredNews = demoNews.filter((news) => {
    if (filterSentiment !== "all" && news.sentiment !== filterSentiment) return false;
    if (filterCurrency !== "all" && !news.currencies.includes(filterCurrency)) return false;
    return true;
  });

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "bearish":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "text-green-500";
      case "bearish":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Newspaper className="h-6 w-6" />
              {t("news.title")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Stay updated with market-moving news
            </p>
          </div>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Demo Notice */}
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Demo Mode:</strong> This page displays sample news for demonstration.
                Live news requires API integration with authorized news providers.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">{t("common.filter")}:</span>
              </div>

              <div className="flex gap-1">
                {["all", "bullish", "neutral", "bearish"].map((sentiment) => (
                  <button
                    key={sentiment}
                    onClick={() => setFilterSentiment(sentiment)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                      filterSentiment === sentiment
                        ? sentiment === "bullish"
                          ? "bg-green-500 text-white"
                          : sentiment === "bearish"
                          ? "bg-red-500 text-white"
                          : sentiment === "neutral"
                          ? "bg-yellow-500 text-white"
                          : "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                  </button>
                ))}
              </div>

              <select
                value={filterCurrency}
                onChange={(e) => setFilterCurrency(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              >
                <option value="all">All Currencies</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="XAU">Gold</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* News List */}
        <div className="space-y-4">
          {filteredNews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Newspaper className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {t("news.noNews")}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNews.map((news) => (
              <Card key={news.id} hover>
                <CardContent className="py-4">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        {getSentimentIcon(news.sentiment)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {news.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {news.summary}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(news.publishedAt)}
                            </div>
                            <span className="text-xs text-gray-500">
                              {news.source}
                            </span>
                            <ImpactBadge impact={news.impact} />
                            <div className="flex gap-1">
                              {news.currencies.map((currency) => (
                                <Badge key={currency} variant="default">
                                  {currency}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={cn("text-sm font-medium", getSentimentColor(news.sentiment))}>
                          {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
                        </div>
                        <div className="text-xs text-gray-500">Sentiment</div>
                      </div>
                      <a
                        href={news.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
