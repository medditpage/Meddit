// chatInboxItem
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
  VerifiedCheck: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  ),
  AlertTriangle: ({ className }: { className?: string }) => (
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" x2="12" y1="9" y2="13" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  ),
  Phone: ({ className }: { className?: string }) => (
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Paperclip: ({ className }: { className?: string }) => (
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
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  ),
  Mic: ({ className }: { className?: string }) => (
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
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  ),
  Send: ({ className }: { className?: string }) => (
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
      <line x1="22" x2="11" y1="2" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
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
  Download: ({ className }: { className?: string }) => (
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  ),
  CheckCheck: ({ className }: { className?: string }) => (
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
      <path d="M18 6 7 17l-5-5" />
      <path d="m22 10-7.5 7.5L13 16" />
    </svg>
  ),
  Spinner: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
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
  ),
};

const chatInboxItemVariants = cva(
  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
  {
    variants: {
      variant: {
        primary: "hover:bg-teal-50 focus-visible:ring-teal-600",
        secondary: "hover:bg-slate-100 focus-visible:ring-slate-400",
        inverted: "hover:bg-slate-800 focus-visible:ring-slate-400",
        outlined:
          "border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-400",
        ghost: "hover:bg-slate-100 focus-visible:ring-slate-400",
      },
      isActive: {
        true: "",
        false: "",
      },
      isDisabled: {
        true: "opacity-50 pointer-events-none grayscale-[0.5]",
      },
    },
    defaultVariants: {
      variant: "secondary",
      isActive: false,
      isDisabled: false,
    },
  },
);

export interface ChatInboxItemProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    Omit<VariantProps<typeof chatInboxItemVariants>, "isDisabled"> {
  avatarUrl?: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOnline?: boolean;
  isActive?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  isVerified?: boolean; // <-- Added this
}

export const ChatInboxItem = React.forwardRef<
  HTMLButtonElement,
  ChatInboxItemProps
>(
  (
    {
      className,
      variant,
      avatarUrl,
      name,
      lastMessage,
      time,
      unreadCount = 0,
      isOnline = false,
      isActive = false,
      isLoading = false,
      disabled = false,
      isVerified = false, // <-- Added this
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const isDark = variant === "inverted";

    const activeStyles = {
      primary: "bg-teal-100/60 text-teal-900 font-medium",
      secondary: "bg-slate-200 text-slate-900 font-medium",
      inverted: "bg-slate-800 text-white font-medium",
      outlined: "bg-slate-50 border-slate-300 font-medium",
      ghost: "bg-slate-200 text-slate-900 font-medium",
    };

    if (isLoading) {
      return (
        <div
          className={cn(
            chatInboxItemVariants({ variant, isDisabled: true, className }),
            "animate-pulse",
          )}
          aria-hidden="true"
        >
          <div className="w-12 h-12 rounded-full bg-current/10 shrink-0" />
          <div className="flex-1 space-y-2 overflow-hidden">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-current/10 rounded" />
              <div className="h-3 w-10 bg-current/10 rounded" />
            </div>
            <div className="h-3 w-3/4 bg-current/5 rounded" />
          </div>
        </div>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={cn(
          chatInboxItemVariants({ variant, isActive, isDisabled, className }),
          isActive && activeStyles[variant || "secondary"],
        )}
        aria-current={isActive ? "true" : undefined}
        {...props}
      >
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-700 text-lg font-bold">
                {name.charAt(0)}
              </div>
            )}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            {/* Added a wrapper here to hold the name and the badge together */}
            <div className="flex items-center gap-1 min-w-0">
              <h4
                className={cn(
                  "text-sm font-semibold truncate",
                  isDark ? "text-slate-100" : "text-slate-900",
                )}
              >
                {name}
              </h4>
              {/* Badge rendered if isVerified is true */}
              {isVerified && (
                <Icons.VerifiedCheck className="w-4 h-4 text-blue-500 shrink-0" />
              )}
            </div>
            <span
              className={cn(
                "text-[10px] shrink-0 ml-2",
                isActive
                  ? isDark
                    ? "text-slate-300"
                    : "text-slate-600"
                  : isDark
                    ? "text-slate-500"
                    : "text-slate-400",
              )}
            >
              {time}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                "text-xs truncate",
                isActive
                  ? isDark
                    ? "text-slate-300"
                    : "text-slate-700"
                  : isDark
                    ? "text-slate-400"
                    : "text-slate-500",
                unreadCount > 0 &&
                  "font-medium text-slate-900 dark:text-slate-200",
              )}
            >
              {lastMessage}
            </p>
            {unreadCount > 0 && (
              <span className="shrink-0 bg-teal-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        </div>
      </button>
    );
  },
);
ChatInboxItem.displayName = "ChatInboxItem";
