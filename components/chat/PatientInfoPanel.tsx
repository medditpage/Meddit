"use client";
// components/chat/PatientInfoPanel.tsx
import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  ChevronRight: ({ className }: { className?: string }) => (
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  User: ({ className }: { className?: string }) => (
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Heart: ({ className }: { className?: string }) => (
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
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
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Droplet: ({ className }: { className?: string }) => (
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
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  Lock: ({ className }: { className?: string }) => (
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  Briefcase: ({ className }: { className?: string }) => (
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
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  ),
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PatientReport {
  name: string;
  date: string;
  type: "lab" | "prescription" | "imaging" | "other";
}

export interface PatientAppointment {
  date: string;
  doctor: string;
  type: string;
  status: "upcoming" | "completed" | "cancelled";
}

export interface PatientInfo {
  name: string;
  role?: string;
  avatarInitials?: string;
  gender?: string;

  // Patient specific
  age?: number;
  bloodGroup?: string;
  allergies?: string[];
  conditions?: string[];
  isMedicalDataHidden?: boolean;

  // Doctor specific
  specialization?: string;
  experience?: string;
  hospital?: string;
  consultingFee?: string;
  cvUrl?: string;

  // Legacy (Keep for existing mock data if any)
  lastAppointment?: string;
  recentReports?: PatientReport[];
  upcomingAppointments?: PatientAppointment[];
}

export interface PatientInfoPanelProps {
  patient: PatientInfo | null;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const SectionHeader: React.FC<{
  icon: React.ReactNode;
  label: string;
  accent?: string;
}> = ({ icon, label, accent = "text-teal-600" }) => (
  <div className="flex items-center gap-2 mb-2">
    <span className={cn("w-4 h-4 shrink-0", accent)}>{icon}</span>
    <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
      {label}
    </h4>
  </div>
);

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex items-start justify-between gap-2 py-1.5 border-b border-slate-100 last:border-0">
    <span className="text-xs text-slate-400 shrink-0 w-24">{label}</span>
    <span className="text-xs font-medium text-slate-800 text-right">
      {value || "—"}
    </span>
  </div>
);

const TagChip: React.FC<{
  label: string;
  color: "red" | "amber" | "teal" | "slate" | "blue";
}> = ({ label, color }) => {
  const colors = {
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border",
        colors[color],
      )}
    >
      {label}
    </span>
  );
};

// ... Keeping your existing REPORT and APPOINTMENT constants here ...
const REPORT_TYPE_LABELS: Record<PatientReport["type"], string> = {
  lab: "Lab",
  prescription: "Rx",
  imaging: "Img",
  other: "Doc",
};
const REPORT_TYPE_COLORS: Record<
  PatientReport["type"],
  "teal" | "amber" | "slate" | "red"
> = { lab: "teal", prescription: "amber", imaging: "slate", other: "slate" };
const APPOINTMENT_STATUS_COLORS: Record<
  PatientAppointment["status"],
  "teal" | "amber" | "slate" | "red"
> = { upcoming: "teal", completed: "slate", cancelled: "red" };

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const PanelSkeleton: React.FC = () => (
  <div className="p-4 space-y-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-1/3" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-4/5" />
      </div>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const PatientInfoPanel: React.FC<PatientInfoPanelProps> = ({
  patient,
  isOpen,
  onToggle,
  className,
}) => {
  return (
    <>
      {/* ── Toggle tab (always visible) ── */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? "Close info panel" : "Open info panel"}
        aria-expanded={isOpen}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 z-10",
          "flex items-center justify-center",
          "w-5 h-14 rounded-l-lg",
          "bg-white border border-r-0 border-slate-200 shadow-sm",
          "text-slate-400 hover:text-teal-600 hover:bg-teal-50",
          "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600",
          isOpen ? "right-[280px]" : "right-0",
          "hidden lg:flex",
        )}
      >
        <Icons.ChevronRight
          className={cn(
            "w-3 h-3 transition-transform duration-200",
            isOpen ? "rotate-0" : "rotate-180",
          )}
        />
      </button>

      {/* ── Slide-in panel ── */}
      <aside
        aria-label="Profile information"
        className={cn(
          "hidden lg:flex flex-col shrink-0 border-l border-slate-200 bg-white",
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "w-[280px]" : "w-0",
          className,
        )}
      >
        {isOpen && (
          <div className="flex flex-col h-full w-[280px] overflow-y-auto">
            {/* Header dynamically updates based on role */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="text-sm font-bold text-slate-700">
                {patient?.role === "doctor"
                  ? "Doctor Profile"
                  : "Patient Details"}
              </h3>
              <button
                type="button"
                onClick={onToggle}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                aria-label="Close panel"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            {!patient ? (
              <PanelSkeleton />
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {/* ── Avatar + Name ── */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0",
                      patient.role === "doctor"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-teal-100 text-teal-700",
                    )}
                  >
                    {patient.avatarInitials || patient.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {patient.name}
                    </p>
                    {patient.role && (
                      <p className="text-xs text-slate-400 capitalize">
                        {patient.role}
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Basic Info (Everyone) ── */}
                <section aria-label="Basic information">
                  <SectionHeader
                    icon={<Icons.User className="w-4 h-4" />}
                    label="Basic Info"
                  />
                  <div className="rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-1">
                    {patient.age && (
                      <InfoRow label="Age" value={`${patient.age} years`} />
                    )}
                    {patient.gender && (
                      <InfoRow label="Gender" value={patient.gender} />
                    )}
                    {patient.role === "patient" &&
                      patient.bloodGroup &&
                      patient.bloodGroup !== "Hidden" && (
                        <InfoRow
                          label="Blood Group"
                          value={
                            <span className="inline-flex items-center gap-1">
                              <Icons.Droplet className="w-3 h-3 text-red-500" />
                              <span className="font-bold text-red-600">
                                {patient.bloodGroup}
                              </span>
                            </span>
                          }
                        />
                      )}
                  </div>
                </section>

                {/* ── DOCTOR SPECIFIC INFO ── */}
                {patient.role === "doctor" && (
                  <section aria-label="Professional information">
                    <SectionHeader
                      icon={<Icons.Briefcase className="w-4 h-4" />}
                      label="Professional Info"
                      accent="text-blue-500"
                    />
                    <div className="rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-1">
                      {patient.specialization && (
                        <InfoRow
                          label="Specialty"
                          value={patient.specialization}
                        />
                      )}
                      {patient.experience && (
                        <InfoRow
                          label="Experience"
                          value={patient.experience}
                        />
                      )}
                      {patient.hospital && (
                        <InfoRow
                          label="Hospital/Clinic"
                          value={patient.hospital}
                        />
                      )}
                      {patient.consultingFee && (
                        <InfoRow
                          label="Consulting Fee"
                          value={
                            patient.consultingFee.includes("₹")
                              ? patient.consultingFee
                              : `₹${patient.consultingFee}`
                          }
                        />
                      )}
                    </div>

                    {patient.cvUrl && (
                      <div className="mt-3">
                        <a
                          href={patient.cvUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
                        >
                          <Icons.FileText className="w-4 h-4" /> View Resume
                        </a>
                      </div>
                    )}
                  </section>
                )}

                {/* ── PATIENT SPECIFIC INFO ── */}
                {patient.role === "patient" && (
                  <>
                    {/* Check if privacy is active */}
                    {patient.isMedicalDataHidden ? (
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center mt-4">
                        <Icons.Lock className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-700">
                          Medical Data Locked
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          The patient has restricted access to their full
                          medical profile.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Allergies */}
                        {patient.allergies && patient.allergies.length > 0 && (
                          <section aria-label="Allergies">
                            <SectionHeader
                              icon={<Icons.AlertTriangle className="w-4 h-4" />}
                              label="Allergies"
                              accent="text-red-500"
                            />
                            <div className="flex flex-wrap gap-1.5">
                              {patient.allergies.map((a) => (
                                <TagChip key={a} label={a} color="red" />
                              ))}
                            </div>
                          </section>
                        )}

                        {/* Conditions */}
                        {patient.conditions &&
                          patient.conditions.length > 0 && (
                            <section aria-label="Medical conditions">
                              <SectionHeader
                                icon={<Icons.Activity className="w-4 h-4" />}
                                label="Conditions"
                                accent="text-amber-500"
                              />
                              <div className="flex flex-wrap gap-1.5">
                                {patient.conditions.map((c) => (
                                  <TagChip key={c} label={c} color="amber" />
                                ))}
                              </div>
                            </section>
                          )}

                        {/* Heart health note */}
                        <section
                          aria-label="Health status"
                          className="rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 p-3"
                        >
                          <div className="flex items-center gap-2">
                            <Icons.Heart className="w-4 h-4 text-teal-600 shrink-0" />
                            <p className="text-[11px] font-semibold text-teal-700">
                              Full access granted
                            </p>
                          </div>
                          <p className="text-[11px] text-teal-600/80 mt-1 pl-6">
                            Patient has enabled Doctor Mode.
                          </p>
                        </section>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
};

PatientInfoPanel.displayName = "PatientInfoPanel";
