// this is Footer.tsx
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
const footerVariants = cva("w-full transition-colors duration-200 border-t", {
  variants: {
    variant: {
      primary: "bg-teal-900 border-teal-800 text-teal-50",
      secondary: "bg-slate-100 border-slate-200 text-slate-600",
      inverted: "bg-slate-950 border-slate-900 text-slate-400",
      outlined: "bg-white border-slate-200 text-slate-600",
      ghost: "bg-transparent border-transparent text-slate-600",
    },
    isDisabled: {
      true: "opacity-60 pointer-events-none select-none",
    },
  },
  defaultVariants: {
    variant: "secondary",
    isDisabled: false,
  },
});

export interface FooterProps
  extends
    React.HTMLAttributes<HTMLElement>,
    Omit<VariantProps<typeof footerVariants>, "isDisabled"> {
  isLoading?: boolean;
  disabled?: boolean;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  companyName?: string;
  emergencyNumber?: string;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    {
      className,
      variant,
      isLoading = false,
      disabled = false,
      topContent,
      bottomContent,
      companyName,
      emergencyNumber,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <footer
        ref={ref}
        role="contentinfo"
        className={cn(footerVariants({ variant, isDisabled, className }))}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <div className="w-full flex justify-center py-4 border-b border-inherit/10">
            <SpinnerIcon className="w-5 h-5 opacity-50" />
          </div>
        )}
        <div
          className={cn(
            "mx-auto max-w-7xl px-6 lg:px-8",
            isLoading && "opacity-50",
          )}
        >
          {/* Main Footer Content Area */}
          {(topContent || children) && (
            <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {topContent}
              {children}
            </div>
          )}

          {/* Bottom Legal / Copyright Area */}
          {bottomContent && (
            <div className="py-6 border-t border-inherit/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
              {bottomContent}
            </div>
          )}
        </div>
      </footer>
    );
  },
);
Footer.displayName = "Footer";
export{
    Footer,footerVariants,
}