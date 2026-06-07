"use client";
import * as React from "react";
import { cva } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { CardBase } from "../ui/CardBase";
import { Button } from "../ui/Button";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ChevronIcon = ({ direction }: { direction: "left" | "right" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {direction === "left" ? (
      <path d="m15 18-6-6 6-6" />
    ) : (
      <path d="m9 18 6-6-6-6" />
    )}
  </svg>
);

export interface AvailabilityCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  monthYear: string;
  availableDates: number[];
  selectedDate?: number;
  onDateSelect?: (day: number) => void;
  slots: string[];
  selectedSlot?: string;
  onSlotSelect?: (slot: string) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onBook?: () => void;
}

export const AvailabilityCalendar = React.forwardRef<
  HTMLDivElement,
  AvailabilityCalendarProps
>(
  (
    {
      className,
      monthYear,
      availableDates,
      selectedDate,
      onDateSelect,
      slots,
      selectedSlot,
      onSlotSelect,
      onPrevMonth,
      onNextMonth,
      onBook,
      ...props
    },
    ref,
  ) => {
    // Generate a mock grid of 30 days
    const days = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
      <CardBase
        ref={ref}
        variant="outlined"
        className={cn("p-5 w-full max-w-sm", className)}
        {...props}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Availability</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevMonth}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <ChevronIcon direction="left" />
            </button>
            <span className="text-sm font-bold tracking-wider uppercase">
              {monthYear}
            </span>
            <button
              onClick={onNextMonth}
              className="p-1 hover:bg-slate-100 rounded"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-6">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, index) => (
            <div
              key={`${d}-${index}`}
              className="text-center text-xs font-semibold text-slate-400"
            >
              {d}
            </div>
          ))}
          {days.map((day) => {
            const isAvailable = availableDates.includes(day);
            const isSelected = selectedDate === day;
            return (
              <button
                key={day}
                disabled={!isAvailable}
                onClick={() => onDateSelect?.(day)}
                className={cn(
                  "h-8 w-8 rounded-full text-sm transition-all",
                  isAvailable
                    ? "hover:bg-teal-50"
                    : "opacity-30 cursor-not-allowed",
                  isSelected && "bg-teal-600 text-white hover:bg-teal-700",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <div className="mb-6">
            <p className="text-sm font-semibold mb-3">Available Slots</p>
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => onSlotSelect?.(slot)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md border transition-all",
                    selectedSlot === slot
                      ? "border-teal-600 bg-teal-50 text-teal-700"
                      : "border-slate-200 hover:border-slate-300",
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          className="w-full"
          onClick={onBook}
          disabled={!selectedDate || !selectedSlot}
        >
          Book Appointment
        </Button>
      </CardBase>
    );
  },
);

AvailabilityCalendar.displayName = "AvailabilityCalendar";
