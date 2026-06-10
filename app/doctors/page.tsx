"use client";
// app/doctors/page.tsx
import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filterSpec, setFilterSpec] = React.useState("All");

  const specializations = [
    "All",
    "Cardiologist",
    "Neurologist",
    "Pediatrician",
    "Orthopedic",
    "Dermatologist",
    "General Physician",
    "Psychiatrist",
    "Oncologist",
  ];

  React.useEffect(() => {
    const fetchDoctors = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "doctor")
        .eq("is_public", true);

      if (error) console.error("Error:", error);
      if (data) setDoctors(data);
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter((d) => {
    const matchSearch =
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      d.hospital?.toLowerCase().includes(search.toLowerCase());
    const matchSpec = filterSpec === "All" || d.specialization === filterSpec;
    return matchSearch && matchSpec;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-1 sm:px-4">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Find a Doctor
          </h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">
            Browse verified medical professionals and book consultations.
          </p>
        </div>

        {/* Search Field Wrapper Layout */}
        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="Search by name, specialization, hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white shadow-sm"
          />
        </div>

        {/* Specialization Horizontal Drag Track (Fixes Multi-Row Stack Bloat) */}
        <div className="w-full overflow-x-auto no-scrollbar flex gap-2 pb-3 mb-4 scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setFilterSpec(spec)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                filterSpec === spec
                  ? "bg-teal-600 text-white shadow-sm shadow-teal-600/10"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-teal-400"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Results Count Descriptor */}
        {!loading && (
          <p className="text-xs sm:text-sm text-slate-500 mb-4 font-medium">
            {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Doctor Grid Layout Blocks */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200">
            <p className="text-4xl mb-3">👨‍⚕️</p>
            <p className="text-slate-700 font-semibold text-sm sm:text-base">
              No doctors found
            </p>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Try a different search or specialization
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all overflow-hidden group flex flex-col justify-between"
              >
                <div className="p-4 sm:p-6">
                  {/* Identity Header Flex Grid mapping wrapper */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-xl sm:text-2xl border border-teal-100 shrink-0 group-hover:bg-teal-100 transition-colors">
                      {doc.name?.charAt(0) || "D"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center gap-1 sm:gap-2">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                          {doc.name}
                        </h3>
                        {doc.is_verified && (
                          <span className="self-start text-[10px] bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.5 rounded-full font-bold shrink-0">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <p className="text-teal-600 font-medium text-xs sm:text-sm mt-0.5 truncate">
                        {doc.specialization || "General Physician"}
                      </p>
                      {doc.hospital && (
                        <p className="text-slate-400 text-[11px] sm:text-xs mt-0.5 truncate">
                          🏥 {doc.hospital}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Context Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-medium">
                        Exp.
                      </p>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5">
                        {doc.experience_years || 0}yr
                      </p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-medium">
                        Rating
                      </p>
                      <p className="font-bold text-amber-500 text-xs sm:text-sm mt-0.5">
                        ⭐ {doc.reliability_rating || "N/A"}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-medium">
                        Fee
                      </p>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5 truncate">
                        {doc.consulting_fee ? `₹${doc.consulting_fee}` : "Free"}
                      </p>
                    </div>
                  </div>

                  {/* Localization parameters */}
                  <div className="space-y-1">
                    {doc.languages && (
                      <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                        🗣{" "}
                        <span className="text-slate-600 font-medium">
                          {doc.languages}
                        </span>
                      </p>
                    )}
                    {doc.availability && (
                      <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                        🕐{" "}
                        <span className="text-slate-600 font-medium">
                          {doc.availability}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Response Action Rows Footer layout */}
                <div className="px-4 pb-4 sm:px-6 sm:pb-5 flex gap-2 mt-auto">
                  <button
                    onClick={() => router.push(`/doctors/${doc.id}`)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={async () => {
                      const supabase = createClient();
                      const {
                        data: { user },
                      } = await supabase.auth.getUser();
                      if (!user) return router.push("/login");

                      const p1 = user.id < doc.id ? user.id : doc.id;
                      const p2 = user.id < doc.id ? doc.id : user.id;

                      const { data: existing } = await supabase
                        .from("conversations")
                        .select("id")
                        .eq("participant_1", p1)
                        .eq("participant_2", p2)
                        .single();

                      if (!existing) {
                        await supabase.from("conversations").insert({
                          participant_1: p1,
                          participant_2: p2,
                          last_message: "",
                          last_message_at: new Date().toISOString(),
                        });
                      }
                      router.push("/messages");
                    }}
                    className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm"
                  >
                    💬 Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
