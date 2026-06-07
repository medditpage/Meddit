// TrendingTopics.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILITIES ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- ICONS ---
const Icons = {
  ArrowUp: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  ),
  ArrowDown: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  ),
  MessageSquare: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Bookmark: ({
    className,
    filled,
  }: {
    className?: string;
    filled?: boolean;
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  ),
  Share2: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  ),
  ShieldCheck: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 8-2 2 0 4 1 6 2a1 1 0 0 1 1 1v7z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  MoreHorizontal: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  ),
  Globe: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  TrendingUp: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  FileText: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  ),
};

// --- SHARED VARIANTS ---
const cardVariants = cva(
  "relative rounded-xl overflow-hidden transition-all duration-200 text-left",
  {
    variants: {
      variant: {
        primary: "bg-teal-600 text-white shadow-md border border-teal-700",
        secondary:
          "bg-slate-50 text-slate-900 shadow-sm border border-slate-100",
        inverted:
          "bg-slate-900 text-slate-50 shadow-md border border-slate-800",
        outlined: "bg-white text-slate-900 border border-slate-200 shadow-sm",
        ghost:
          "bg-transparent text-slate-900 border border-transparent hover:bg-slate-50",
      },
      isDisabled: {
        true: "opacity-60 pointer-events-none grayscale-[0.5]",
      },
    },
    defaultVariants: {
      variant: "outlined",
      isDisabled: false,
    },
  },
);

const actionButtonVariants = cva(
  "flex items-center gap-1.5 text-xs font-medium rounded-md px-2 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "hover:bg-white/10 focus-visible:ring-white",
        secondary:
          "text-slate-500 hover:bg-slate-200 hover:text-slate-900 focus-visible:ring-slate-400",
        inverted:
          "text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:ring-slate-400",
        outlined:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400",
      },
    },
    defaultVariants: {
      variant: "outlined",
    },
  },
);
export interface TrendingTopic {
  id: string;
  category: string;
  title: string;
  postsCount: string; // e.g., "15.2k"
}

export interface TrendingTopicsListProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof cardVariants>, "isDisabled"> {
  title?: string;
  topics: TrendingTopic[];
  onTopicClick?: (id: string) => void;
  onViewAll?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const TrendingTopicsList = React.forwardRef<
  HTMLDivElement,
  TrendingTopicsListProps
>(
  (
    {
      className,
      variant,
      title = "Trending Topics",
      topics,
      onTopicClick,
      onViewAll,
      isLoading = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const isDark = variant === "primary" || variant === "inverted";

    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn(
            cardVariants({ variant, isDisabled: true, className }),
            "p-5 animate-pulse",
          )}
          {...props}
        >
          <div className="h-5 w-1/2 bg-current/10 rounded mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-1/3 bg-current/5 rounded" />
                <div className="h-4 w-full bg-current/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, isDisabled, className }), "p-5")}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <Icons.TrendingUp
              className={cn(
                "w-4 h-4",
                isDark ? "text-teal-400" : "text-teal-600",
              )}
            />
            {title}
          </h3>
          <button
            type="button"
            disabled={isDisabled}
            aria-label="More options"
            className="p-1 rounded-sm opacity-50 hover:opacity-100"
          >
            <Icons.MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => onTopicClick?.(topic.id)}
              disabled={isDisabled}
              className="w-full text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-400 rounded-sm"
            >
              <div
                className={cn(
                  "text-[10px] font-medium flex items-center gap-2 mb-1",
                  isDark ? "text-inherit/60" : "text-slate-500",
                )}
              >
                <span>{topic.postsCount} posts</span>
                <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                <span>{topic.category}</span>
              </div>
              <h4 className="font-semibold text-sm leading-tight group-hover:underline decoration-1 underline-offset-2">
                {topic.title}
              </h4>
            </button>
          ))}
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            disabled={isDisabled}
            className={cn(
              "w-full text-center text-xs font-semibold py-3 mt-4 border-t transition-colors",
              isDark
                ? "border-white/10 hover:bg-white/5 text-teal-300"
                : "border-slate-100 hover:bg-slate-50 text-teal-700",
            )}
          >
            View All Topics
          </button>
        )}
      </div>
    );
  },
);
TrendingTopicsList.displayName = "TrendingTopicsList";