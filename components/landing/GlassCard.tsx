"use client";
// src/components/landing/GlassCard.tsx
import * as React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
}

export function GlassCard({
  children,
  className,
  delay = 0,
  ...props
}: GlassCardProps) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-2xl transition-all duration-500 hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(13,148,136,0.08)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
