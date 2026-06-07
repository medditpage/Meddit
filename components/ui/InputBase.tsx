import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inputVariants = cva(
  "flex w-full rounded-md text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border border-teal-600 bg-white focus-visible:ring-teal-600",
        secondary:
          "border border-transparent bg-slate-100 focus-visible:ring-slate-400",
        inverted:
          "border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus-visible:ring-slate-800 focus-visible:ring-offset-slate-900",
        outlined:
          "border border-slate-300 bg-transparent focus-visible:ring-slate-300",
        ghost:
          "border border-transparent bg-transparent hover:bg-slate-100 focus-visible:bg-transparent focus-visible:ring-slate-300",
      },
      inputSize: {
        default: "h-10 px-3 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "outlined",
      inputSize: "default",
    },
  },
);

export interface InputBaseProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  isLoading?: boolean;
  inputSize?: VariantProps<typeof inputVariants>["inputSize"];
}

const InputBase = React.forwardRef<HTMLInputElement, InputBaseProps>(
  (
    { className, variant, inputSize, isLoading = false, disabled, ...props },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <div className="relative flex w-full items-center">
        <input
          className={cn(
            inputVariants({ variant, inputSize, className }),
            isLoading && "pr-10", // Add right padding to prevent text overlap with the loading spinner
          )}
          ref={ref}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          aria-busy={isLoading}
          {...props}
        />
        {isLoading && (
          <div className="absolute right-3 flex items-center justify-center pointer-events-none">
            <svg
              className={cn(
                "h-4 w-4 animate-spin",
                variant === "inverted" ? "text-slate-400" : "text-slate-500",
              )}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
              role="presentation"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>
    );
  },
);

InputBase.displayName = "InputBase";

export { InputBase, inputVariants };
