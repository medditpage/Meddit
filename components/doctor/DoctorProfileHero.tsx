"use client";
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Rating } from "../ui/Rating";
import { Button } from "../ui/Button";
import { MetricsCard } from "./MetricsCard";

const heroVariants = cva(
  "rounded-xl p-6 bg-white border border-slate-200 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-white",
        dark: "bg-slate-900 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface DoctorProfileHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  doctor: {
    name: string;
    specialty: string;
    location: string;
    experience: number;
    rating: number;
    fee: string;
    imageUrl?: string;
    isVerified?: boolean;
    metrics: {
      successRate: string;
      patients: string;
      reliability: string;
    };
  };
  onBookClick?: () => void;
  onChatClick?: () => void;
}

export const DoctorProfileHero = React.forwardRef<
  HTMLDivElement,
  DoctorProfileHeroProps
>(({ className, doctor, onBookClick, onChatClick, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(heroVariants(), className)} {...props}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="shrink-0">
          <Avatar
            src={doctor.imageUrl}
            alt={doctor.name}
            size="xl"
            fallback={doctor.name.substring(0, 2)}
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">
                  Dr. {doctor.name}
                </h1>
                {doctor.isVerified && <Badge variant="primary">Verified</Badge>}
              </div>
              <p className="text-slate-600 font-medium">{doctor.specialty}</p>
              <p className="text-sm text-slate-500 mt-1">
                {doctor.location} • {doctor.experience} years exp
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-teal-700">{doctor.fee}</p>
              <p className="text-xs text-slate-500">Consultation Fee</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Rating value={doctor.rating} readonly />
            <div className="flex gap-3">
              <Button onClick={onBookClick}>Book Appointment</Button>
              <Button variant="outlined" onClick={onChatClick}>
                Chat Privately
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <MetricsCard
          title="Success Rate"
          value={doctor.metrics.successRate}
          subtitle="Clinical outcomes"
          variant="ghost"
        />
        <MetricsCard
          title="Patients Treated"
          value={doctor.metrics.patients}
          subtitle="Verified reviews"
          variant="ghost"
        />
        <MetricsCard
          title="Reliability"
          value={doctor.metrics.reliability}
          subtitle="Community trust"
          variant="ghost"
        />
      </div>
    </div>
  );
});

DoctorProfileHero.displayName = "DoctorProfileHero";
