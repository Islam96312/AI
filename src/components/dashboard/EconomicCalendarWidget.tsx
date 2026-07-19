"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ImpactBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { Clock, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  currency: string;
  eventTime: Date;
  impact: "high" | "medium" | "low";
  previous?: string;
  forecast?: string;
  actual?: string;
}

interface EconomicCalendarWidgetProps {
  events: EconomicEvent[];
  maxEvents?: number;
}

const countryFlags: Record<string, string> = {
  US: "🇺🇸",
  EU: "🇪🇺",
  GB: "🇬🇧",
  JP: "🇯🇵",
  CH: "🇨🇭",
  AU: "🇦🇺",
  NZ: "🇳🇿",
  CA: "🇨🇦",
  CN: "🇨🇳",
  DE: "🇩🇪",
  FR: "🇫🇷",
};

export function EconomicCalendarWidget({ events, maxEvents = 5 }: EconomicCalendarWidgetProps) {
  const { t, language } = useApp();
  
  const upcomingEvents = events
    .filter((e) => e.eventTime > new Date())
    .slice(0, maxEvents);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const isHighImpactSoon = (event: EconomicEvent) => {
    const diff = event.eventTime.getTime() - new Date().getTime();
    return event.impact === "high" && diff < 60 * 60 * 1000; // Within 1 hour
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("dashboard.upcomingEvents")}</CardTitle>
        <Clock className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            {t("common.noData")}
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "p-3 rounded-lg border transition-colors",
                  isHighImpactSoon(event)
                    ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {countryFlags[event.country] || "🌍"}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {event.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {event.currency}
                        </span>
                        <ImpactBadge impact={event.impact} size="sm" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatTime(event.eventTime)}
                    </div>
                    <div
                      className={cn(
                        "text-xs font-medium",
                        isHighImpactSoon(event)
                          ? "text-red-500"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                    >
                      {getTimeUntil(event.eventTime)}
                    </div>
                  </div>
                </div>

                {/* Values */}
                {(event.previous || event.forecast) && (
                  <div className="flex gap-4 mt-2 text-xs">
                    {event.previous && (
                      <div>
                        <span className="text-gray-500">{t("calendar.previous")}: </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {event.previous}
                        </span>
                      </div>
                    )}
                    {event.forecast && (
                      <div>
                        <span className="text-gray-500">{t("calendar.forecast")}: </span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {event.forecast}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Warning for high impact */}
                {isHighImpactSoon(event) && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{t("calendar.eventRisk")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
