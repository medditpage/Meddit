"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Star = ({
  fillPercentage,
  className,
}: {
  fillPercentage: number;
  className?: string;
}) => {
  return (
    <div className={cn("relative inline-block leading-none", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-slate-200 dark:text-slate-700"
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <div
        className="absolute top-0 left-0 overflow-hidden h-full"
        style={{ width: `${fillPercentage}%` }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-amber-400 dark:text-amber-500"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
    </div>
  );
};

export interface RatingProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  value: number;
  max?: number;
  precision?: 0.5 | 1;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg" | number;
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      value,
      max = 5,
      precision = 0.5,
      readOnly = false,
      onChange,
      size = "md",
      ...props
    },
    ref,
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);

    const displayValue = hoverValue !== null ? hoverValue : value;

    const handleMouseMove = (
      e: React.MouseEvent<HTMLSpanElement>,
      index: number,
    ) => {
      if (readOnly) return;

      if (precision === 0.5) {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - left) / width;
        setHoverValue(index + (percent < 0.5 ? 0.5 : 1));
      } else {
        setHoverValue(index + 1);
      }
    };

    const handleMouseLeave = () => {
      if (!readOnly) {
        setHoverValue(null);
      }
    };

    const handleClick = (index: number) => {
      if (!readOnly && onChange) {
        const newValue = hoverValue !== null ? hoverValue : index + 1;
        onChange(newValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (readOnly || !onChange) return;

      let newValue = value;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        newValue = Math.min(value + precision, max);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        newValue = Math.max(value - precision, 0);
      }

      if (newValue !== value) {
        e.preventDefault();
        onChange(newValue);
      }
    };

    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    };

    const iconClass = typeof size === "string" ? sizeClasses[size] : "";
    const customSize =
      typeof size === "number" ? { width: size, height: size } : {};

    return (
      <div
        ref={ref}
        role={readOnly ? "img" : "slider"}
        aria-label={readOnly ? `${value} out of ${max} stars` : "Rate item"}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={readOnly ? -1 : 0}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 rounded-sm",
          readOnly ? "cursor-default" : "cursor-pointer",
          className,
        )}
        {...props}
      >
        {Array.from({ length: max }).map((_, index) => {
          const fillPercentage = Math.max(
            0,
            Math.min(100, (displayValue - index) * 100),
          );

          return (
            <span
              key={index}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onClick={() => handleClick(index)}
              className={cn(
                "transition-transform active:scale-90 touch-none block",
                !readOnly && "hover:scale-110",
                iconClass,
              )}
              style={customSize}
            >
              <Star fillPercentage={fillPercentage} className="w-full h-full" />
            </span>
          );
        })}
      </div>
    );
  },
);

Rating.displayName = "Rating";

export { Rating };
