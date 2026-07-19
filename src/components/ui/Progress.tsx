"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "signal";
  showLabel?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const getBarColor = () => {
    if (variant === "gradient") {
      return "bg-gradient-to-r from-blue-500 to-purple-500";
    }
    if (variant === "signal") {
      if (percentage >= 70) return "bg-green-500";
      if (percentage >= 40) return "bg-yellow-500";
      return "bg-red-500";
    }
    return "bg-blue-600";
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            getBarColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface ScoreBarProps {
  score: number;
  min?: number;
  max?: number;
  showValue?: boolean;
  label?: string;
  className?: string;
}

export function ScoreBar({
  score,
  min = -100,
  max = 100,
  showValue = true,
  label,
  className,
}: ScoreBarProps) {
  const range = max - min;
  const normalizedScore = ((score - min) / range) * 100;
  const midpoint = 50;
  
  const getColor = () => {
    if (score > 30) return "bg-green-500";
    if (score > 0) return "bg-green-400";
    if (score > -30) return "bg-yellow-500";
    if (score > -60) return "bg-red-400";
    return "bg-red-500";
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showValue && (
            <span
              className={cn(
                "text-sm font-bold",
                score > 0 ? "text-green-500" : score < 0 ? "text-red-500" : "text-gray-500"
              )}
            >
              {score > 0 ? "+" : ""}{score}
            </span>
          )}
        </div>
      )}
      <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-500"
          style={{ left: `${midpoint}%` }}
        />
        <div
          className={cn(
            "absolute top-0 bottom-0 transition-all duration-500 ease-out rounded-full",
            getColor()
          )}
          style={{
            left: score >= 0 ? `${midpoint}%` : `${normalizedScore}%`,
            width: `${Math.abs(normalizedScore - midpoint)}%`,
          }}
        />
      </div>
    </div>
  );
}

interface ConfidenceMeterProps {
  confidence: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ConfidenceMeter({
  confidence,
  size = "md",
  showLabel = true,
  className,
}: ConfidenceMeterProps) {
  const getColor = () => {
    if (confidence >= 70) return "text-green-500";
    if (confidence >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const sizeStyles = {
    sm: { width: 60, height: 60, strokeWidth: 4 },
    md: { width: 80, height: 80, strokeWidth: 6 },
    lg: { width: 100, height: 100, strokeWidth: 8 },
  };

  const { width, height, strokeWidth } = sizeStyles[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width, height }}>
        <svg className="transform -rotate-90" width={width} height={height}>
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={width / 2}
            cy={height / 2}
          />
          <circle
            className={cn("transition-all duration-500", getColor())}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={width / 2}
            cy={height / 2}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", getColor(), size === "sm" ? "text-sm" : size === "md" ? "text-lg" : "text-xl")}>
            {confidence}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Confidence
        </span>
      )}
    </div>
  );
}
