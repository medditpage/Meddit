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
  Calendar: ({ className }: { className?: string }) => (
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
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  Clock: ({ className }: { className?: string }) => (
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Video: ({ className }: { className?: string }) => (
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
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  ),
  MapPin: ({ className }: { className?: string }) => (
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Activity: ({ className }: { className?: string }) => (
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
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  Pill: ({ className }: { className?: string }) => (
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
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
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
export interface ConsultationCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof cardVariants>, "isDisabled"> {
  doctor: {
    name: string;
    specialty: string;
    imageUrl?: string;
  };
  appointment: {
    date: string;
    time: string;
    type: "video" | "clinic";
    status?: "upcoming" | "past" | "cancelled";
  };
  isLoading?: boolean;
  disabled?: boolean;
  onAction?: () => void;
  actionLabel?: string;
}

export const ConsultationCard = React.forwardRef<
  HTMLDivElement,
  ConsultationCardProps
>(
  (
    {
      className,
      variant,
      doctor,
      appointment,
      isLoading = false,
      disabled = false,
      onAction,
      actionLabel,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const isDark = variant === "primary" || variant === "inverted";
    const isUpcoming = appointment.status === "upcoming" || !appointment.status;

    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn(
            cardVariants({ variant, isDisabled: true, className }),
            "p-4 animate-pulse",
          )}
          {...props}
        >
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-full bg-current/10 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-current/10 rounded" />
              <div className="h-3 w-24 bg-current/10 rounded" />
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="h-8 w-1/2 bg-current/5 rounded-md" />
            <div className="h-8 w-1/3 bg-current/10 rounded-md" />
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, isDisabled, className }),
          "p-4 flex flex-col gap-4",
        )}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        <div className="flex gap-3 items-start">
          <img
            src={doctor.imageUrl || "/api/placeholder/48/48"}
            alt={doctor.name}
            className="w-12 h-12 rounded-full object-cover bg-slate-100 ring-2 ring-inherit/10"
          />
          <div className="flex-1 min-w-0 pt-0.5">
            <h4 className="font-semibold text-base truncate">
              Dr. {doctor.name}
            </h4>
            <div
              className={cn(
                "flex items-center gap-2 text-xs mt-0.5",
                isDark ? "text-inherit/80" : "text-slate-500",
              )}
            >
              <span className="truncate">{doctor.specialty}</span>
              <span className="shrink-0 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                {appointment.type === "video" ? "Video Call" : "Clinic Visit"}
              </span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center justify-between rounded-lg p-2.5",
            isDark ? "bg-white/10" : "bg-slate-50",
          )}
        >
          <div className="flex flex-col gap-1 text-sm">
            <div
              className={cn(
                "font-medium",
                isUpcoming && !isDark ? "text-teal-700" : "",
              )}
            >
              {appointment.date}
            </div>
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs",
                isDark ? "text-inherit/70" : "text-slate-500",
              )}
            >
              <Icons.Clock className="w-3.5 h-3.5" />
              {appointment.time}
            </div>
          </div>

          {onAction && (
            <button
              type="button"
              onClick={onAction}
              disabled={isDisabled}
              className={cn(
                "text-xs font-bold px-3 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
                isUpcoming
                  ? isDark
                    ? "bg-white text-teal-900 hover:bg-teal-50"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                  : isDark
                    ? "border border-white/20 hover:bg-white/10"
                    : "border border-slate-200 hover:bg-slate-100",
              )}
            >
              {actionLabel ||
                (isUpcoming
                  ? appointment.type === "video"
                    ? "Join Link"
                    : "Reschedule"
                  : "Rebook")}
            </button>
          )}
        </div>
      </div>
    );
  },
);
ConsultationCard.displayName = "ConsultationCard";