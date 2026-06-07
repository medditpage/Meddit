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

  React.useEffect(() => {
    const fetchDoctors = async () => {
      const supabase = createClient();
      try {
        // Fetching from your 'doctors' table
        const { data, error } = await supabase
          .from("doctors")
          .select("id, name, specialty, experience, rating");

        if (error) {
          console.error("Error fetching doctors:", error);
        } else if (data) {
          setDoctors(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Medical Professionals
          </h1>
          <p className="text-slate-500 mt-2">
            Browse and connect with verified specialists.
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">No doctors found in the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => router.push(`/doctors/${doc.id}`)}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all text-left group"
              >
                <div className="w-16 h-16 bg-teal-50 rounded-full mb-4 flex items-center justify-center text-teal-700 font-bold text-xl group-hover:bg-teal-100 transition-colors">
                  {doc.name?.charAt(0) || "D"}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{doc.name}</h3>
                <p className="text-teal-600 font-medium text-sm">
                  {doc.specialty}
                </p>
                <div className="mt-4 flex justify-between text-slate-500 text-sm">
                  <span>{doc.experience || 0} years exp.</span>
                  <span className="font-bold text-slate-900">
                    ★ {doc.rating || "N/A"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
