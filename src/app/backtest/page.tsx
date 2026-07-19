"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { FOREX_PAIRS, TIMEFRAMES } from "@/lib/constants";
import {
  History,
  Play,
  Settings,
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface BacktestResult {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  expectancy: number;
  maxDrawdown: number;
  sharpeRatio: number;
  totalPnl: number;
}

export default function BacktestPage() {
  const { t } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const [config, setConfig] = useState({
    pair: "EUR/USD",
    timeframe: "H1",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    initialBalance: 10000,
    riskPercent: 1,
    spread: 1.5,
    commission: 0,
  });

  const runBacktest = () => {
    setIsRunning(true);
    setProgress(0);
    setResult(null);

    // Simulate backtest progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);

          // Generate demo results
          const winRate = 45 + Math.random() * 20;
          const totalTrades = 100 + Math.floor(Math.random() * 200);
          const winningTrades = Math.floor(totalTrades * (winRate / 100));

          setResult({
            totalTrades,
            winningTrades,
            losingTrades: totalTrades - winningTrades,
            winRate,
            profitFactor: 1.2 + Math.random() * 0.8,
            expectancy: 5 + Math.random() * 15,
            maxDrawdown: 8 + Math.random() * 12,
            sharpeRatio: 0.5 + Math.random() * 1.5,
            totalPnl: -2000 + Math.random() * 6000,
          });

          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <History className="h-6 w-6" />
            {t("nav.backtest")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Test strategies on historical data
          </p>
        </div>

        {/* Warning */}
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> Backtesting uses historical data and does NOT
                guarantee future performance. Results may include look-ahead bias if not
                properly configured. Always validate with out-of-sample testing.
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Currency Pair</label>
                <select
                  value={config.pair}
                  onChange={(e) => setConfig({ ...config, pair: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                >
                  {FOREX_PAIRS.map((pair) => (
                    <option key={pair.symbol} value={pair.symbol}>
                      {pair.symbol}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Timeframe</label>
                <select
                  value={config.timeframe}
                  onChange={(e) => setConfig({ ...config, timeframe: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                >
                  {TIMEFRAMES.map((tf) => (
                    <option key={tf.value} value={tf.value}>
                      {tf.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={config.startDate}
                    onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={config.endDate}
                    onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Initial Balance ($)</label>
                <input
                  type="number"
                  value={config.initialBalance}
                  onChange={(e) =>
                    setConfig({ ...config, initialBalance: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Risk per Trade (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.riskPercent}
                  onChange={(e) =>
                    setConfig({ ...config, riskPercent: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Spread (pips)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.spread}
                    onChange={(e) =>
                      setConfig({ ...config, spread: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Commission ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.commission}
                    onChange={(e) =>
                      setConfig({ ...config, commission: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              <Button
                onClick={runBacktest}
                isLoading={isRunning}
                className="w-full"
                disabled={isRunning}
              >
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? "Running..." : "Run Backtest"}
              </Button>

              {isRunning && (
                <div className="space-y-2">
                  <Progress value={progress} showLabel />
                  <p className="text-xs text-gray-500 text-center">
                    Processing historical data...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Backtest Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {result.totalTrades}
                      </div>
                      <div className="text-sm text-gray-500">Total Trades</div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <div
                        className={cn(
                          "text-2xl font-bold",
                          result.winRate >= 50 ? "text-green-500" : "text-red-500"
                        )}
                      >
                        {result.winRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500">Win Rate</div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <div
                        className={cn(
                          "text-2xl font-bold",
                          result.profitFactor >= 1 ? "text-green-500" : "text-red-500"
                        )}
                      >
                        {result.profitFactor.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">Profit Factor</div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <div
                        className={cn(
                          "text-2xl font-bold",
                          result.totalPnl >= 0 ? "text-green-500" : "text-red-500"
                        )}
                      >
                        ${result.totalPnl.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-500">Total P&L</div>
                    </div>
                  </div>

                  {/* Win/Loss Distribution */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Trade Distribution
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-green-500 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Winners: {result.winningTrades}
                          </span>
                          <span className="text-red-500 flex items-center gap-1">
                            <XCircle className="h-4 w-4" />
                            Losers: {result.losingTrades}
                          </span>
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                          <div
                            className="bg-green-500 h-full"
                            style={{ width: `${result.winRate}%` }}
                          />
                          <div
                            className="bg-red-500 h-full"
                            style={{ width: `${100 - result.winRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="text-sm text-gray-500">Expectancy</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${result.expectancy.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="text-sm text-gray-500">Max Drawdown</div>
                      <div className="text-lg font-semibold text-red-500">
                        {result.maxDrawdown.toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="text-sm text-gray-500">Sharpe Ratio</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {result.sharpeRatio.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> These results are based on demo data and
                    historical simulation. Actual trading results may vary significantly
                    due to market conditions, slippage, and execution delays.
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Configure your backtest parameters and click "Run Backtest"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
