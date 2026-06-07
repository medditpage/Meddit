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
const searchBarVariants = cva(
  "flex items-center w-full rounded-md transition-colors focus-within:ring-2 focus-within:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "border border-teal-600 bg-white focus-within:ring-teal-600",
        secondary:
          "border border-transparent bg-slate-100 focus-within:ring-slate-400",
        inverted:
          "border border-slate-700 bg-slate-800 text-white focus-within:ring-slate-800 focus-within:ring-offset-slate-900",
        outlined:
          "border border-slate-300 bg-transparent focus-within:ring-slate-300",
        ghost:
          "border border-transparent bg-transparent hover:bg-slate-50 focus-within:bg-transparent focus-within:ring-slate-300",
      },
      inputSize: {
        default: "h-10 px-3",
        sm: "h-9 px-2 text-sm",
        lg: "h-11 px-4 text-lg",
      },
      isDisabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "outlined",
      inputSize: "default",
      isDisabled: false,
    },
  },
);

export interface SearchBarProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    Omit<VariantProps<typeof searchBarVariants>, "isDisabled"> {
  isLoading?: boolean;
  onClear?: () => void;
  inputSize?: VariantProps<typeof searchBarVariants>["inputSize"];
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      variant,
      inputSize,
      isLoading = false,
      disabled,
      onClear,
      value,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const hasValue = value !== undefined && value !== "" && value !== null;

    return (
      <div
        className={cn(
          searchBarVariants({ variant, inputSize, isDisabled, className }),
        )}
        aria-busy={isLoading}
      >
        <SearchIcon
          className={cn(
            "w-4 h-4 shrink-0 opacity-50",
            inputSize === "lg" && "w-5 h-5",
          )}
        />
        <input
          ref={ref}
          type="search"
          disabled={isDisabled}
          value={value}
          className="w-full h-full bg-transparent border-0 px-2 outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
          {...props}
        />
        {isLoading ? (
          <SpinnerIcon className="w-4 h-4 shrink-0 opacity-50" />
        ) : hasValue && onClear ? (
          <button
            type="button"
            onClick={onClear}
            disabled={isDisabled}
            aria-label="Clear search"
            className="p-1 rounded-full hover:bg-slate-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors"
          >
            <XIcon className="w-4 h-4 opacity-70 hover:opacity-100" />
          </button>
        ) : null}
      </div>
    );
  },
);
SearchBar.displayName = "SearchBar";
export {
  SearchBar,
  searchBarVariants,
};