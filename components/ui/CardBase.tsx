import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- ICONS (Standalone SVGs for Zero Dependencies) ---
const SearchIcon = ({ className }: { className?: string }) => (
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
    className={className}
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

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

const UserIcon = ({ className }: { className?: string }) => (
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
    className={className}
    aria-hidden="true"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
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
    className={className}
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
const cardVariants = cva("relative rounded-xl overflow-hidden transition-all", {
  variants: {
    variant: {
      primary: "bg-teal-600 text-white shadow-md",
      secondary: "bg-slate-100 text-slate-900 shadow-sm",
      inverted: "bg-slate-900 text-slate-50 shadow-md border border-slate-800",
      outlined: "bg-white text-slate-900 border border-slate-200 shadow-sm",
      ghost: "bg-transparent text-slate-900",
    },
    isDisabled: {
      true: "opacity-50 pointer-events-none",
    },
  },
  defaultVariants: {
    variant: "outlined",
    isDisabled: false,
  },
});

export interface CardBaseProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof cardVariants>, "isDisabled"> {
  isLoading?: boolean;
  disabled?: boolean;
}

const CardBase = React.forwardRef<HTMLDivElement, CardBaseProps>(
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
      <div
        ref={ref}
        className={cn(cardVariants({ variant, isDisabled, className }))}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-inherit/50 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          >
            <SpinnerIcon className="w-8 h-8 opacity-75" />
          </div>
        )}
        <div className={cn("p-6", isLoading && "opacity-60")}>{children}</div>
      </div>
    );
  },
);
CardBase.displayName = "CardBase";
export {

  CardBase,
  
  cardVariants,
  
};