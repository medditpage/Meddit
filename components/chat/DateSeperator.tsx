// components/chat/DateSeparator.tsx
import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DateSeparatorProps {
  date: Date | string;
  className?: string;
}

function formatSeparatorLabel(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
  const startOfWeek = new Date(startOfToday.getTime() - 6 * 86400000);

  const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (startOfDay.getTime() === startOfToday.getTime()) return "Today";
  if (startOfDay.getTime() === startOfYesterday.getTime()) return "Yesterday";
  if (startOfDay.getTime() >= startOfWeek.getTime()) {
    return d.toLocaleDateString([], { weekday: "long" });
  }
  return d.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({
  date,
  className,
}) => {
  const label = formatSeparatorLabel(date);

  return (
    <div
      className={cn("flex items-center gap-3 my-4 select-none", className)}
      role="separator"
      aria-label={`Messages from ${label}`}
    >
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-1 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
};

DateSeparator.displayName = "DateSeparator";

/** Helper: given a list of message timestamps, returns indices where a separator should appear before */
export function getSeparatorIndices(timestamps: string[]): Set<number> {
  const indices = new Set<number>();
  let lastDayKey = "";
  timestamps.forEach((ts, i) => {
    const d = new Date(ts);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (key !== lastDayKey) {
      indices.add(i);
      lastDayKey = key;
    }
  });
  return indices;
}
