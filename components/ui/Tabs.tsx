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
type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  variant?: VariantProps<typeof tabsTriggerVariants>["variant"];
  isLoading?: boolean;
  disabled?: boolean;
};

const TabsContext = React.createContext<TabsContextValue | undefined>(
  undefined,
);

const useTabs = () => {
  const context = React.useContext(TabsContext);
  if (!context)
    throw new Error("Tabs components must be used within a Tabs provider");
  return context;
};

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  variant?: VariantProps<typeof tabsTriggerVariants>["variant"];
  isLoading?: boolean;
  disabled?: boolean;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value,
      onValueChange,
      variant = "primary",
      isLoading = false,
      disabled = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <TabsContext.Provider
        value={{ value, onValueChange, variant, isLoading, disabled }}
      >
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        "flex h-10 items-center justify-start rounded-md bg-slate-100 p-1 text-slate-500",
        className,
      )}
      {...props}
    />
  );
});
TabsList.displayName = "TabsList";

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm",
        secondary:
          "data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm",
        inverted:
          "data-[state=active]:bg-slate-800 data-[state=active]:text-white",
        outlined:
          "data-[state=active]:border data-[state=active]:border-slate-300 data-[state=active]:bg-white",
        ghost:
          "data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:underline underline-offset-4",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled, children, ...props }, ref) => {
    const {
      value: selectedValue,
      onValueChange,
      variant,
      isLoading,
      disabled: contextDisabled,
    } = useTabs();
    const isSelected = selectedValue === value;
    const isDisabled = disabled || isLoading || contextDisabled;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isSelected}
        aria-controls={`tabpanel-${value}`}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        data-state={isSelected ? "active" : "inactive"}
        onClick={() => onValueChange(value)}
        className={cn(tabsTriggerVariants({ variant }), className)}
        {...props}
      >
        {isLoading && isSelected ? (
          <SpinnerIcon className="mr-2 h-4 w-4" />
        ) : null}
        {children}
      </button>
    );
  },
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue } = useTabs();
    const isSelected = selectedValue === value;

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`tabpanel-${value}`}
        aria-labelledby={`tab-${value}`}
        tabIndex={0}
        className={cn(
          "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TabsContent.displayName = "TabsContent";

export {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    tabsTriggerVariants,
}