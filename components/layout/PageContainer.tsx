// this is components/layout/PageContainer.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILITIES ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- ICONS ---
const LoaderIcon = ({ className }: { className?: string }) => (
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

const pageContainerVariants = cva(
  "relative mx-auto w-full flex-1 transition-colors duration-200",
  {
    variants: {
      variant: {
        primary: "bg-teal-50/30 text-teal-950",
        secondary: "bg-slate-50 text-slate-900",
        inverted: "bg-slate-950 text-slate-50",
        outlined: "bg-white border-x border-slate-200 text-slate-900",
        ghost: "bg-transparent text-slate-900",
      },
      maxWidth: {
        sm: "max-w-3xl",
        md: "max-w-5xl",
        lg: "max-w-7xl",
        full: "max-w-full",
      },
      padding: {
        none: "px-0",
        sm: "px-4 sm:px-6",
        default: "px-4 sm:px-6 lg:px-8",
        lg: "px-6 sm:px-8 lg:px-12",
      },
      isDisabled: {
        true: "opacity-60 pointer-events-none select-none",
      },
    },
    defaultVariants: {
      variant: "secondary",
      maxWidth: "lg",
      padding: "default",
      isDisabled: false,
    },
  },
);

export interface PageContainerProps
  extends
    React.HTMLAttributes<HTMLElement>,
    Omit<VariantProps<typeof pageContainerVariants>, "isDisabled"> {
  isLoading?: boolean;
  disabled?: boolean;
  as?: React.ElementType;
}

const PageContainer = React.forwardRef<HTMLElement, PageContainerProps>(
  (
    {
      className,
      variant,
      maxWidth,
      padding,
      isLoading = false,
      disabled = false,
      as: Component = "main",
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <Component
        ref={ref}
        className={cn(
          pageContainerVariants({
            variant,
            maxWidth,
            padding,
            isDisabled,
            className,
          }),
        )}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-inherit/50 backdrop-blur-sm"
            aria-hidden="true"
          >
            <LoaderIcon className="h-8 w-8 opacity-75" />
          </div>
        )}
        {children}
      </Component>
    );
  },
);
PageContainer.displayName = "PageContainer";
export{
    PageContainer, pageContainerVariants,
}