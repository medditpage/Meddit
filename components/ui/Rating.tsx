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
const ratingVariants = cva("flex items-center gap-1", {
  variants: {
    variant: {
      primary: "text-teal-500",
      secondary: "text-slate-500",
      inverted: "text-slate-100",
      outlined: "text-slate-700",
      ghost: "text-slate-400",
    },
    isDisabled: {
      true: "opacity-50 cursor-not-allowed",
      false: "cursor-pointer",
    },
  },
  defaultVariants: {
    variant: "primary",
    isDisabled: false,
  },
});

export interface RatingProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  value: number;
  max?: number;
  variant?: VariantProps<typeof ratingVariants>["variant"];
  isLoading?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  onChange?: (value: number) => void;
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      value,
      max = 5,
      variant,
      isLoading = false,
      disabled = false,
      readonly = false,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);
    const isDisabled = disabled || isLoading || readonly;
    const displayValue = hoverValue !== null ? hoverValue : value;

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      if (isDisabled || !onChange) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onChange(index + 1);
      } else if (e.key === "ArrowRight" && value < max) {
        onChange(value + 1);
      } else if (e.key === "ArrowLeft" && value > 1) {
        onChange(value - 1);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(ratingVariants({ variant, isDisabled, className }))}
        role={readonly ? "img" : "slider"}
        aria-label={readonly ? `${value} out of ${max} stars` : "Rate"}
        aria-valuemin={1}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
        onMouseLeave={() => !isDisabled && setHoverValue(null)}
        {...props}
      >
        {isLoading ? (
          <div className="flex w-full items-center justify-center p-1">
            <SpinnerIcon className="h-5 w-5" />
          </div>
        ) : (
          Array.from({ length: max }).map((_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= displayValue;

            return (
              <span
                key={index}
                className={cn(
                  "transition-all duration-150 active:scale-90",
                  !isDisabled && "hover:scale-110",
                  isFilled ? "opacity-100" : "opacity-30",
                )}
                onClick={() => !isDisabled && onChange?.(starValue)}
                onMouseEnter={() => !isDisabled && setHoverValue(starValue)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                <StarIcon className="h-5 w-5" filled={isFilled} />
              </span>
            );
          })
        )}
      </div>
    );
  },
);
Rating.displayName = "Rating";
export{
    ratingVariants,
    Rating,
}