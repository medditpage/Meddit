//  this is  Baade.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILITIES ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- ICONS ---
const SpinnerIcon = ({ className }: { className?: string }) => (
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
    className={cn("animate-spin", className)}
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const StarIcon = ({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-teal-100 text-teal-800 border border-teal-200",
        secondary: "bg-slate-100 text-slate-800 border border-slate-200",
        inverted: "bg-slate-800 text-slate-100 border border-slate-900",
        outlined: "text-slate-800 border border-slate-300 bg-transparent",
        ghost: "text-slate-700 bg-transparent hover:bg-slate-100",
      },
      isDisabled: {
        true: "opacity-50 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      isDisabled: false,
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    Omit<VariantProps<typeof badgeVariants>, "isDisabled"> {
  isLoading?: boolean;
  disabled?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      isLoading = false,
      disabled = false,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, isDisabled, className }))}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <SpinnerIcon className="mr-1 h-3 w-3" />}
        {children}
      </span>
    );
  },
);
Badge.displayName = "Badge";

export { Badge,badgeVariants,};