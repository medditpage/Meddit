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

const chatInputVariants = cva(
  "flex items-end gap-2 p-3 bg-white border-t transition-colors",
  {
    variants: {
      variant: {
        primary: "border-slate-200",
        secondary: "bg-slate-50 border-slate-200",
        inverted: "bg-slate-900 border-slate-800",
        outlined: "border-slate-200",
        ghost: "border-transparent bg-transparent",
      },
      isDisabled: {
        true: "opacity-60 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      isDisabled: false,
    },
  },
);

export interface ChatInputAreaProps
  extends
    Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onChange">,
    Omit<VariantProps<typeof chatInputVariants>, "isDisabled"> {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
  onAttach?: () => void;
  onVoice?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ChatInputArea = React.forwardRef<
  HTMLFormElement,
  ChatInputAreaProps
>(
  (
    {
      className,
      variant,
      value,
      onChange,
      onSend,
      onAttach,
      onVoice,
      placeholder = "Type clinical observation or response...",
      isLoading = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const isDark = variant === "inverted";
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim() && !isDisabled) {
        onSend(value);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    // Auto-resize textarea
    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
    }, [value]);

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn(chatInputVariants({ variant, isDisabled, className }))}
        {...props}
      >
        {/* Left Actions */}
        <div className="flex items-center gap-1 pb-1 shrink-0">
          {onAttach && (
            <button
              type="button"
              onClick={onAttach}
              disabled={isDisabled}
              className={cn(
                "p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2",
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800 focus-visible:ring-slate-600"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300",
              )}
              aria-label="Attach file"
            >
              <Icons.Paperclip className="w-5 h-5" />
            </button>
          )}
          {onVoice && (
            <button
              type="button"
              onClick={onVoice}
              disabled={isDisabled}
              className={cn(
                "p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2",
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800 focus-visible:ring-slate-600"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300",
              )}
              aria-label="Record voice message"
            >
              <Icons.Mic className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Input Field */}
        <div
          className={cn(
            "flex-1 relative rounded-2xl border transition-colors focus-within:ring-2",
            isDark
              ? "bg-slate-800 border-slate-700 focus-within:ring-slate-600 focus-within:border-transparent text-white"
              : "bg-slate-50 border-slate-200 focus-within:ring-teal-600 focus-within:border-transparent text-slate-900",
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            placeholder={placeholder}
            rows={1}
            className="w-full bg-transparent border-none resize-none py-3 px-4 max-h-[120px] outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
            aria-label="Message input"
          />
        </div>

        {/* Right Action (Send) */}
        <div className="pb-1 shrink-0">
          <button
            type="submit"
            disabled={isDisabled || !value.trim()}
            className={cn(
              "p-3 rounded-full flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isDark
                ? "bg-teal-600 text-white hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-600 focus-visible:ring-teal-500"
                : "bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-100 disabled:text-slate-400 focus-visible:ring-teal-600",
            )}
            aria-label="Send message"
          >
            {isLoading ? (
              <Icons.Spinner className="w-5 h-5 text-current" />
            ) : (
              <Icons.Send className="w-5 h-5 -ml-0.5" />
            )}
          </button>
        </div>
      </form>
    );
  },
);
ChatInputArea.displayName = "ChatInputArea";
