"use client";
// this is FloatingSideBar
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILITIES ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const floatingSidebarVariants = cva(
  "flex flex-col gap-2 p-3 rounded-[2rem] shadow-lg shadow-slate-200/50 transition-all",
  {
    variants: {
      variant: {
        primary: "bg-teal-50 border border-teal-100",
        secondary: "bg-white border border-slate-100",
        inverted: "bg-slate-900 border border-slate-800 shadow-slate-900/50",
        outlined: "bg-white border-2 border-slate-200 shadow-none",
        ghost: "bg-slate-100/50 backdrop-blur-md shadow-none",
      },
      isDisabled: {
        true: "opacity-60 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "secondary",
      isDisabled: false,
    },
  },
);

const sidebarItemVariants = cva(
  "group relative flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "focus-visible:ring-teal-600 text-teal-900 hover:bg-teal-100/50",
        secondary:
          "focus-visible:ring-slate-400 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        inverted:
          "focus-visible:ring-slate-400 text-slate-400 hover:bg-slate-800 hover:text-white",
        outlined:
          "focus-visible:ring-slate-400 text-slate-700 hover:bg-slate-100",
        ghost: "focus-visible:ring-slate-400 text-slate-700 hover:bg-white/60",
      },
      isActive: {
        true: "", // Handled dynamically below to map active states specifically per variant
        false: "",
      },
    },
    defaultVariants: {
      variant: "secondary",
      isActive: false,
    },
  },
);

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  iconPath?: React.ReactNode;
  badgeCount?: number;
  href?: string;
  disabled?: boolean;
}

export interface FloatingSidebarProps
  extends
    React.HTMLAttributes<HTMLElement>,
    Omit<VariantProps<typeof floatingSidebarVariants>, "isDisabled"> {
  items: NavItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  position?: "left" | "right";
}

const FloatingSidebar = React.forwardRef<HTMLElement, FloatingSidebarProps>(
  (
    {
      className,
      variant = "secondary",
      items,
      activeId,
      onItemClick,
      isLoading = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    // Helper to determine specific active styles based on variant
    const getActiveStyles = (
      v: VariantProps<typeof floatingSidebarVariants>["variant"],
    ) => {
      switch (v) {
        case "primary":
          return "bg-teal-600 text-white shadow-md shadow-teal-600/20";
        case "inverted":
          return "bg-white text-slate-900 shadow-sm";
        case "outlined":
          return "bg-slate-100 border border-slate-200 text-slate-900";
        case "ghost":
          return "bg-white shadow-sm text-slate-900";
        case "secondary":
        default:
          return "bg-teal-600 text-white shadow-md shadow-teal-600/20";
      }
    };

    return (
      <aside
        ref={ref}
        className={cn(
          floatingSidebarVariants({ variant, isDisabled, className }),
          "w-64 shrink-0",
        )}
        aria-busy={isLoading}
        {...props}
      >
        <nav
          className="flex flex-col gap-1 w-full"
          aria-label="Sidebar Navigation"
        >
          {isLoading
            ? // Loading Skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-full bg-current/5 animate-pulse"
                >
                  <div className="h-5 w-5 rounded-md bg-current/10 shrink-0" />
                  <div className="h-4 w-24 rounded bg-current/10" />
                </div>
              ))
            : items.map((item) => {
                const isItemActive = activeId === item.id;
                const isItemDisabled = isDisabled || item.disabled;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isItemDisabled}
                    aria-current={isItemActive ? "page" : undefined}
                    onClick={() => onItemClick?.(item.id)}
                    className={cn(
                      sidebarItemVariants({ variant, isActive: isItemActive }),
                      isItemActive && getActiveStyles(variant),
                      "w-full justify-start",
                    )}
                  >
                    {(item.icon || item.iconPath) && (
                      <span
                        className={cn(
                          "shrink-0 transition-colors",
                          isItemActive ? "text-inherit" : "text-inherit/70",
                        )}
                      >
                        {item.icon ?? item.iconPath}
                      </span>
                    )}
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
        </nav>
      </aside>
    );
  },
);
FloatingSidebar.displayName = "FloatingSidebar";

export { FloatingSidebar, floatingSidebarVariants };
