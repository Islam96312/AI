"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { FOREX_PAIRS } from "@/lib/constants";
import {
  Calculator,
  AlertTriangle,
  DollarSign,
  Target,
  Shield,
  TrendingUp,
  Info,
} from "lucide-react";

export default function RiskCalculatorPage() {
  const { t } = useApp();
  
  const [formData, setFormData] = useState({
    pair: "EUR/USD",
    accountBalance: 10000,
    riskPercent: 1,
    entryPrice: 1.085,
    stopLoss: 1.08,
    takeProfit: 1.095,
    spread: 1.2,
    commission: 0,
  });

  const [results, setResults] = useState<{
    lotSize: number;
    pipValue: number;
    riskAmount: number;
    potentialProfit: number;
    stopLossPips: number;
    takeProfitPips: number;
    riskRewardRatio: number;
  } | null>(null);

  const calculateRisk = () => {
    const pair = FOREX_PAIRS.find((p) => p.symbol === formData.pair);
    const pipSize = pair?.pipSize || 0.0001;
    const isJPY = formData.pair.includes("JPY");

    const stopLossPips = Math.abs(formData.entryPrice - formData.stopLoss) / pipSize;
    const takeProfitPips = Math.abs(formData.takeProfit - formData.entryPrice) / pipSize;
    const riskAmount = formData.accountBalance * (formData.riskPercent / 100);

    // Simplified pip value calculation (assuming standard lot)
    const standardPipValue = isJPY ? 1000 / formData.entryPrice : 10;
    const pipValuePerLot = standardPipValue;

    // Calculate lot size
    const lotSize = riskAmount / (stopLossPips * pipValuePerLot);

    // Calculate actual values
    const actualPipValue = lotSize * pipValuePerLot;
    const potentialProfit = takeProfitPips * actualPipValue;
    const riskRewardRatio = takeProfitPips / stopLossPips;

    setResults({
      lotSize: Math.round(lotSize * 100) / 100,
      pipValue: Math.round(actualPipValue * 100) / 100,
      riskAmount: Math.round(riskAmount * 100) / 100,
      potentialProfit: Math.round(potentialProfit * 100) / 100,
      stopLossPips: Math.round(stopLossPips * 10) / 10,
      takeProfitPips: Math.round(takeProfitPips * 10) / 10,
      riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setResults(null);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            {t("risk.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Calculate position size and risk parameters for your trades
          </p>
        </div>

        {/* Warning */}
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                {t("risk.warning")}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Trade Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pair Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Currency Pair
                </label>
                <select
                  value={formData.pair}
                  onChange={(e) => handleInputChange("pair", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {FOREX_PAIRS.map((pair) => (
                    <option key={pair.symbol} value={pair.symbol}>
                      {pair.symbol}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Balance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("risk.accountBalance")} (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.accountBalance}
                    onChange={(e) => handleInputChange("accountBalance", parseFloat(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Risk Percent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("risk.riskPercent")}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={formData.riskPercent}
                    onChange={(e) => handleInputChange("riskPercent", parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-16 text-right font-mono text-gray-900 dark:text-white">
                    {formData.riskPercent}%
                  </span>
                </div>
                {formData.riskPercent > 2 && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    High risk - consider reducing
                  </p>
                )}
              </div>

              {/* Entry Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("risk.entryPrice")}
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={formData.entryPrice}
                  onChange={(e) => handleInputChange("entryPrice", parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Stop Loss */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("risk.stopLoss")}
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400" />
                  <input
                    type="number"
                    step="0.00001"
                    value={formData.stopLoss}
                    onChange={(e) => handleInputChange("stopLoss", parseFloat(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Take Profit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("risk.target")}
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400" />
                  <input
                    type="number"
                    step="0.00001"
                    value={formData.takeProfit}
                    onChange={(e) => handleInputChange("takeProfit", parseFloat(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Spread & Commission */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("risk.spread")} (pips)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.spread}
                    onChange={(e) => handleInputChange("spread", parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t("risk.commission")} ($)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.commission}
                    onChange={(e) => handleInputChange("commission", parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button onClick={calculateRisk} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                {t("risk.calculate")}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Calculation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  {/* Main Results */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t("risk.lotSize")}
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {results.lotSize}
                      </div>
                      <div className="text-xs text-gray-400">standard lots</div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t("risk.pipValue")}
                      </div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        ${results.pipValue}
                      </div>
                      <div className="text-xs text-gray-400">per pip</div>
                    </div>
                  </div>

                  {/* Risk/Reward */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t("risk.maxLoss")}
                      </span>
                      <span className="font-bold text-red-500">
                        ${results.riskAmount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t("risk.potentialProfit")}
                      </span>
                      <span className="font-bold text-green-500">
                        ${results.potentialProfit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">
                        Risk/Reward Ratio
                      </span>
                      <Badge
                        variant={results.riskRewardRatio >= 2 ? "success" : results.riskRewardRatio >= 1.5 ? "warning" : "danger"}
                      >
                        1:{results.riskRewardRatio}
                      </Badge>
                    </div>
                  </div>

                  {/* Pips Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="text-xs text-gray-500">Stop Loss Distance</div>
                      <div className="font-bold text-red-500">
                        {results.stopLossPips} pips
                      </div>
                    </div>
                    <div className="p-3 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="text-xs text-gray-500">Take Profit Distance</div>
                      <div className="font-bold text-green-500">
                        {results.takeProfitPips} pips
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        {results.riskRewardRatio < 1.5 ? (
                          <span>
                            ⚠️ Risk/Reward ratio below 1.5 is generally not recommended.
                            Consider adjusting your take profit or stop loss levels.
                          </span>
                        ) : results.riskRewardRatio >= 2 ? (
                          <span>
                            ✓ Good risk/reward ratio. This trade setup aligns with sound
                            risk management principles.
                          </span>
                        ) : (
                          <span>
                            Acceptable risk/reward ratio, but consider whether higher
                            R:R targets are feasible.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter your trade parameters and click Calculate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Risk Management Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Risk Management Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  1-2% Rule
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Never risk more than 1-2% of your account on a single trade.
                  This helps preserve capital during losing streaks.
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Minimum 1:1.5 R:R
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Aim for trades with at least 1:1.5 risk/reward ratio.
                  This allows profitability even with 50% win rate.
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Account for Spread
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Always factor in spread costs. Wide spreads during news
                  events can significantly impact your actual risk.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
