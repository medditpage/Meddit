import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { CardBase, cardVariants } from "../ui/CardBase";
import { Badge, badgeVariants } from "../ui/Badge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const TrendingDownIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
    <polyline points="16 17 22 17 22 11" />
  </svg>
);

export interface MetricsCardProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    Omit<VariantProps<typeof cardVariants>, "isDisabled"> {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  badge?: {
    text: string;
    variant?: VariantProps<typeof badgeVariants>["variant"];
  };
  isLoading?: boolean;
  disabled?: boolean;
}

const MetricsCard = React.forwardRef<HTMLDivElement, MetricsCardProps>(
  (
    {
      className,
      variant,
      title,
      value,
      subtitle,
      trend,
      badge,
      isLoading = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const isDark = variant === "primary" || variant === "inverted";

    const getTrendColor = (direction: "up" | "down" | "neutral") => {
      if (isDark) {
        return direction === "up"
          ? "text-green-400"
          : direction === "down"
            ? "text-red-400"
            : "text-slate-300";
      }
      return direction === "up"
        ? "text-green-600"
        : direction === "down"
          ? "text-red-600"
          : "text-slate-600";
    };

    if (isLoading) {
      return (
        <CardBase
          ref={ref}
          variant={variant}
          isLoading={true}
          disabled={true}
          className={className}
          {...props}
        >
          <div className="flex flex-col h-full animate-pulse">
            <div className="h-3 w-24 bg-current/10 rounded mb-4" />
            <div className="h-8 w-16 bg-current/10 rounded mb-2" />
            <div className="h-3 w-32 bg-current/10 rounded mt-auto" />
          </div>
        </CardBase>
      );
    }

    return (
      <CardBase
        ref={ref}
        variant={variant}
        disabled={disabled}
        className={cn("flex flex-col", className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-4 mb-2">
          <h4
            className={cn(
              "text-xs font-bold uppercase tracking-wider",
              isDark ? "text-inherit/70" : "text-slate-500",
            )}
          >
            {title}
          </h4>
          {badge && (
            <Badge
              variant={badge.variant || (isDark ? "inverted" : "secondary")}
              className="shrink-0 text-[10px] px-1.5 py-0"
            >
              {badge.text}
            </Badge>
          )}
        </div>

        <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>

        <div className="mt-auto pt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                getTrendColor(trend.direction),
              )}
            >
              {trend.direction === "up" && (
                <TrendingUpIcon className="w-4 h-4" />
              )}
              {trend.direction === "down" && (
                <TrendingDownIcon className="w-4 h-4" />
              )}
              <span>{trend.value}</span>
            </div>
          )}

          {(subtitle || trend?.label) && (
            <p
              className={cn(
                "text-xs",
                isDark ? "text-inherit/60" : "text-slate-500",
              )}
            >
              {trend?.label || subtitle}
            </p>
          )}
        </div>
      </CardBase>
    );
  },
);

MetricsCard.displayName = "MetricsCard";

export { MetricsCard };
