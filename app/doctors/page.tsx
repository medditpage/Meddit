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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Find a Doctor</h1>
          <p className="text-slate-500 mt-1">
            Browse verified medical professionals and book consultations.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name, specialization, hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
        </div>

        {/* Specialization Pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setFilterSpec(spec)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filterSpec === spec
                  ? "bg-teal-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-teal-400"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-slate-500 mb-4">
            {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Doctor Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-4xl mb-3">👨‍⚕️</p>
            <p className="text-slate-700 font-semibold">No doctors found</p>
            <p className="text-slate-400 text-sm mt-1">
              Try a different search or specialization
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all overflow-hidden group"
              >
                {/* Card Top */}
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-2xl border border-teal-100 shrink-0 group-hover:bg-teal-100 transition-colors">
                      {doc.name?.charAt(0) || "D"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 truncate">
                          {doc.name}
                        </h3>
                        {doc.is_verified && (
                          <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full font-semibold shrink-0">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <p className="text-teal-600 font-medium text-sm mt-0.5">
                        {doc.specialization || "General Physician"}
                      </p>
                      {doc.hospital && (
                        <p className="text-slate-400 text-xs mt-0.5 truncate">
                          🏥 {doc.hospital}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-400">Exp.</p>
                      <p className="font-bold text-slate-900 text-sm">
                        {doc.experience_years || 0}yr
                      </p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-400">Rating</p>
                      <p className="font-bold text-amber-500 text-sm">
                        ⭐ {doc.reliability_rating || "N/A"}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-400">Fee</p>
                      <p className="font-bold text-slate-900 text-sm">
                        {doc.consulting_fee ? `₹${doc.consulting_fee}` : "Free"}
                      </p>
                    </div>
                  </div>

                  {/* Languages + Availability */}
                  {doc.languages && (
                    <p className="text-xs text-slate-400 mb-1">
                      🗣 {doc.languages}
                    </p>
                  )}
                  {doc.availability && (
                    <p className="text-xs text-slate-400">
                      🕐 {doc.availability}
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                {/* Card Actions */}
                <div className="px-6 pb-5 flex gap-2">
                  <button
                    onClick={() => router.push(`/doctors/${doc.id}`)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
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
                    className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors"
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
