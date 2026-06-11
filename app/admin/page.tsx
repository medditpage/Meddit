"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = React.useState({
    totalDoctors: 0,
    totalPatients: 0,
    pendingVerifications: 0,
    totalAppointments: 0,
    totalPosts: 0,
    totalReports: 0,
    suspendedUsers: 0,
    todayAppointments: 0,
  });
  const [recentDoctors, setRecentDoctors] = React.useState<any[]>([]);
  const [recentAppointments, setRecentAppointments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAll = async () => {
      const supabase = createClient();
      const today = new Date().toISOString().split("T")[0];

      const [
        { count: doctorCount },
        { count: patientCount },
        { count: pendingCount },
        { count: appointmentCount },
        { count: postCount },
        { count: reportCount },
        { count: suspendedCount },
        { count: todayCount },
        { data: doctors },
        { data: appointments },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "doctor"),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "patient"),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "doctor")
          .eq("verification_status", "pending"),
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("community_posts")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("post_reports")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("account_status", "suspended"),
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("appointment_date", today),
        supabase
          .from("profiles")
          .select(
            "id,name,specialization,verification_status,created_at,is_verified",
          )
          .eq("role", "doctor")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("appointments")
          .select(
            "*, patient:profiles!appointments_patient_id_fkey(name), doctor:profiles!appointments_doctor_id_fkey(name)",
          )
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setStats({
        totalDoctors: doctorCount || 0,
        totalPatients: patientCount || 0,
        pendingVerifications: pendingCount || 0,
        totalAppointments: appointmentCount || 0,
        totalPosts: postCount || 0,
        totalReports: reportCount || 0,
        suspendedUsers: suspendedCount || 0,
        todayAppointments: todayCount || 0,
      });

      if (doctors) setRecentDoctors(doctors);
      if (appointments) setRecentAppointments(appointments);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const statCards = [
    {
      label: "Total Doctors",
      value: stats.totalDoctors,
      color: "bg-teal-50 border-teal-200 text-teal-700",
      href: "/admin/users?role=doctor",
    },
    {
      label: "Total Patients",
      value: stats.totalPatients,
      color: "bg-blue-50 border-blue-200 text-blue-700",
      href: "/admin/users?role=patient",
    },
    {
      label: "Pending Verifications",
      value: stats.pendingVerifications,
      color: "bg-amber-50 border-amber-200 text-amber-700",
      href: "/admin/verifications",
      urgent: stats.pendingVerifications > 0,
    },
    {
      label: "Total Appointments",
      value: stats.totalAppointments,
      color: "bg-purple-50 border-purple-200 text-purple-700",
      href: "/admin/appointments",
    },
    {
      label: "Community Posts",
      value: stats.totalPosts,
      color: "bg-slate-50 border-slate-200 text-slate-700",
      href: "/admin/community",
    },
    {
      label: "Flagged Reports",
      value: stats.totalReports,
      color: "bg-red-50 border-red-200 text-red-700",
      href: "/admin/reports",
      urgent: stats.totalReports > 0,
    },
    {
      label: "Suspended Accounts",
      value: stats.suspendedUsers,
      color: "bg-orange-50 border-orange-200 text-orange-700",
      href: "/admin/users",
    },
    {
      label: "Today's Appointments",
      value: stats.todayAppointments,
      color: "bg-green-50 border-green-200 text-green-700",
      href: "/admin/appointments",
    },
  ];

  const verificationColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-teal-50 text-teal-700 border-teal-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const appointmentColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-teal-50 text-teal-700",
    completed: "bg-blue-50 text-blue-700",
    cancelled: "bg-red-50 text-red-700",
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 sm:p-8 text-white">
          <p className="text-red-200 text-sm font-medium mb-1">
            Admin Control Panel
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            Platform Overview
          </h1>
          <p className="text-red-100 text-sm">
            Full system control and monitoring
          </p>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-28 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <button
                key={card.label}
                onClick={() => router.push(card.href)}
                className={`p-4 sm:p-5 rounded-2xl border text-left hover:shadow-md transition-all relative ${card.color}`}
              >
                {card.urgent && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                )}
                <p className="text-3xl font-bold">{card.value}</p>
                <p className="text-xs font-semibold mt-1 opacity-80">
                  {card.label}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Doctors */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 text-lg">
                Recent Doctor Signups
              </h2>
              <button
                onClick={() => router.push("/admin/verifications")}
                className="text-sm text-red-600 font-semibold hover:underline"
              >
                Review all →
              </button>
            </div>
            <div className="space-y-3">
              {recentDoctors.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">
                  No doctors yet
                </p>
              ) : (
                recentDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
                        {doc.name?.charAt(0) || "D"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {doc.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {doc.specialization || "No specialization"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${verificationColors[doc.verification_status || "pending"]}`}
                    >
                      {doc.verification_status || "pending"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 text-lg">
                Recent Appointments
              </h2>
              <button
                onClick={() => router.push("/admin/appointments")}
                className="text-sm text-red-600 font-semibold hover:underline"
              >
                View all →
              </button>
            </div>
            <div className="space-y-3">
              {recentAppointments.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">
                  No appointments yet
                </p>
              ) : (
                recentAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        {apt.patient?.name} → Dr. {apt.doctor?.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {apt.appointment_date} at{" "}
                        {apt.appointment_time?.substring(0, 5)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${appointmentColors[apt.status] || "bg-slate-100 text-slate-600"}`}
                    >
                      {apt.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 text-lg mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Review Verifications",
                href: "/admin/verifications",
                emoji: "✅",
                urgent: stats.pendingVerifications > 0,
              },
              { label: "Manage Users", href: "/admin/users", emoji: "👥" },
              {
                label: "Moderate Posts",
                href: "/admin/community",
                emoji: "📝",
              },
              {
                label: "View Reports",
                href: "/admin/reports",
                emoji: "🚩",
                urgent: stats.totalReports > 0,
              },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.href)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:shadow-md ${
                  action.urgent
                    ? "border-red-300 bg-red-50 hover:border-red-400"
                    : "border-slate-200 hover:border-red-300 hover:bg-red-50"
                }`}
              >
                {action.urgent && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
                <span className="text-2xl">{action.emoji}</span>
                <span className="text-xs font-semibold text-slate-700 text-center">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
