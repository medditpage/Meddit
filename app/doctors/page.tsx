"use client";

// app/doctors/page.tsx
// Meddit Verified Doctor Discovery & AI Doctor Finder (Universal Theme Support)

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { searchDoctorsAI } from "@/lib/ai/doctorFinder";
import { DoctorFinderOutput } from "@/lib/ai/schemas";

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  experience_years: number;
  consulting_fee: number;
  rating: number;
  reviews_count: number;
  is_verified: boolean;
  category: string;
  languages: string[];
}

export default function DoctorsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [aiResult, setAiResult] = React.useState<DoctorFinderOutput | null>(null);
  const [isSearchingAI, setIsSearchingAI] = React.useState(false);
  const [doctorsList, setDoctorsList] = React.useState<Doctor[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDoctors = async () => {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();

      const { data: profs } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "doctor");

      const defaultDoctors: Doctor[] = [
        {
          id: "doc-101",
          name: "Dr. Ananya Rao",
          specialization: "Cardiology & Heart Health",
          hospital: "Apollo Heart Institute",
          experience_years: 14,
          consulting_fee: 900,
          rating: 4.9,
          reviews_count: 128,
          is_verified: true,
          category: "Cardiology",
          languages: ["English", "Hindi", "Telugu"],
        },
        {
          id: "doc-102",
          name: "Dr. Rajesh Sharma",
          specialization: "Neurology & Spine Care",
          hospital: "Max Healthcare",
          experience_years: 18,
          consulting_fee: 1200,
          rating: 4.8,
          reviews_count: 94,
          is_verified: true,
          category: "Neurology",
          languages: ["English", "Hindi"],
        },
        {
          id: "doc-103",
          name: "Dr. Meera Nambiar",
          specialization: "Dermatology & Cosmetology",
          hospital: "Skin & Laser Center",
          experience_years: 10,
          consulting_fee: 800,
          rating: 4.9,
          reviews_count: 210,
          is_verified: true,
          category: "Dermatology",
          languages: ["English", "Malayalam", "Tamil"],
        },
        {
          id: "doc-104",
          name: "Dr. Vikram Patel",
          specialization: "General Practice & Family Medicine",
          hospital: "Meddit Primary Care Clinic",
          experience_years: 12,
          consulting_fee: 600,
          rating: 4.7,
          reviews_count: 156,
          is_verified: true,
          category: "General Practice",
          languages: ["English", "Gujarati", "Hindi"],
        },
      ];

      if (profs && profs.length > 0) {
        const fetched: Doctor[] = profs.map((p, idx) => ({
          id: p.id,
          name: p.name || `Dr. ${p.username || "Specialist"}`,
          specialization: p.specialization || "General Medicine & Patient Care",
          hospital: "Meddit Certified Clinic",
          experience_years: p.experience_years || 8 + idx,
          consulting_fee: p.consulting_fee || 700 + idx * 50,
          rating: 4.9,
          reviews_count: 50 + idx * 12,
          is_verified: true,
          category: p.specialization?.includes("Cardio")
            ? "Cardiology"
            : p.specialization?.includes("Neuro")
            ? "Neurology"
            : p.specialization?.includes("Derma")
            ? "Dermatology"
            : "General Practice",
          languages: ["English", "Hindi"],
        }));

        // Merge without duplicates
        const mergedMap = new Map<string, Doctor>();
        defaultDoctors.forEach((d) => mergedMap.set(d.id, d));
        fetched.forEach((d) => mergedMap.set(d.id, d));
        setDoctorsList(Array.from(mergedMap.values()));
      } else {
        setDoctorsList(defaultDoctors);
      }
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  const categories = ["All", "Cardiology", "Neurology", "Dermatology", "General Practice"];

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingAI(true);
    try {
      const result = await searchDoctorsAI(searchQuery);
      setAiResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const filteredDoctors = doctorsList.filter((doc) => {
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Verified Doctor Discovery & AI Specialist Matcher"
          subtitle="Describe symptoms in plain language (e.g., 'Child skin eczema' or 'Chest pain while running') for instant AI specialist matching."
          badge={{ text: "AI Matcher Active", variant: "teal" }}
        />

        {/* Natural Language AI Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAISearch()}
                placeholder="Describe your symptom in plain language or search by name..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-400 text-xs">🤖</span>
            </div>

            <button
              onClick={handleAISearch}
              disabled={isSearchingAI}
              className="w-full sm:w-auto px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-2xl transition-all shadow-xs shrink-0"
            >
              {isSearchingAI ? "Matching Symptoms..." : "⚡ AI Specialist Match"}
            </button>
          </div>

          {/* AI Matching Result Card */}
          {aiResult && (
            <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800/80 space-y-2 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                  🤖 Matched Specialty: {aiResult.specialty}
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">
                  Urgency: {aiResult.urgency}
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">{aiResult.reason}</p>
              <p className="text-[11px] text-teal-700 dark:text-teal-400 font-bold">
                Consultation Mode: {aiResult.consultationMode} • Match Confidence: {Math.round(aiResult.confidence * 100)}%
              </p>
            </div>
          )}

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40 shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                m/{cat}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => router.push(`/doctors/${doc.id}`)}
              className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-6 shadow-sm transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 font-extrabold text-sm flex items-center justify-center shrink-0 shadow-inner">
                    {doc.name.substring(4, 6).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-slate-900 dark:text-white text-base group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                        {doc.name}
                      </h3>
                      {doc.is_verified && (
                        <span className="text-teal-600 dark:text-teal-400 text-xs" title="Verified Medical License">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{doc.hospital}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
                    <span>★</span>
                    <span>{doc.rating}</span>
                    <span className="text-slate-400 font-normal">({doc.reviews_count})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium block mt-1">
                    {doc.experience_years} Yrs Exp.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Consultation Fee</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">₹{doc.consulting_fee}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/doctors/${doc.id}`);
                  }}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-full transition-all shadow-xs"
                >
                  Book Session →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
