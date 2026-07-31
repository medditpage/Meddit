"use client";

// app/doctors/[id]/page.tsx
// Meddit Doctor Detail & Booking Profile Workspace

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";

export default function DoctorDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const doc = {
    id: id as string,
    name: "Dr. Ananya Rao",
    specialty: "Cardiology",
    experience_years: 12,
    rating: 4.9,
    consultation_fee: 800,
    hospital_affiliation: "Apollo Hospital, Bangalore",
    bio: "Board-certified Senior Cardiologist specializing in preventive cardiovascular care, hypertension management, and non-invasive electrophysiology. Over 12 years of clinical practice across premier medical institutions.",
    education: "MBBS, MD (Cardiology) - AIIMS New Delhi",
    languages: ["English", "Hindi", "Kannada"],
    is_verified: true,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/doctors")}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-orange-400 font-bold text-xs shadow-2xs transition-all hover:bg-slate-800"
        >
          ← Back to Doctor Discovery
        </button>

        {/* Doctor Header Profile Workspace Card */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 text-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-teal-950 border border-teal-800 text-teal-300 font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-inner">
              {doc.name.substring(0, 2).toUpperCase()}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">{doc.name}</h1>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ✓ Verified Specialist
                </span>
              </div>
              <p className="text-sm font-bold text-teal-400">m/{doc.specialty}</p>
              <p className="text-xs text-slate-400 font-medium">🏥 {doc.hospital_affiliation}</p>
            </div>

            <div className="sm:text-right space-y-1 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
              <p className="text-xl font-black text-white">₹{doc.consultation_fee}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Per Consultation</p>
              <button
                onClick={() => router.push(`/appointments?doc=${doc.id}`)}
                className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-xs rounded-full transition-all shadow-xs mt-2"
              >
                Book Visit Now
              </button>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800/80 text-center">
            <div>
              <p className="text-base font-black text-amber-400">★ {doc.rating}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Patient Rating</p>
            </div>
            <div>
              <p className="text-base font-black text-white">{doc.experience_years} Years</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Clinical Experience</p>
            </div>
            <div>
              <p className="text-base font-black text-teal-400">1,200+</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Consultations</p>
            </div>
          </div>

          {/* Bio & Credentials */}
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <h3 className="font-extrabold text-white text-sm">About {doc.name}</h3>
              <p className="text-slate-300 leading-relaxed font-medium">{doc.bio}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Education & Degrees</span>
                <p className="font-bold text-white text-xs">{doc.education}</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Languages Spoken</span>
                <p className="font-bold text-teal-300 text-xs">{doc.languages.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
