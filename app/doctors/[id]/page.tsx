"use client";
// this  app/doctors/[id]/page.tsx
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";

export default function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;

    const fetchDoctor = async () => {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("doctors")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching doctor:", error);
        } else {
          setDoctor(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          <div className="h-24 w-24 bg-slate-100 rounded-full animate-pulse" />
          <div className="h-8 w-64 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  if (!doctor) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Doctor not found
          </h2>
          <button
            onClick={() => router.back()}
            className="mt-4 text-teal-600 font-medium hover:underline"
          >
            Go back to directory
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm text-slate-500 hover:text-teal-600 transition-colors"
        >
          ← Back to directory
        </button>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center text-teal-700 font-bold text-3xl border border-teal-100">
              {doctor.name?.charAt(0) || "D"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {doctor.name}
              </h1>
              <p className="text-teal-600 font-medium text-lg">
                {doctor.specialty}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Professional Summary
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {doctor.bio || "No biography available for this professional."}
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">
                  Experience
                </p>
                <p className="font-bold text-slate-900 mt-1">
                  {doctor.experience || 0} years
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">
                  Rating
                </p>
                <p className="font-bold text-amber-600 mt-1">
                  ★ {doctor.rating || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
