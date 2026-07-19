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
  Bell,
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  TrendingDown,
  Clock,
  Mail,
  Smartphone,
  X,
} from "lucide-react";

interface Alert {
  id: string;
  name: string;
  pair: string;
  type: "price_above" | "price_below" | "signal_change" | "trend_change";
  value?: number;
  channels: string[];
  status: "active" | "triggered" | "expired";
  createdAt: Date;
  triggeredAt?: Date;
}

const demoAlerts: Alert[] = [
  {
    id: "1",
    name: "EUR/USD Break Above",
    pair: "EUR/USD",
    type: "price_above",
    value: 1.09,
    channels: ["app", "email"],
    status: "active",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "GBP/USD Signal Change",
    pair: "GBP/USD",
    type: "signal_change",
    channels: ["app", "telegram"],
    status: "active",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "USD/JPY Support Break",
    pair: "USD/JPY",
    type: "price_below",
    value: 148.5,
    channels: ["app"],
    status: "triggered",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    triggeredAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

export default function AlertsPage() {
  const { t } = useApp();
  const [alerts, setAlerts] = useState<Alert[]>(demoAlerts);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredAlerts = alerts.filter((alert) => {
    if (filterStatus === "all") return true;
    return alert.status === filterStatus;
  });

  const getAlertTypeIcon = (type: Alert["type"]) => {
    switch (type) {
      case "price_above":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "price_below":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "signal_change":
        return <Bell className="h-4 w-4 text-blue-500" />;
      case "trend_change":
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
    }
  };

  const getAlertTypeLabel = (type: Alert["type"]) => {
    switch (type) {
      case "price_above":
        return "Price Above";
      case "price_below":
        return "Price Below";
      case "signal_change":
        return "Signal Change";
      case "trend_change":
        return "Trend Change";
    }
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="h-6 w-6" />
              {t("alerts.title")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage your price and signal alerts
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("alerts.create")}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{t("alerts.active")}</p>
                  <p className="text-2xl font-bold text-green-500">
                    {alerts.filter((a) => a.status === "active").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Bell className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{t("alerts.triggered")}</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {alerts.filter((a) => a.status === "triggered").length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{t("alerts.expired")}</p>
                  <p className="text-2xl font-bold text-gray-500">
                    {alerts.filter((a) => a.status === "expired").length}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <X className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex gap-2">
              {["all", "active", "triggered", "expired"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    filterStatus === status
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Alerts ({filteredAlerts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No alerts found
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create your first alert
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      alert.status === "active"
                        ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                        : alert.status === "triggered"
                        ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getAlertTypeIcon(alert.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {alert.name}
                            </span>
                            <Badge
                              variant={
                                alert.status === "active"
                                  ? "success"
                                  : alert.status === "triggered"
                                  ? "info"
                                  : "neutral"
                              }
                            >
                              {alert.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span>{alert.pair}</span>
                            <span>•</span>
                            <span>{getAlertTypeLabel(alert.type)}</span>
                            {alert.value && (
                              <>
                                <span>•</span>
                                <span className="font-mono">{alert.value}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Channels */}
                        <div className="flex items-center gap-1">
                          {alert.channels.includes("app") && (
                            <Bell className="h-4 w-4 text-gray-400" />
                          )}
                          {alert.channels.includes("email") && (
                            <Mail className="h-4 w-4 text-gray-400" />
                          )}
                          {alert.channels.includes("telegram") && (
                            <Smartphone className="h-4 w-4 text-gray-400" />
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {alert.triggeredAt && (
                      <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800 text-sm text-blue-600 dark:text-blue-400">
                        Triggered: {alert.triggeredAt.toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Modal Placeholder */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t("alerts.create")}</CardTitle>
                  <button onClick={() => setShowCreateModal(false)}>
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Alert Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    placeholder="My Alert"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency Pair</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                    {FOREX_PAIRS.map((pair) => (
                      <option key={pair.symbol} value={pair.symbol}>
                        {pair.symbol}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alert Type</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                    <option value="price_above">Price Above</option>
                    <option value="price_below">Price Below</option>
                    <option value="signal_change">Signal Change</option>
                    <option value="trend_change">Trend Change</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price Level</label>
                  <input
                    type="number"
                    step="0.00001"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    placeholder="1.0850"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={() => setShowCreateModal(false)}>
                    Create Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
