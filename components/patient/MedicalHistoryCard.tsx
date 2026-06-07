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

export interface MedicalHistoryCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof cardVariants>, "isDisabled"> {
  type: "condition" | "medication";
  title: string;
  subtitle: string;
  status?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const MedicalHistoryCard = React.forwardRef<
  HTMLDivElement,
  MedicalHistoryCardProps
>(
  (
    {
      className,
      variant,
      type,
      title,
      subtitle,
      status,
      isLoading = false,
      disabled = false,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const isCondition = type === "condition";
    const isDark = variant === "primary" || variant === "inverted";

    // --- Skeleton loader ---
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn(
            cardVariants({ variant, isDisabled: true }),
            "p-4 flex gap-4 animate-pulse",
            className,
          )}
          {...props}
        >
          <div className="w-10 h-10 rounded-lg bg-current/10 shrink-0" />
          <div className="space-y-2 flex-1 pt-1">
            <div className="h-4 w-3/4 bg-current/10 rounded" />
            <div className="h-3 w-1/2 bg-current/10 rounded" />
          </div>
        </div>
      );
    }

    // --- Shared className ---
    const sharedClassName = cn(
      cardVariants({ variant, isDisabled }),
      "p-4 flex items-start gap-4",
      onClick &&
        !isDisabled &&
        "cursor-pointer hover:shadow-md transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
      !isDark &&
        variant !== "ghost" &&
        isCondition &&
        "border-teal-100 bg-teal-50/30",
      !isDark &&
        variant !== "ghost" &&
        !isCondition &&
        "border-blue-100 bg-blue-50/30",
      className,
    );

    // --- Shared icon + content ---
    const sharedContent = (
      <>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
            isDark
              ? "bg-white/10"
              : isCondition
                ? "bg-teal-100 text-teal-700"
                : "bg-blue-100 text-blue-700",
          )}
        >
          {isCondition ? (
            <Icons.Activity className="w-5 h-5" />
          ) : (
            <Icons.Pill className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0 text-left">
          <h4 className="font-semibold text-sm truncate">{title}</h4>
          <p
            className={cn(
              "text-xs mt-0.5 truncate",
              isDark ? "opacity-70" : "text-slate-500",
            )}
          >
            {subtitle}
          </p>
          {status && (
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  status.toLowerCase() === "managed" ||
                    status.toLowerCase() === "active"
                    ? "bg-teal-500"
                    : "bg-amber-500",
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  isDark ? "opacity-90" : "text-slate-700",
                )}
              >
                {status}
              </span>
            </div>
          )}
        </div>
      </>
    );

    // --- Split render to avoid "button" | "div" union TS error ---
    if (onClick) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          disabled={isDisabled}
          className={sharedClassName}
          aria-busy={isLoading}
          aria-disabled={isDisabled}
        >
          {sharedContent}
        </button>
      );
    }

    return (
      <div
        ref={ref}
        className={sharedClassName}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {sharedContent}
      </div>
    );
  },
);

MedicalHistoryCard.displayName = "MedicalHistoryCard";
