"use client";

import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Calendar,
  Newspaper,
  Bell,
  Star,
  FileText,
  History,
  Settings,
  Calculator,
  BarChart3,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { key: "dashboard", href: "/", icon: LayoutDashboard },
  { key: "pairs", href: "/pairs", icon: TrendingUp },
  { key: "calendar", href: "/calendar", icon: Calendar },
  { key: "news", href: "/news", icon: Newspaper },
  { key: "alerts", href: "/alerts", icon: Bell },
  { key: "watchlist", href: "/watchlist", icon: Star },
  { key: "reports", href: "/reports", icon: FileText },
  { key: "backtest", href: "/backtest", icon: History },
  { key: "riskCalculator", href: "/risk-calculator", icon: Calculator },
  { key: "settings", href: "/settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t, isRTL } = useApp();
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0",
          isRTL ? "right-0" : "left-0",
          isOpen
            ? "translate-x-0"
            : isRTL
            ? "translate-x-full"
            : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {t("common.appName")}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => onClose()}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  />
                  <span className="font-medium">{t(`nav.${item.key}`)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Market Status */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t("dashboard.marketStatus")}: {t("dashboard.open")}
              </span>
            </div>
          </div>

          {/* Currency Strength Mini */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              {t("dashboard.currencyStrength")}
            </div>
            <div className="flex flex-wrap gap-1">
              {["USD", "EUR", "GBP", "JPY"].map((currency, i) => (
                <div
                  key={currency}
                  className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    i === 0
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : i === 3
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  )}
                >
                  {currency}
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {t("common.disclaimer")}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
