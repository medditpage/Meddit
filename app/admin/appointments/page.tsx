"use client";
import * as React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { createClient } from "@/utils/supabase/client";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [expandedDoctor, setExpandedDoctor] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    const fetchAll = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("appointments")
        .select(
          "*, patient:profiles!appointments_patient_id_fkey(name, phone), doctor:profiles!appointments_doctor_id_fkey(name, specialization)",
        )
        .order("appointment_date", { ascending: false });
      if (data) setAppointments(data);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const statusConfig: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-teal-50 text-teal-700 border-teal-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    no_show: "bg-slate-50 text-slate-700 border-slate-200",
  };

  const filtered = appointments.filter((a) => {
    const matchSearch =
      !search ||
      a.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Group by doctor
  const grouped = filtered.reduce((acc: Record<string, any>, apt) => {
    const doctorId = apt.doctor_id;
    const doctorName = apt.doctor?.name || "Unknown";
    const doctorSpec = apt.doctor?.specialization || "";
    if (!acc[doctorId]) {
      acc[doctorId] = { doctorId, doctorName, doctorSpec, appointments: [] };
    }
    acc[doctorId].appointments.push(apt);
    return acc;
  }, {});

  const groupedList = Object.values(grouped);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return `${h > 12 ? h - 12 : h || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };

  const statCounts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            All Appointments
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Grouped by doctor • {appointments.length} total
          </p>
        </div>

        {/* Status pills */}
        <div className="flex gap-2 flex-wrap">
          {(
            ["all", "pending", "confirmed", "completed", "cancelled"] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
                statusFilter === s
                  ? "bg-red-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-red-400"
              }`}
            >
              {s} ({statCounts[s] ?? 0})
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by patient or doctor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
        />

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : groupedList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-3xl mb-2">📅</p>
            <p className="font-semibold text-slate-700">
              No appointments found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedList.map((group: any) => (
              <div
                key={group.doctorId}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                {/* Doctor Header — clickable */}
                <button
                  onClick={() =>
                    setExpandedDoctor(
                      expandedDoctor === group.doctorId ? null : group.doctorId,
                    )
                  }
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl shrink-0">
                      {group.doctorName?.charAt(0) || "D"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        Dr. {group.doctorName}
                      </p>
                      <p className="text-sm text-teal-600">
                        {group.doctorSpec || "General Physician"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-2xl font-bold text-slate-900">
                        {group.appointments.length}
                      </p>
                      <p className="text-xs text-slate-400">appointments</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform ${expandedDoctor === group.doctorId ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Appointments List — expandable */}
                {expandedDoctor === group.doctorId && (
                  <div className="border-t border-slate-100">
                    {/* Desktop */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            {[
                              "Patient",
                              "Date & Time",
                              "Type",
                              "Fee",
                              "Status",
                            ].map((h) => (
                              <th
                                key={h}
                                className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {group.appointments.map((apt: any) => (
                            <tr
                              key={apt.id}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <td className="px-5 py-4">
                                <p className="font-semibold text-slate-900">
                                  {apt.patient?.name || "Unknown"}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {apt.patient?.phone || ""}
                                </p>
                              </td>
                              <td className="px-5 py-4">
                                <p className="font-semibold text-slate-900">
                                  {formatDate(apt.appointment_date)}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {formatTime(apt.appointment_time)}
                                </p>
                              </td>
                              <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                                {apt.consultation_type === "online"
                                  ? "💻 Online"
                                  : "🏥 In Person"}
                              </td>
                              <td className="px-5 py-4 font-semibold text-slate-900">
                                {apt.fee_amount ? `₹${apt.fee_amount}` : "Free"}
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusConfig[apt.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}
                                >
                                  {apt.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile */}
                    <div className="sm:hidden divide-y divide-slate-100">
                      {group.appointments.map((apt: any) => (
                        <div key={apt.id} className="p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">
                                {apt.patient?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-slate-400">
                                {apt.patient?.phone}
                              </p>
                            </div>
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full border shrink-0 ${statusConfig[apt.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="p-2 bg-slate-50 rounded-lg">
                              <p className="text-slate-400">Date</p>
                              <p className="font-semibold text-slate-800">
                                {formatDate(apt.appointment_date)}
                              </p>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg">
                              <p className="text-slate-400">Time</p>
                              <p className="font-semibold text-slate-800">
                                {formatTime(apt.appointment_time)}
                              </p>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg">
                              <p className="text-slate-400">Fee</p>
                              <p className="font-semibold text-slate-800">
                                {apt.fee_amount ? `₹${apt.fee_amount}` : "Free"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
