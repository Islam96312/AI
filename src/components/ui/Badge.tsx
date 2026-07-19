"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  neutral: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export function Badge({ children, variant = "default", size = "md", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function SignalBadge({ signal, size = "md" }: { signal: string; size?: "sm" | "md" | "lg" }) {
  const config: Record<string, { variant: BadgeVariant; label: string; labelAr: string }> = {
    strong_buy: { variant: "success", label: "Strong Buy", labelAr: "شراء قوي" },
    buy: { variant: "success", label: "Buy", labelAr: "شراء" },
    neutral: { variant: "warning", label: "Neutral", labelAr: "محايد" },
    sell: { variant: "danger", label: "Sell", labelAr: "بيع" },
    strong_sell: { variant: "danger", label: "Strong Sell", labelAr: "بيع قوي" },
    wait: { variant: "neutral", label: "Wait", labelAr: "انتظار" },
  };

  const { variant, label } = config[signal] || { variant: "neutral", label: signal };

  return (
    <Badge variant={variant} size={size}>
      {label}
    </Badge>
  );
}

export function TrendBadge({ trend, size = "md" }: { trend: string; size?: "sm" | "md" | "lg" }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    bullish: { variant: "success", label: "↑ Bullish" },
    bearish: { variant: "danger", label: "↓ Bearish" },
    sideways: { variant: "warning", label: "→ Sideways" },
  };

  const { variant, label } = config[trend] || { variant: "neutral", label: trend };

  return (
    <Badge variant={variant} size={size}>
      {label}
    </Badge>
  );
}

export function ImpactBadge({ impact, size = "sm" }: { impact: string; size?: "sm" | "md" | "lg" }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    high: { variant: "danger", label: "High" },
    medium: { variant: "warning", label: "Medium" },
    low: { variant: "success", label: "Low" },
  };

  const { variant, label } = config[impact] || { variant: "neutral", label: impact };

  return (
    <Badge variant={variant} size={size}>
      {label}
    </Badge>
  );
}
