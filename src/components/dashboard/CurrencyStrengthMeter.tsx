"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ScoreBar } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface CurrencyStrength {
  currency: string;
  score: number;
  change: number;
  rank: number;
}

interface CurrencyStrengthMeterProps {
  currencies: CurrencyStrength[];
}

const currencyFlags: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  CHF: "🇨🇭",
  AUD: "🇦🇺",
  NZD: "🇳🇿",
  CAD: "🇨🇦",
};

export function CurrencyStrengthMeter({ currencies }: CurrencyStrengthMeterProps) {
  const { t } = useApp();
  
  const sortedCurrencies = [...currencies].sort((a, b) => b.score - a.score);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.currencyStrength")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedCurrencies.map((currency, index) => {
          const isFirst = index === 0;
          const isLast = index === sortedCurrencies.length - 1;
          const ChangeIcon = currency.change > 0 ? TrendingUp : currency.change < 0 ? TrendingDown : Minus;
          
          return (
            <div key={currency.currency} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{currencyFlags[currency.currency]}</span>
                  <span
                    className={cn(
                      "font-semibold",
                      isFirst
                        ? "text-green-500"
                        : isLast
                        ? "text-red-500"
                        : "text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {currency.currency}
                  </span>
                  {isFirst && (
                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded">
                      {t("dashboard.strongestCurrency")}
                    </span>
                  )}
                  {isLast && (
                    <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded">
                      {t("dashboard.weakestCurrency")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <ChangeIcon
                    className={cn(
                      "h-4 w-4",
                      currency.change > 0
                        ? "text-green-500"
                        : currency.change < 0
                        ? "text-red-500"
                        : "text-gray-400"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      currency.score > 0 ? "text-green-500" : currency.score < 0 ? "text-red-500" : "text-gray-500"
                    )}
                  >
                    {currency.score > 0 ? "+" : ""}{currency.score}
                  </span>
                </div>
              </div>
              <ScoreBar score={currency.score} showValue={false} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function CurrencyStrengthHeatmap({ currencies }: CurrencyStrengthMeterProps) {
  const getColor = (score: number) => {
    if (score > 50) return "bg-green-500 text-white";
    if (score > 25) return "bg-green-400 text-white";
    if (score > 0) return "bg-green-300 text-gray-900";
    if (score > -25) return "bg-red-300 text-gray-900";
    if (score > -50) return "bg-red-400 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {currencies.map((currency) => (
        <div
          key={currency.currency}
          className={cn(
            "p-3 rounded-lg text-center transition-transform hover:scale-105",
            getColor(currency.score)
          )}
        >
          <div className="text-lg mb-1">{currencyFlags[currency.currency]}</div>
          <div className="font-bold">{currency.currency}</div>
          <div className="text-sm opacity-90">
            {currency.score > 0 ? "+" : ""}{currency.score}
          </div>
        </div>
      ))}
    </div>
  );
}
