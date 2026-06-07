import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { CardBase } from "../ui/CardBase";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Rating } from "./Rating";
import { Button } from "../ui/Button";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MapPinIcon = ({ className }: { className?: string }) => (
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
    className={className}
    aria-hidden="true"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export interface DoctorListCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  consultationFee: string;
  location: string;
  imageUrl?: string;
  isVerified?: boolean;
  isLoading?: boolean;
  onBookClick?: () => void;
}

export const DoctorListCard = React.forwardRef<
  HTMLDivElement,
  DoctorListCardProps
>(
  (
    {
      className,
      name,
      specialty,
      experience,
      rating,
      consultationFee,
      location,
      imageUrl,
      isVerified = false,
      isLoading = false,
      onBookClick,
      ...props
    },
    ref,
  ) => {
    return (
      <CardBase
        ref={ref}
        variant="outlined"
        isLoading={isLoading}
        className={cn(
          "p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6",
          className,
        )}
        {...props}
      >
        {/* Avatar Section */}
        <div className="shrink-0 flex items-start gap-4">
          <Avatar
            src={imageUrl}
            alt={name}
            fallback={name.substring(0, 2)}
            size="lg"
            variant="secondary"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">Dr. {name}</h3>
                {isVerified && (
                  <Badge variant="primary" className="text-[10px]">
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-600 font-medium">{specialty}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm font-bold text-teal-700">
                {consultationFee}
              </p>
              <p className="text-xs text-slate-500">Per consultation</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <Rating value={rating} readOnly size="sm" />
            <span className="text-slate-400">|</span>
            <span>{experience} years experience</span>
            <span className="text-slate-400">|</span>
            <div className="flex items-center gap-1">
              <MapPinIcon className="w-3.5 h-3.5" />
              {location}
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="sm:self-center">
          <Button
            variant="primary"
            size="default"
            onClick={onBookClick}
            className="w-full sm:w-auto"
          >
            Book Appointment
          </Button>
        </div>
      </CardBase>
    );
  },
);

DoctorListCard.displayName = "DoctorListCard";
