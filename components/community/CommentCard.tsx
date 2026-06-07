// components/community/CommentCard.tsx
import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ArrowUpIcon = ({ className }: { className?: string }) => (
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
);

export interface CommentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  author: string;
  content: string;
  upvotes: number;
  timeAgo: string;
  onUpvote?: () => void;
  onReply?: () => void;
  isUpvoted?: boolean;
}

export const CommentCard = React.forwardRef<HTMLDivElement, CommentCardProps>(
  (
    {
      className,
      author,
      content,
      upvotes,
      timeAgo,
      onUpvote,
      onReply,
      isUpvoted = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn("flex gap-3", className)} {...props}>
        <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
          {author.substring(0, 2)}
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-900">
              @{author}
            </span>
            <span className="text-xs text-slate-500">{timeAgo}</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{content}</p>
          <div className="flex items-center gap-4 pt-1">
            <button
              type="button"
              onClick={onUpvote}
              className={cn(
                "flex items-center gap-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 rounded-sm",
                isUpvoted
                  ? "text-teal-600"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              <ArrowUpIcon className="w-4 h-4" />
              {upvotes}
            </button>
            <button
              type="button"
              onClick={onReply}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 rounded-sm"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    );
  },
);
CommentCard.displayName = "CommentCard";
