"use client";

// app/appointments/page.tsx
// Meddit Appointments & Pre-Visit AI Triage Workspace (Universal Theme Support)

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AppointmentsPage() {
  const router = useRouter();

  const appointments = [
    {
      id: "apt-1",
      doctorName: "Dr. Ananya Rao",
      specialization: "Cardiology",
      time: "Today, 10:30 AM",
      status: "Confirmed",
      type: "Telehealth Video Call",
      symptoms: "Mild hypertension and morning fatigue",
      triageBrief: "Routine BP tracking. Recommended ECG review.",
      triageUrgency: "Routine",
    },
    {
      id: "apt-2",
      doctorName: "Dr. Rajesh Sharma",
      specialization: "Neurology",
      time: "Tomorrow, 02:00 PM",
      status: "Pending Triage",
      type: "In-Clinic Consultation",
      symptoms: "Occasional migraine with light sensitivity",
      triageBrief: "Requires pre-consultation symptom questionnaire.",
      triageUrgency: "Moderate",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <PageHeader
          title="Appointments & AI Pre-Visit Triage"
          subtitle="Manage scheduled specialist consultations, clinical visits, and review AI pre-visit symptom summaries."
          badge={{ text: "Clinical Appointments Active", variant: "teal" }}
          actions={
            <button
              onClick={() => router.push("/doctors")}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-full transition-all shadow-xs"
            >
              + Book New Appointment
            </button>
          }
        />

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 text-slate-900 dark:text-slate-100 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-extrabold text-sm flex items-center justify-center border border-teal-200 dark:border-teal-800 shrink-0">
                    {apt.doctorName.substring(4, 6).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{apt.doctorName}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{apt.specialization} • {apt.type}</p>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 font-extrabold mt-0.5">{apt.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">
                    {apt.status}
                  </span>
                  <button
                    onClick={() => router.push(`/appointments/doctor`)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-extrabold text-xs rounded-full transition-all shadow-xs"
                  >
                    🎥 Launch Consultation
                  </button>
                </div>
              </div>

              {/* Pre-Visit AI Triage Brief Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    🤖 Gemini 2.5 Pre-Visit AI Triage Summary
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40">
                    Urgency: {apt.triageUrgency}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  <strong>Patient Reported Symptoms:</strong> {apt.symptoms}
                </p>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  <strong>AI Clinical Note:</strong> {apt.triageBrief}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
