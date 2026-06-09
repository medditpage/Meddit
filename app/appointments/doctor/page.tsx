"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-teal-700",
    bg: "bg-teal-50 border-teal-200",
  },
  completed: {
    label: "Completed",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
  },
  no_show: {
    label: "No Show",
    color: "text-slate-700",
    bg: "bg-slate-50 border-slate-200",
  },
};

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<
    "pending" | "confirmed" | "completed" | "all"
  >("pending");
  const [selectedApt, setSelectedApt] = React.useState<any>(null);
  const [notes, setNotes] = React.useState("");
  const [prescription, setPrescription] = React.useState("");
  const [savingNotes, setSavingNotes] = React.useState(false);
  const [authUserId, setAuthUserId] = React.useState<string | null>(null);

  const fetchAppointments = async () => {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return;
    setAuthUserId(authUser.id);

    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        patient:profiles!appointments_patient_id_fkey(
          name, phone, avatar_initials, blood_group,
          allergies, current_medications, medical_conditions,
          see_doctor_mode, date_of_birth, emergency_contact_name,
          emergency_contact_phone
        )
      `,
      )
      .eq("doctor_id", authUser.id)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (error) console.error("Fetch error:", error);
    if (data) setAppointments(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (
    aptId: string,
    status: string,
    extra?: any,
  ) => {
    const supabase = createClient();
    const updateData: any = { status, ...extra };
    if (status === "confirmed")
      updateData.confirmed_at = new Date().toISOString();
    if (status === "completed")
      updateData.completed_at = new Date().toISOString();
    if (status === "rejected") {
      updateData.cancelled_by = "doctor";
      updateData.cancelled_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", aptId);
    if (!error) fetchAppointments();
  };

  const handleSaveNotes = async () => {
    if (!selectedApt) return;
    setSavingNotes(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("appointments")
      .update({
        notes_by_doctor: notes,
        prescription_notes: prescription,
      })
      .eq("id", selectedApt.id);

    if (!error) {
      fetchAppointments();
      setSelectedApt(null);
      setNotes("");
      setPrescription("");
    }
    setSavingNotes(false);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const tabs = [
    { key: "pending", label: "Pending", color: "text-amber-600" },
    { key: "confirmed", label: "Confirmed", color: "text-teal-600" },
    { key: "completed", label: "Completed", color: "text-blue-600" },
    { key: "all", label: "All", color: "text-slate-600" },
  ] as const;

  const displayed =
    activeTab === "all"
      ? appointments
      : appointments.filter((a) => a.status === activeTab);

  const counts = {
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    all: appointments.length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Appointment Management
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage your patient consultations
            </p>
          </div>
          <button
            onClick={() => router.push("/appointments")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-sm transition-colors"
          >
            Patient View
          </button>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: appointments.length,
                color: "bg-slate-50 border-slate-200",
              },
              {
                label: "Pending",
                value: counts.pending,
                color: "bg-amber-50 border-amber-200",
              },
              {
                label: "Confirmed",
                value: counts.confirmed,
                color: "bg-teal-50 border-teal-200",
              },
              {
                label: "Completed",
                value: counts.completed,
                color: "bg-blue-50 border-blue-200",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`p-4 rounded-2xl border text-center ${stat.color}`}
              >
                <p className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap px-3 ${
                activeTab === tab.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label} ({counts[tab.key]})
            </button>
          ))}
        </div>

        {/* Appointments */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-slate-700 font-semibold">
              No {activeTab} appointments
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((apt) => {
              const status = statusConfig[apt.status] || statusConfig.pending;
              const patient = apt.patient;

              return (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  <div className="p-5">
                    {/* Patient Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-xl border border-teal-100 shrink-0">
                          {(patient?.name || "?").charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900">
                              {patient?.name || "Unknown"}
                            </p>
                            {patient?.see_doctor_mode && (
                              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">
                                🏥 See Doctor Mode
                              </span>
                            )}
                          </div>
                          {patient?.phone && (
                            <p className="text-slate-400 text-xs">
                              📞 {patient.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border shrink-0 ${status.bg} ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Appointment Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-400">Date</p>
                        <p className="text-sm font-semibold text-slate-900 mt-0.5">
                          {formatDate(apt.appointment_date)}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-400">Time</p>
                        <p className="text-sm font-semibold text-slate-900 mt-0.5">
                          {formatTime(apt.appointment_time)}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-400">Type</p>
                        <p className="text-sm font-semibold text-slate-900 mt-0.5">
                          {apt.consultation_type === "online"
                            ? "💻 Online"
                            : "🏥 In Person"}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-400">Rating</p>
                        <p className="text-sm font-semibold text-amber-500 mt-0.5">
                          {apt.patient_rating
                            ? `${"★".repeat(apt.patient_rating)} (${apt.patient_rating}/5)`
                            : "Not rated"}
                        </p>
                      </div>
                    </div>

                    {/* Reason + Symptoms */}
                    {apt.reason && (
                      <div className="mb-3 p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-400">
                          Reason for Visit
                        </p>
                        <p className="text-sm text-slate-700 mt-0.5">
                          {apt.reason}
                        </p>
                      </div>
                    )}
                    {apt.symptoms && (
                      <div className="mb-3 p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-400">Symptoms</p>
                        <p className="text-sm text-slate-700 mt-0.5">
                          {apt.symptoms}
                        </p>
                      </div>
                    )}

                    {/* Patient Medical Info — only if see_doctor_mode */}
                    {patient?.see_doctor_mode && (
                      <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-xs font-bold text-blue-700 mb-3">
                          🏥 Patient Medical Data (See Doctor Mode Active)
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {patient.blood_group && (
                            <div>
                              <p className="text-xs text-blue-400">
                                Blood Group
                              </p>
                              <p className="font-semibold text-blue-900">
                                {patient.blood_group}
                              </p>
                            </div>
                          )}
                          {patient.date_of_birth && (
                            <div>
                              <p className="text-xs text-blue-400">
                                Date of Birth
                              </p>
                              <p className="font-semibold text-blue-900">
                                {patient.date_of_birth}
                              </p>
                            </div>
                          )}
                          {patient.allergies && (
                            <div className="col-span-2">
                              <p className="text-xs text-blue-400">Allergies</p>
                              <p className="font-semibold text-blue-900">
                                {patient.allergies}
                              </p>
                            </div>
                          )}
                          {patient.current_medications && (
                            <div className="col-span-2">
                              <p className="text-xs text-blue-400">
                                Current Medications
                              </p>
                              <p className="font-semibold text-blue-900">
                                {patient.current_medications}
                              </p>
                            </div>
                          )}
                          {patient.medical_conditions && (
                            <div className="col-span-2">
                              <p className="text-xs text-blue-400">
                                Medical Conditions
                              </p>
                              <p className="font-semibold text-blue-900">
                                {patient.medical_conditions}
                              </p>
                            </div>
                          )}
                          {patient.emergency_contact_name && (
                            <div className="col-span-2">
                              <p className="text-xs text-blue-400">
                                Emergency Contact
                              </p>
                              <p className="font-semibold text-blue-900">
                                {patient.emergency_contact_name} —{" "}
                                {patient.emergency_contact_phone}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Existing Notes */}
                    {apt.notes_by_doctor && (
                      <div className="mb-3 p-3 bg-teal-50 border border-teal-100 rounded-xl">
                        <p className="text-xs text-teal-600 font-semibold">
                          Your Notes
                        </p>
                        <p className="text-sm text-teal-800 mt-0.5">
                          {apt.notes_by_doctor}
                        </p>
                      </div>
                    )}
                    {apt.prescription_notes && (
                      <div className="mb-3 p-3 bg-purple-50 border border-purple-100 rounded-xl">
                        <p className="text-xs text-purple-600 font-semibold">
                          Prescription
                        </p>
                        <p className="text-sm text-purple-800 mt-0.5">
                          {apt.prescription_notes}
                        </p>
                      </div>
                    )}

                    {/* Patient Feedback */}
                    {apt.patient_feedback && (
                      <div className="mb-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                        <p className="text-xs text-amber-600 font-semibold">
                          Patient Feedback
                        </p>
                        <p className="text-sm text-amber-800 mt-0.5 italic">
                          "{apt.patient_feedback}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-5 pb-5 flex flex-wrap gap-2">
                    {apt.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(apt.id, "confirmed")
                          }
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors"
                        >
                          ✅ Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(apt.id, "rejected")}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-colors"
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}

                    {apt.status === "confirmed" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(apt.id, "completed")
                          }
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
                        >
                          ✓ Mark Complete
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(apt.id, "no_show")}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
                        >
                          No Show
                        </button>
                      </>
                    )}

                    {["confirmed", "completed"].includes(apt.status) && (
                      <button
                        onClick={() => {
                          setSelectedApt(apt);
                          setNotes(apt.notes_by_doctor || "");
                          setPrescription(apt.prescription_notes || "");
                        }}
                        className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 rounded-xl text-xs font-semibold transition-colors"
                      >
                        📝 {apt.notes_by_doctor ? "Edit Notes" : "Add Notes"}
                      </button>
                    )}

                    {["pending", "confirmed"].includes(apt.status) && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(apt.id, "cancelled", {
                            cancelled_by: "doctor",
                            cancelled_at: new Date().toISOString(),
                          })
                        }
                        className="px-4 py-2 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Notes for {selectedApt.patient?.name}
              </h2>
              <button
                onClick={() => setSelectedApt(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Doctor's Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Clinical observations, diagnosis details..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Prescription
                </label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="Medicines, dosage, instructions..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedApt(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold text-sm transition-colors"
              >
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
