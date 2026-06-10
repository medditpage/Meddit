"use client";
// components/chat/ChatInputArea.tsx
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
  X: ({ className }: { className?: string }) => (
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
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  ),
};

const chatInputVariants = cva(
  "flex flex-col gap-2 p-3 bg-white border-t transition-colors",
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
  // Updated onSend to accept optional file properties
  onSend: (text: string, file?: File | null) => void;
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
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // NEW: State to hold the currently selected file
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

    const handleSubmit = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      // Allow sending if there is text OR a file attached
      if ((value.trim() || selectedFile) && !isDisabled) {
        onSend(value, selectedFile);
        setSelectedFile(null); // Clear file after sending
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedFile(e.target.files[0]);
      }
    };

    const clearFile = () => {
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

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
        {/* NEW: File Attachment Preview */}
        {selectedFile && (
          <div className="flex items-center gap-2 bg-teal-50 text-teal-800 text-xs px-3 py-2 rounded-lg w-fit border border-teal-100">
            <span className="font-medium truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            <button
              type="button"
              onClick={clearFile}
              className="hover:text-red-500 transition-colors"
            >
              <Icons.X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 w-full">
          {/* Left Actions */}
          <div className="flex items-center gap-1 pb-1 shrink-0">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx" // Accept images and documents
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()} // Triggers the file picker
              disabled={isDisabled}
              className={cn(
                "p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2",
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800 focus-visible:ring-slate-600"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300",
                selectedFile && "text-teal-600 bg-teal-50", // Highlight if file is selected
              )}
              aria-label="Attach file"
            >
              <Icons.Paperclip className="w-5 h-5" />
            </button>

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
              placeholder={
                selectedFile ? "Add a message about this file..." : placeholder
              }
              rows={1}
              className="w-full bg-transparent border-none resize-none py-3 px-4 max-h-[120px] outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
              aria-label="Message input"
            />
          </div>

          {/* Right Action (Send) */}
          <div className="pb-1 shrink-0">
            <button
              type="submit"
              disabled={isDisabled || (!value.trim() && !selectedFile)} // Disable if BOTH text and file are empty
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
        </div>
      </form>
    );
  },
);
ChatInputArea.displayName = "ChatInputArea";
