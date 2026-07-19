"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, ImpactBadge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { generateDemoEconomicEvents, type DemoEconomicEvent } from "@/lib/demo-data";
import {
  Calendar,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Bell,
} from "lucide-react";

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

export default function CalendarPage() {
  const { t, language } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterImpact, setFilterImpact] = useState<string>("all");
  const [filterCurrency, setFilterCurrency] = useState<string>("all");

  const events = generateDemoEconomicEvents();

  // Generate more events for different days
  const allEvents: DemoEconomicEvent[] = [];
  for (let i = -3; i <= 7; i++) {
    const dayEvents = events.map((event, index) => ({
      ...event,
      id: `${event.id}-day${i}-${index}`,
      eventTime: new Date(
        new Date().getTime() + i * 24 * 60 * 60 * 1000 + (index * 2 + 1) * 60 * 60 * 1000
      ),
    }));
    allEvents.push(...dayEvents);
  }

  const filteredEvents = allEvents.filter((event) => {
    const eventDate = event.eventTime.toDateString();
    const selectedDateStr = selectedDate.toDateString();
    if (eventDate !== selectedDateStr) return false;
    if (filterImpact !== "all" && event.impact !== filterImpact) return false;
    if (filterCurrency !== "all" && event.currency !== filterCurrency) return false;
    return true;
  });

  const sortedEvents = filteredEvents.sort(
    (a, b) => a.eventTime.getTime() - b.eventTime.getTime()
  );

  const currencies = ["all", "USD", "EUR", "GBP", "JPY", "CHF", "AUD", "NZD", "CAD"];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isPast = (event: DemoEconomicEvent) => event.eventTime < new Date();
  const isUpcoming = (event: DemoEconomicEvent) => {
    const diff = event.eventTime.getTime() - new Date().getTime();
    return diff > 0 && diff < 60 * 60 * 1000; // Within 1 hour
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              {t("calendar.title")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Track upcoming economic events and their potential market impact
            </p>
          </div>
        </div>

        {/* Date Navigation */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(selectedDate)}
                  </div>
                  {isToday && (
                    <Badge variant="info" className="mt-1">
                      {t("calendar.today")}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant={isToday ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                >
                  {t("calendar.today")}
                </Button>
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

              {/* Impact Filter */}
              <div className="flex gap-1">
                {["all", "high", "medium", "low"].map((impact) => (
                  <button
                    key={impact}
                    onClick={() => setFilterImpact(impact)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                      filterImpact === impact
                        ? impact === "high"
                          ? "bg-red-500 text-white"
                          : impact === "medium"
                          ? "bg-yellow-500 text-white"
                          : impact === "low"
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {impact.charAt(0).toUpperCase() + impact.slice(1)}
                  </button>
                ))}
              </div>

              {/* Currency Filter */}
              <select
                value={filterCurrency}
                onChange={(e) => setFilterCurrency(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr === "all" ? "All Currencies" : curr}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Events ({sortedEvents.length})</CardTitle>
              {sortedEvents.some((e) => e.impact === "high" && isUpcoming(e)) && (
                <Badge variant="danger" className="animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  High Impact Event Soon
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {sortedEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No events found for this day</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "p-4 rounded-lg border transition-colors",
                      isPast(event)
                        ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60"
                        : isUpcoming(event) && event.impact === "high"
                        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 animate-pulse"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    )}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">
                          {countryFlags[event.country] || "🌍"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {event.title}
                            </span>
                            <ImpactBadge impact={event.impact} />
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(event.eventTime)}
                            </span>
                            <Badge variant="default">{event.currency}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 md:gap-8">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 uppercase">
                            {t("calendar.previous")}
                          </div>
                          <div className="font-mono font-medium text-gray-700 dark:text-gray-300">
                            {event.previous || "-"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 uppercase">
                            {t("calendar.forecast")}
                          </div>
                          <div className="font-mono font-medium text-gray-700 dark:text-gray-300">
                            {event.forecast || "-"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 uppercase">
                            {t("calendar.actual")}
                          </div>
                          <div
                            className={cn(
                              "font-mono font-medium",
                              event.actual
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-400"
                            )}
                          >
                            {event.actual || "-"}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Upcoming Warning */}
                    {isUpcoming(event) && event.impact === "high" && (
                      <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                          <AlertTriangle className="h-4 w-4" />
                          <span>
                            High impact event starting soon. Expect increased volatility
                            and potential spread widening.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span className="text-gray-600 dark:text-gray-400">
                  {t("calendar.highImpact")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span className="text-gray-600 dark:text-gray-400">
                  {t("calendar.mediumImpact")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-gray-600 dark:text-gray-400">
                  {t("calendar.lowImpact")}
                </span>
              </div>
              <div className="border-l border-gray-300 dark:border-gray-600 pl-6 text-gray-500">
                All times shown in your local timezone
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
