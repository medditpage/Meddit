"use client";
// avatar
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
const avatarVariants = cva(
  "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium uppercase transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-teal-100 text-teal-700 ring-2 ring-teal-600 ring-offset-2",
        secondary:
          "bg-slate-200 text-slate-700 ring-2 ring-slate-400 ring-offset-2",
        inverted:
          "bg-slate-800 text-slate-200 ring-2 ring-slate-900 ring-offset-2",
        outlined: "bg-transparent text-slate-700 border border-slate-300",
        ghost: "bg-transparent text-slate-700",
      },
      size: {
        sm: "h-8 w-8 text-xs",
        default: "h-10 w-10 text-sm",
        lg: "h-14 w-14 text-base",
        xl: "h-20 w-20 text-xl",
      },
      isDisabled: {
        true: "opacity-50 grayscale pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
      isDisabled: false,
    },
  },
);

export interface AvatarProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof avatarVariants>, "isDisabled"> {
  src?: string;
  alt?: string;
  fallback?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      variant,
      size,
      src,
      alt,
      fallback,
      isLoading = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const [imgError, setImgError] = React.useState(false);
    const isDisabled = disabled || isLoading;

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ variant, size, isDisabled, className }))}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        role="img"
        aria-label={alt || fallback || "User avatar"}
        {...props}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 animate-pulse" />
        ) : src && !imgError ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center">
            {fallback ? (
              fallback.substring(0, 2)
            ) : (
              <UserIcon className="w-1/2 h-1/2 opacity-70" />
            )}
          </span>
        )}
      </div>
    );
  },
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
