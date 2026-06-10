"use client";
// components/chat/MessageCategoryTag.tsx
import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  MessageCircle: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Pill: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="M8.5 8.5 16 16" />
    </svg>
  ),
  Calendar: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  AlertTriangle: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" x2="12" y1="9" y2="13" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  ),
  FileText: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  ),
  Stethoscope: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6h0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  ),
  FlaskConical: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 2v6l3 3a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4l3-3V2" />
      <path d="M6 2h12" />
    </svg>
  ),
  HelpCircle: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  ),
};

// ─── Category definitions ─────────────────────────────────────────────────────
export type MessageCategory =
  | "general"
  | "prescription"
  | "appointment"
  | "emergency"
  | "lab_report"
  | "follow_up"
  | "consultation"
  | "second_opinion";

interface CategoryConfig {
  label: string;
  icon: React.FC<{ className?: string }>;
  /** Tailwind classes for the chip */
  chip: string;
  /** Tailwind classes for the icon */
  iconColor: string;
}

const CATEGORY_CONFIG: Record<MessageCategory, CategoryConfig> = {
  general: {
    label: "General Query",
    icon: Icons.MessageCircle,
    chip: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200",
    iconColor: "text-slate-500",
  },
  prescription: {
    label: "Prescription",
    icon: Icons.Pill,
    chip: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
    iconColor: "text-violet-500",
  },
  appointment: {
    label: "Appointment",
    icon: Icons.Calendar,
    chip: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-500",
  },
  emergency: {
    label: "Emergency",
    icon: Icons.AlertTriangle,
    chip: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    iconColor: "text-red-500",
  },
  lab_report: {
    label: "Lab Report",
    icon: Icons.FlaskConical,
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    iconColor: "text-emerald-500",
  },
  follow_up: {
    label: "Follow-up",
    icon: Icons.Stethoscope,
    chip: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
    iconColor: "text-teal-500",
  },
  consultation: {
    label: "Consultation",
    icon: Icons.FileText,
    chip: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    iconColor: "text-indigo-500",
  },
  second_opinion: {
    label: "Second Opinion",
    icon: Icons.HelpCircle,
    chip: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    iconColor: "text-amber-500",
  },
};

// ─── Single tag ───────────────────────────────────────────────────────────────
export interface MessageCategoryTagProps {
  category: MessageCategory;
  /** icon-only = no label text, saves space in compact lists */
  variant?: "default" | "icon-only";
  /** If provided, tag becomes a clickable filter button */
  onClick?: (category: MessageCategory) => void;
  isActive?: boolean;
  className?: string;
}

export const MessageCategoryTag: React.FC<MessageCategoryTagProps> = ({
  category,
  variant = "default",
  onClick,
  isActive = false,
  className,
}) => {
  const cfg = CATEGORY_CONFIG[category];
  const Icon = cfg.icon;
  const isClickable = Boolean(onClick);

  const baseClasses = cn(
    "inline-flex items-center gap-1.5 rounded-full border text-[11px] font-semibold transition-colors",
    variant === "icon-only" ? "p-1" : "px-2.5 py-1",
    cfg.chip,
    isActive && "ring-2 ring-offset-1 ring-current",
    isClickable
      ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      : "cursor-default",
    className,
  );

  if (isClickable) {
    return (
      <button
        type="button"
        className={baseClasses}
        onClick={() => onClick?.(category)}
        aria-pressed={isActive}
        aria-label={cfg.label}
        title={cfg.label}
      >
        <Icon
          className={cn(
            "shrink-0",
            variant === "icon-only" ? "w-3.5 h-3.5" : "w-3 h-3",
            cfg.iconColor,
          )}
        />
        {variant !== "icon-only" && <span>{cfg.label}</span>}
      </button>
    );
  }

  return (
    <span className={baseClasses} aria-label={cfg.label} title={cfg.label}>
      <Icon
        className={cn(
          "shrink-0",
          variant === "icon-only" ? "w-3.5 h-3.5" : "w-3 h-3",
          cfg.iconColor,
        )}
      />
      {variant !== "icon-only" && <span>{cfg.label}</span>}
    </span>
  );
};

MessageCategoryTag.displayName = "MessageCategoryTag";

// ─── Category filter bar (for inbox header) ───────────────────────────────────
export interface MessageCategoryFilterBarProps {
  activeCategory: MessageCategory | null;
  onSelect: (category: MessageCategory | null) => void;
  /** Show only these categories; defaults to all */
  categories?: MessageCategory[];
  className?: string;
}

const ALL_CATEGORIES: MessageCategory[] = [
  "general",
  "prescription",
  "appointment",
  "emergency",
  "lab_report",
  "follow_up",
  "consultation",
  "second_opinion",
];

export const MessageCategoryFilterBar: React.FC<
  MessageCategoryFilterBarProps
> = ({ activeCategory, onSelect, categories = ALL_CATEGORIES, className }) => {
  return (
    <div
      role="group"
      aria-label="Filter conversations by category"
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none",
        className,
      )}
    >
      {/* "All" pill */}
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={activeCategory === null}
        className={cn(
          "inline-flex items-center shrink-0 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1",
          activeCategory === null
            ? "bg-teal-600 text-white border-teal-600"
            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50",
        )}
      >
        All
      </button>

      {categories.map((cat) => (
        <MessageCategoryTag
          key={cat}
          category={cat}
          onClick={onSelect}
          isActive={activeCategory === cat}
          className="shrink-0"
        />
      ))}
    </div>
  );
};

MessageCategoryFilterBar.displayName = "MessageCategoryFilterBar";

// ─── Composer category selector (dropdown-style) ──────────────────────────────
export interface MessageCategorySelectorProps {
  value: MessageCategory | null;
  onChange: (category: MessageCategory | null) => void;
  className?: string;
}

export const MessageCategorySelector: React.FC<
  MessageCategorySelectorProps
> = ({ value, onChange, className }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const selected = value ? CATEGORY_CONFIG[value] : null;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select message category"
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600",
          selected
            ? CATEGORY_CONFIG[value!].chip
            : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100",
        )}
      >
        {selected ? (
          <>
            <selected.icon
              className={cn(
                "w-3.5 h-3.5 shrink-0",
                CATEGORY_CONFIG[value!].iconColor,
              )}
            />
            <span>{selected.label}</span>
          </>
        ) : (
          <span className="text-slate-400">Tag category…</span>
        )}
        {/* chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "w-3 h-3 ml-0.5 text-slate-400 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Message categories"
          className={cn(
            "absolute bottom-full mb-1 left-0 z-50",
            "w-52 rounded-xl border border-slate-200 bg-white shadow-lg py-1",
            "overflow-hidden",
          )}
        >
          {/* Clear option */}
          <button
            type="button"
            role="option"
            aria-selected={value === null}
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:bg-slate-50 transition-colors"
          >
            <span className="w-3.5 h-3.5 shrink-0" />
            No category
          </button>

          <div className="h-px bg-slate-100 mx-2 my-1" />

          {ALL_CATEGORIES.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const Icon = cfg.icon;
            const isSelected = value === cat;
            return (
              <button
                key={cat}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(cat);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                <Icon className={cn("w-3.5 h-3.5 shrink-0", cfg.iconColor)} />
                {cfg.label}
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3 ml-auto text-teal-600"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

MessageCategorySelector.displayName = "MessageCategorySelector";

// ─── Exports ──────────────────────────────────────────────────────────────────
export { CATEGORY_CONFIG, ALL_CATEGORIES };
