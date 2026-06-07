// components/community/CommunityCard.tsx
import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const UsersIcon = ({ className }: { className?: string }) => (
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
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export interface CommunityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  memberCount: string;
  onJoin?: () => void;
  isJoined?: boolean;
}

export const CommunityCard = React.forwardRef<
  HTMLDivElement,
  CommunityCardProps
>(
  (
    { className, name, memberCount, onJoin, isJoined = false, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between group", className)}
        {...props}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
            <UsersIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-slate-900 truncate">
              {name}
            </h4>
            <p className="text-xs text-slate-500 truncate">
              {memberCount} members
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onJoin}
          className={cn(
            "shrink-0 ml-4 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600",
            isJoined
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
              : "bg-teal-50 text-teal-700 hover:bg-teal-100",
          )}
        >
          {isJoined ? "Joined" : "Join"}
        </button>
      </div>
    );
  },
);
CommunityCard.displayName = "CommunityCard";
