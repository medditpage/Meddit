"use client";
// MessageBubble
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/utils/supabase/client";

// --- UTILITIES ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- ICONS ---
const Icons = {
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

// --- VARIANTS ---
const messageBubbleVariants = cva(
  "relative max-w-[80%] rounded-2xl px-4 py-2.5 text-sm transition-all",
  {
    variants: {
      variant: {
        primary: "bg-teal-600 text-white rounded-tr-sm shadow-sm",
        secondary:
          "bg-slate-100 text-slate-900 rounded-tl-sm border border-slate-200",
        inverted: "bg-slate-800 text-slate-100 border border-slate-700",
        outlined: "bg-white text-slate-900 border border-slate-200",
        ghost:
          "bg-transparent text-slate-900 border border-transparent hover:bg-slate-50",
      },
      isOwn: {
        true: "ml-auto rounded-tr-sm",
        false: "mr-auto rounded-tl-sm",
      },
      isDisabled: {
        true: "opacity-60",
      },
    },
    defaultVariants: {
      variant: "secondary",
      isOwn: false,
      isDisabled: false,
    },
  },
);

export interface MessageBubbleProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "content">,
    Omit<VariantProps<typeof messageBubbleVariants>, "isDisabled"> {
  content: React.ReactNode;
  timestamp: string;
  isOwn?: boolean;
  isRead?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  // NEW: Added props to handle files
  fileUrl?: string;
  fileType?: string;
}

// --- COMPONENT ---
export const MessageBubble = React.forwardRef<
  HTMLDivElement,
  MessageBubbleProps
>(
  (
    {
      className,
      variant,
      content,
      timestamp,
      isOwn = false,
      isRead = false,
      isLoading = false,
      disabled = false,
      fileUrl,
      fileType,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const defaultVariant = variant || (isOwn ? "primary" : "secondary");
    const isDark =
      defaultVariant === "primary" || defaultVariant === "inverted";

    // NEW: State to hold the securely resolved URL
    const [resolvedUrl, setResolvedUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
      if (!fileUrl) return;

      // If it's already a full HTTP link, just use it
      if (fileUrl.startsWith("http")) {
        setResolvedUrl(fileUrl);
        return;
      }

      // Otherwise, ask Supabase for a secure 1-hour view link
      const fetchSecureUrl = async () => {
        const supabase = createClient();
        const { data } = await supabase.storage
          .from("chat-files")
          .createSignedUrl(fileUrl, 3600); // 1 hour expiry

        if (data) {
          const cleanUrl = `/api/file-proxy?url=${encodeURIComponent(data.signedUrl)}`;
        setResolvedUrl(cleanUrl);
        }
      };

      fetchSecureUrl();
    }, [fileUrl]);

    // --- Typing indicator skeleton ---
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex max-w-[80%] mb-4",
            isOwn ? "ml-auto" : "mr-auto",
            className,
          )}
          {...props}
        >
          <div
            className={cn(
              "rounded-2xl px-4 py-3 flex gap-1",
              isOwn
                ? "bg-teal-600/50 rounded-tr-sm"
                : "bg-slate-100 rounded-tl-sm",
            )}
          >
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                className="w-1.5 h-1.5 rounded-full bg-current/40 animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </div>
      );
    }

    // Determine if we should hide the default text ("Sent a image") when an actual file is rendered
    const hideDefaultText =
      (content === "Sent a image" ||
        content === "Sent a pdf" ||
        content === "Sent a document") &&
      fileUrl;

    return (
      <div
        className={cn("flex flex-col w-full mb-4", isDisabled && "opacity-60")}
        aria-disabled={isDisabled}
      >
        <div
          ref={ref}
          className={cn(
            messageBubbleVariants({
              variant: defaultVariant,
              isOwn,
              className,
            }),
          )}
          {...props}
        >
          {/* NEW: Render the attached file if one exists */}
          {fileUrl && (
            <div className="mb-2">
              {fileType === "image" ? (
                resolvedUrl ? (
                  <a
                    href={resolvedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={resolvedUrl}
                      alt="Chat attachment"
                      className="max-w-[200px] sm:max-w-[280px] rounded-lg object-cover bg-black/10 hover:opacity-90 transition-opacity cursor-zoom-in"
                    />
                  </a>
                ) : (
                  <div className="w-[200px] h-[150px] bg-black/10 animate-pulse rounded-lg flex items-center justify-center">
                    <Icons.Spinner className="w-6 h-6 opacity-50" />
                  </div>
                )
              ) : (
                <a
                  href={resolvedUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-colors text-sm font-medium",
                    isDark
                      ? "bg-white/10 hover:bg-white/20"
                      : "bg-black/5 hover:bg-black/10",
                  )}
                >
                  <Icons.FileText className="w-5 h-5 shrink-0" />
                  <span className="truncate max-w-[150px]">View Document</span>
                  <Icons.Download className="w-4 h-4 ml-auto opacity-50" />
                </a>
              )}
            </div>
          )}

          {/* Render the text content (unless it's just the fallback text) */}
          {!hideDefaultText && (
            <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
          )}

          <div
            className={cn(
              "flex items-center justify-end gap-1 mt-1 text-[10px]",
              isDark ? "text-white/70" : "text-slate-500",
            )}
          >
            {timestamp}
            {isOwn && (
              <Icons.CheckCheck
                className={cn(
                  "w-3.5 h-3.5",
                  isRead
                    ? isDark
                      ? "text-teal-200"
                      : "text-teal-600"
                    : "opacity-50",
                )}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
);

MessageBubble.displayName = "MessageBubble";
