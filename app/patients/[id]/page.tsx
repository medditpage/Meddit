"use client";

// app/patients/[id]/page.tsx
// Meddit Patient Detail & Clinical Records Timeline (Universal Theme Support)

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MedicalTimelinePanel } from "@/components/patient/MedicalTimelinePanel";
import { generateAIMedicalTimeline } from "@/lib/ai/timeline";
import { MedicalTimelineOutput } from "@/lib/ai/schemas";

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [aiTimeline, setAiTimeline] = React.useState<MedicalTimelineOutput | null>(null);

  const patient = {
    id: id as string,
    name: "Rohan Verma",
    age: 34,
    gender: "Male",
    blood_group: "O+ Positive",
    abha_id: "ABHA-9821-4412-8819",
    vitals: {
      bp: "120/80 mmHg",
      pulse: "72 bpm",
      weight: "74 kg",
      temp: "98.6 °F",
    },
    medical_history: [
      { date: "Yesterday", event: "BP & Cardiovascular Consultation", doctor: "Dr. Ananya Rao", notes: "Normal sinus rhythm. Prescribed Telmisartan 40mg daily." },
      { date: "Jul 15, 2026", event: "Lipid Profile & Blood Work", doctor: "Apollo Diagnostics", notes: "Total cholesterol: 185 mg/dL. HDL: 52 mg/dL." },
      { date: "May 10, 2026", event: "Routine Health Checkup", doctor: "Dr. Rajesh Sharma", notes: "General health screening cleared." },
    ],
  };

  React.useEffect(() => {
    const fetchTimeline = async () => {
      const data = await generateAIMedicalTimeline(patient.id, patient.medical_history);
      setAiTimeline(data);
    };
    fetchTimeline();
  }, [patient.id]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto text-slate-900 dark:text-slate-100 transition-colors">
        <button
          onClick={() => router.push("/patients")}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-500 font-extrabold text-xs shadow-xs transition-all"
        >
          ← Back to Patient Vault
        </button>

        {/* Patient Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-teal-100 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 font-extrabold text-xl flex items-center justify-center shrink-0 shadow-inner">
                {patient.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{patient.name}</h1>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40">
                    Active Patient
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {patient.age} Yrs • {patient.gender} • Blood Group: <strong className="text-slate-900 dark:text-white">{patient.blood_group}</strong>
                </p>
                <p className="text-[11px] text-teal-600 dark:text-teal-400 font-mono font-bold">{patient.abha_id}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push("/messages")}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-extrabold text-xs rounded-full transition-all shadow-xs"
              >
                💬 Open Chat
              </button>
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Blood Pressure</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">{patient.vitals.bp}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Pulse Rate</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{patient.vitals.pulse}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Body Weight</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">{patient.vitals.weight}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Temperature</span>
              <span className="text-sm font-extrabold text-teal-600 dark:text-teal-300">{patient.vitals.temp}</span>
            </div>
          </div>

          {/* AI Medical Timeline Panel */}
          {aiTimeline && <MedicalTimelinePanel timeline={aiTimeline} />}

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Original Medical History Records */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>📋</span> Raw Consultation Records & Lab Notes
            </h3>

            <div className="space-y-3">
              {patient.medical_history.map((item, index) => (
                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{item.event}</span>
                    <span className="text-slate-500 font-medium">{item.date}</span>
                  </div>
                  <p className="text-teal-600 dark:text-teal-400 font-bold">Doctor: {item.doctor}</p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
