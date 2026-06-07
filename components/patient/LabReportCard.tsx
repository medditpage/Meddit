import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILITIES ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- ICONS ---
const Icons = {
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
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  Clock: ({ className }: { className?: string }) => (
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Video: ({ className }: { className?: string }) => (
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
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  ),
  MapPin: ({ className }: { className?: string }) => (
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Activity: ({ className }: { className?: string }) => (
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
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
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
      <path d="m8.5 8.5 7 7" />
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
  Download: ({ className }: { className?: string }) => (
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  ),
  Spinner: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};

// --- SHARED VARIANTS ---
const cardVariants = cva(
  "relative rounded-xl overflow-hidden transition-all duration-200 text-left",
  {
    variants: {
      variant: {
        primary: "bg-teal-600 text-white shadow-md border border-teal-700",
        secondary:
          "bg-slate-50 text-slate-900 shadow-sm border border-slate-100",
        inverted:
          "bg-slate-900 text-slate-50 shadow-md border border-slate-800",
        outlined: "bg-white text-slate-900 border border-slate-200 shadow-sm",
        ghost:
          "bg-transparent text-slate-900 border border-transparent hover:bg-slate-50",
      },
      isDisabled: {
        true: "opacity-60 pointer-events-none grayscale-[0.5]",
      },
    },
    defaultVariants: {
      variant: "outlined",
      isDisabled: false,
    },
  },
);
export interface LabReportCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof cardVariants>, "isDisabled"> {
  testName: string;
  labName: string;
  date: string;
  status: "normal" | "flagged" | "pending";
  isLoading?: boolean;
  disabled?: boolean;
  onDownload?: () => void;
  hideLine?: boolean; // For timeline styling
}

export const LabReportCard = React.forwardRef<
  HTMLDivElement,
  LabReportCardProps
>(
  (
    {
      className,
      variant,
      testName,
      labName,
      date,
      status,
      isLoading = false,
      disabled = false,
      onDownload,
      hideLine = false,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const isDark = variant === "primary" || variant === "inverted";

    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn(
            cardVariants({ variant, isDisabled: true, className }),
            "py-3 flex gap-4 animate-pulse bg-transparent shadow-none border-none",
          )}
          {...props}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-current/20 mt-1.5 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/2 bg-current/10 rounded" />
            <div className="h-3 w-1/3 bg-current/10 rounded" />
          </div>
          <div className="h-6 w-16 bg-current/5 rounded-full shrink-0" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant: "ghost", isDisabled, className }),
          "relative flex items-start gap-4 py-3",
        )}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {/* Timeline dots and line */}
        <div className="relative flex flex-col items-center shrink-0 mt-1.5">
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-full z-10",
              status === "normal"
                ? "bg-teal-500"
                : status === "flagged"
                  ? "bg-red-500"
                  : "bg-amber-500",
            )}
          />
          {!hideLine && (
            <div
              className={cn(
                "absolute top-2.5 bottom-[-20px] w-px",
                isDark ? "bg-white/10" : "bg-slate-200",
              )}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          <h4 className="font-semibold text-sm truncate">{testName}</h4>
          <p
            className={cn(
              "text-xs mt-0.5 truncate",
              isDark ? "text-inherit/60" : "text-slate-500",
            )}
          >
            {labName} • {date}
          </p>
        </div>

        {/* Actions & Status */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider",
              status === "normal"
                ? isDark
                  ? "bg-teal-500/20 text-teal-200"
                  : "bg-teal-50 text-teal-700"
                : status === "flagged"
                  ? isDark
                    ? "bg-red-500/20 text-red-200"
                    : "bg-red-50 text-red-700"
                  : isDark
                    ? "bg-amber-500/20 text-amber-200"
                    : "bg-amber-50 text-amber-700",
            )}
          >
            {status}
          </span>
          {onDownload && status !== "pending" && (
            <button
              type="button"
              onClick={onDownload}
              disabled={isDisabled}
              className={cn(
                "flex items-center gap-1 text-xs font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 rounded-sm focus-visible:ring-current",
                isDark ? "text-teal-400" : "text-teal-700",
              )}
            >
              <Icons.Download className="w-3.5 h-3.5" />
              PDF
            </button>
          )}
        </div>
      </div>
    );
  },
);
LabReportCard.displayName = "LabReportCard";