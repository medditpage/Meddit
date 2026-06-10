// components/chat/ConversationStatusBadge.tsx
import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ConversationStatus = "active" | "waiting" | "urgent" | "closed";

const STATUS_CONFIG: Record<
  ConversationStatus,
  { label: string; dot: string; pill: string }
> = {
  active: {
    label: "Active",
    dot: "bg-green-500",
    pill: "bg-green-50 text-green-700 border-green-200",
  },
  waiting: {
    label: "Waiting for Doctor",
    dot: "bg-amber-400",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
  },
  urgent: {
    label: "Urgent",
    dot: "bg-red-500 animate-pulse",
    pill: "bg-red-50 text-red-700 border-red-200",
  },
  closed: {
    label: "Closed",
    dot: "bg-slate-400",
    pill: "bg-slate-50 text-slate-500 border-slate-200",
  },
};

export interface ConversationStatusBadgeProps {
  status: ConversationStatus;
  /** compact = dot only, full = dot + label */
  variant?: "compact" | "full";
  className?: string;
}

export const ConversationStatusBadge: React.FC<
  ConversationStatusBadgeProps
> = ({ status, variant = "full", className }) => {
  const cfg = STATUS_CONFIG[status];

  if (variant === "compact") {
    return (
      <span
        className={cn(
          "inline-block w-2.5 h-2.5 rounded-full shrink-0",
          cfg.dot,
          className,
        )}
        title={cfg.label}
        aria-label={cfg.label}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border",
        cfg.pill,
        className,
      )}
      role="status"
      aria-label={`Conversation status: ${cfg.label}`}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
      {cfg.label}
    </span>
  );
};

ConversationStatusBadge.displayName = "ConversationStatusBadge";
