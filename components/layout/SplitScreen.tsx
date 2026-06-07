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
const splitScreenVariants = cva(
  "flex flex-col lg:flex-row min-h-screen w-full transition-colors duration-200",
  {
    variants: {
      variant: {
        primary: "bg-white text-slate-900", // Left side usually handles its own brand color
        secondary: "bg-slate-50 text-slate-900",
        inverted: "bg-slate-950 text-slate-100",
        outlined: "bg-white text-slate-900",
        ghost: "bg-transparent text-slate-900",
      },
      isDisabled: {
        true: "opacity-60 pointer-events-none select-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      isDisabled: false,
    },
  },
);

export interface SplitScreenLayoutProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof splitScreenVariants>, "isDisabled"> {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  reverse?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

const SplitScreenLayout = React.forwardRef<
  HTMLDivElement,
  SplitScreenLayoutProps
>(
  (
    {
      className,
      variant,
      leftPane,
      rightPane,
      reverse = false,
      isLoading = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <div
        ref={ref}
        className={cn(splitScreenVariants({ variant, isDisabled, className }))}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <SpinnerIcon className="w-10 h-10 text-teal-600 opacity-80" />
          </div>
        )}

        {/* Pane 1: Brand / Visual Side (Hidden on smaller screens by default, flex-1) */}
        <div
          className={cn(
            "relative hidden lg:flex flex-1 flex-col overflow-hidden",
            reverse ? "order-2" : "order-1",
            isLoading && "opacity-50 filter blur-sm",
          )}
        >
          {leftPane}
        </div>

        {/* Pane 2: Content / Form Side (Takes full width on mobile, flex-1 on desktop) */}
        <div
          className={cn(
            "flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[50%] xl:w-[45%] lg:px-20 xl:px-24",
            reverse ? "order-1" : "order-2",
            isLoading && "opacity-50",
          )}
        >
          <div className="mx-auto w-full max-w-sm lg:w-full">{rightPane}</div>
        </div>
      </div>
    );
  },
);
SplitScreenLayout.displayName = "SplitScreenLayout";

export {
  SplitScreenLayout,
  splitScreenVariants,
};