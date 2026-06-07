// components/chat/EmergencyBanner.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Icons = {
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
  Phone: ({ className }: { className?: string }) => (
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
};

const emergencyBannerVariants = cva(
  "relative w-full rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-red-600 text-white shadow-md border border-red-700",
        secondary: "bg-red-50 text-red-900 border border-red-100",
        inverted: "bg-slate-900 text-red-400 border border-red-900/30",
        outlined: "bg-white text-red-700 border-2 border-red-200",
        ghost: "bg-transparent text-red-700 border border-transparent",
      },
      isDisabled: {
        true: "opacity-50 pointer-events-none grayscale-[0.5]",
      },
    },
    defaultVariants: {
      variant: "primary",
      isDisabled: false,
    },
  },
);

export interface EmergencyBannerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof emergencyBannerVariants>, "isDisabled"> {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const EmergencyBanner = React.forwardRef<
  HTMLDivElement,
  EmergencyBannerProps
>(
  (
    {
      className,
      variant,
      title,
      description,
      actionLabel = "Call Emergency: 108",
      onAction,
      isLoading = false,
      disabled = false,
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
            emergencyBannerVariants({ variant, isDisabled: true, className }),
            "animate-pulse",
          )}
          {...props}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-full bg-current/20 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-1/3 bg-current/20 rounded" />
              <div className="h-4 w-2/3 bg-current/10 rounded" />
            </div>
            <div className="hidden md:block h-10 w-32 bg-current/20 rounded-md" />
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          emergencyBannerVariants({ variant, isDisabled, className }),
        )}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        role="alert"
        {...props}
      >
        <div className="flex items-start md:items-center gap-3 flex-1">
          <div
            className={cn(
              "p-2 rounded-full shrink-0",
              isDark ? "bg-white/20" : "bg-red-100",
            )}
          >
            <Icons.AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{title}</h3>
            <p
              className={cn(
                "text-sm mt-0.5",
                isDark ? "text-red-100" : "text-red-700/80",
              )}
            >
              {description}
            </p>
          </div>
        </div>

        {onAction && (
          <button
            type="button"
            onClick={onAction}
            disabled={isDisabled}
            className={cn(
              "w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isDark
                ? "bg-white text-red-700 hover:bg-red-50 focus-visible:ring-white"
                : "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 focus-visible:ring-offset-white",
            )}
          >
            <Icons.Phone className="w-4 h-4" />
            {actionLabel}
          </button>
        )}
      </div>
    );
  },
);
EmergencyBanner.displayName = "EmergencyBanner";
