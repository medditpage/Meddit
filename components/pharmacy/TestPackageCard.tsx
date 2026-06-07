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
  Home: ({ className }: { className?: string }) => (
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
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
  ShieldCheck: ({ className }: { className?: string }) => (
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 8-2 2 0 4 1 6 2a1 1 0 0 1 1 1v7z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  ShoppingCart: ({ className }: { className?: string }) => (
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  ),
  Plus: ({ className }: { className?: string }) => (
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
      <line x1="12" x2="12" y1="5" y2="19" />
      <line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  ),
  Droplet: ({ className }: { className?: string }) => (
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
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
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
  "relative rounded-xl overflow-hidden transition-all duration-200",
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

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-600",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-300",
        inverted:
          "bg-slate-800 text-white hover:bg-slate-900 focus-visible:ring-slate-800",
        outlined:
          "border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-50 focus-visible:ring-slate-300",
        ghost:
          "bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
  {
    variants: {
      variant: {
        primary: "bg-teal-100 text-teal-800",
        secondary: "bg-slate-200 text-slate-800",
        inverted: "bg-slate-800 text-slate-100",
        success: "bg-green-100 text-green-800",
        warning: "bg-amber-100 text-amber-800",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);
export interface TestFeature {
  icon: "Droplet" | "Activity" | "Home" | "Clock" | "ShieldCheck";
  text: string;
}

export interface TestPackageCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof cardVariants>, "isDisabled"> {
  title: string;
  description: string;
  features: TestFeature[];
  price: string;
  originalPrice?: string;
  badge?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: "Droplet" | "Activity";
  isLoading?: boolean;
  disabled?: boolean;
}

export const TestPackageCard = React.forwardRef<
  HTMLDivElement,
  TestPackageCardProps
>(
  (
    {
      className,
      variant,
      title,
      description,
      features,
      price,
      originalPrice,
      badge,
      actionLabel = "Book Now",
      onAction,
      icon = "Droplet",
      isLoading = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const isDark = variant === "primary" || variant === "inverted";

    // Determine thematic color based on icon type if using default variants
    const themeColor = isDark
      ? "text-teal-100 bg-white/10"
      : icon === "Droplet"
        ? "text-blue-700 bg-blue-50"
        : "text-teal-700 bg-teal-50";

    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn(
            cardVariants({ variant, isDisabled: true, className }),
            "p-6 animate-pulse",
          )}
          {...props}
        >
          <div className="w-12 h-12 bg-current/10 rounded-xl mb-4" />
          <div className="h-5 w-3/4 bg-current/10 rounded mb-2" />
          <div className="h-3 w-full bg-current/10 rounded mb-6" />
          <div className="space-y-3 mb-6">
            <div className="h-3 w-2/3 bg-current/5 rounded" />
            <div className="h-3 w-1/2 bg-current/5 rounded" />
          </div>
          <div className="flex items-end justify-between border-t border-current/10 pt-4">
            <div className="h-6 w-20 bg-current/10 rounded" />
            <div className="h-9 w-24 bg-current/10 rounded-md" />
          </div>
        </div>
      );
    }

    const MainIcon = Icons[icon];

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, isDisabled, className }),
          "p-6 flex flex-col h-full",
        )}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
              themeColor,
            )}
          >
            <MainIcon className="w-6 h-6" />
          </div>
          {badge && (
            <span
              className={cn(
                badgeVariants({ variant: isDark ? "inverted" : "success" }),
              )}
            >
              {badge}
            </span>
          )}
        </div>

        <h3 className="font-bold text-lg leading-tight mb-2">{title}</h3>
        <p
          className={cn(
            "text-sm line-clamp-2 mb-6",
            isDark ? "text-inherit/70" : "text-slate-500",
          )}
        >
          {description}
        </p>

        <div className="space-y-3 mb-6 flex-1">
          {features.map((feature, idx) => {
            const FeatureIcon = Icons[feature.icon];
            return (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-2 text-xs",
                  isDark ? "text-inherit/80" : "text-slate-600",
                )}
              >
                <FeatureIcon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isDark ? "opacity-70" : "text-slate-400",
                  )}
                />
                <span>{feature.text}</span>
              </div>
            );
          })}
        </div>

        <div
          className={cn(
            "flex items-center justify-between border-t pt-5 mt-auto",
            isDark ? "border-white/10" : "border-slate-100",
          )}
        >
          <div className="flex items-end gap-2">
            <span className="font-bold text-2xl leading-none">{price}</span>
            {originalPrice && (
              <span
                className={cn(
                  "text-xs line-through mb-0.5",
                  isDark ? "text-inherit/50" : "text-slate-400",
                )}
              >
                {originalPrice}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onAction}
            disabled={isDisabled}
            className={cn(
              buttonVariants({ variant: isDark ? "secondary" : "primary" }),
            )}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    );
  },
);
TestPackageCard.displayName = "TestPackageCard";