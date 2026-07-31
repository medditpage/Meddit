"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
  variant?: "card" | "line" | "avatar" | "button";
}

export function SkeletonLoader({ className, variant = "line" }: SkeletonProps) {
  const variantStyles = {
    line: "h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-800/80 animate-pulse",
    card: "h-32 w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 animate-pulse",
    avatar: "h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800/80 animate-pulse shrink-0",
    button: "h-9 w-24 rounded-full bg-slate-200 dark:bg-slate-800/80 animate-pulse",
  };

  return <div className={cn(variantStyles[variant], className)} />;
}

export function SkeletonCardGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/3" />
            </div>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-full" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-4/5" />
        </div>
      ))}
    </div>
  );
}
