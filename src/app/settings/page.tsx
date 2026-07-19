"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { DEFAULT_WEIGHTS } from "@/lib/constants";
import {
  Settings,
  Globe,
  Moon,
  Sun,
  Bell,
  Shield,
  Database,
  Sliders,
  Save,
  RefreshCw,
} from "lucide-react";

export default function SettingsPage() {
  const { t, language, setLanguage, theme, setTheme } = useApp();
  
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    telegram: false,
    priceAlerts: true,
    signalChanges: true,
    newsAlerts: false,
    economicEvents: true,
  });

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: value }));
  };

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-6 w-6" />
            {t("nav.settings")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Customize your platform preferences
          </p>
        </div>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Appearance & Language
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
                <p className="text-sm text-gray-500">Choose light or dark mode</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                    theme === "light"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                    theme === "dark"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </button>
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Language</h3>
                <p className="text-sm text-gray-500">Select your preferred language</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage("en")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                    language === "en"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => setLanguage("ar")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                    language === "ar"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  🇸🇦 العربية
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Channels */}
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Notification Channels</h4>
              <div className="space-y-3">
                {[
                  { key: "email", label: "Email Notifications" },
                  { key: "browser", label: "Browser Notifications" },
                  { key: "telegram", label: "Telegram Notifications" },
                ].map((channel) => (
                  <div key={channel.key} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{channel.label}</span>
                    <button
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          [channel.key]: !prev[channel.key as keyof typeof notifications],
                        }))
                      }
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative",
                        notifications[channel.key as keyof typeof notifications]
                          ? "bg-blue-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow",
                          notifications[channel.key as keyof typeof notifications]
                            ? "left-5.5 translate-x-0.5"
                            : "left-0.5"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert Types */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Alert Types</h4>
              <div className="space-y-3">
                {[
                  { key: "priceAlerts", label: "Price Level Alerts" },
                  { key: "signalChanges", label: "Signal Change Alerts" },
                  { key: "newsAlerts", label: "Breaking News Alerts" },
                  { key: "economicEvents", label: "Economic Event Reminders" },
                ].map((alert) => (
                  <div key={alert.key} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{alert.label}</span>
                    <button
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          [alert.key]: !prev[alert.key as keyof typeof notifications],
                        }))
                      }
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative",
                        notifications[alert.key as keyof typeof notifications]
                          ? "bg-blue-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow",
                          notifications[alert.key as keyof typeof notifications]
                            ? "left-5.5 translate-x-0.5"
                            : "left-0.5"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Weights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5" />
                Analysis Weights
              </CardTitle>
              <Badge variant={Math.abs(totalWeight - 1) < 0.01 ? "success" : "warning"}>
                Total: {(totalWeight * 100).toFixed(0)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Adjust the weight of each analysis component in the final signal calculation.
              Total should equal 100%.
            </p>

            {Object.entries(weights).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-sm font-mono text-gray-500">
                    {(value * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.025"
                  value={value}
                  onChange={(e) =>
                    handleWeightChange(key as keyof typeof weights, parseFloat(e.target.value))
                  }
                  className="w-full"
                />
              </div>
            ))}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setWeights(DEFAULT_WEIGHTS)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Data source configuration requires API keys. Contact your administrator
                to set up live market data feeds.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { name: "Market Data Provider", status: "demo", statusText: "Demo Mode" },
                { name: "Economic Calendar", status: "demo", statusText: "Demo Mode" },
                { name: "News Feed", status: "offline", statusText: "Not Configured" },
                { name: "Sentiment Analysis", status: "offline", statusText: "Not Configured" },
              ].map((source) => (
                <div
                  key={source.name}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {source.name}
                  </span>
                  <Badge
                    variant={
                      source.status === "active"
                        ? "success"
                        : source.status === "demo"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {source.statusText}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <Badge variant="neutral">Not Enabled</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Session Management</h4>
                <p className="text-sm text-gray-500">View and manage active sessions</p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Change Password</h4>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
