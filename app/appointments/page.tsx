"use client";
// appointments/page
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

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"upcoming" | "past">(
    "upcoming",
  );
  const [currentProfile, setCurrentProfile] = React.useState<any>(null);
  const [cancelling, setCancelling] = React.useState<string | null>(null);
  const [rating, setRating] = React.useState<Record<string, number>>({});
  const [feedback, setFeedback] = React.useState<Record<string, string>>({});
  const [submittingRating, setSubmittingRating] = React.useState<string | null>(
    null,
  );

  const fetchAppointments = async () => {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();
    setCurrentProfile(profile);

    const isDoctor = profile?.role === "doctor";

    // Fetch appointments with related profiles
    const query = supabase
      .from("appointments")
      .select(
        `
        *,
        patient:profiles!appointments_patient_id_fkey(name, phone, avatar_initials),
        doctor:profiles!appointments_doctor_id_fkey(name, specialization, avatar_initials, consulting_fee)
      `,
      )
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (isDoctor) {
      query.eq("doctor_id", authUser.id);
    } else {
      query.eq("patient_id", authUser.id);
    }

    const { data, error } = await query;
    if (error) console.error("Fetch error:", error);
    if (data) setAppointments(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setCancelling(appointmentId);
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("appointments")
      .update({
        status: "cancelled",
        cancelled_by: currentProfile?.role === "doctor" ? "doctor" : "patient",
        cancelled_at: new Date().toISOString(),
        cancellation_reason: "Cancelled by user",
      })
      .eq("id", appointmentId);

    if (!error) fetchAppointments();
    setCancelling(null);
  };

  const handleRating = async (appointmentId: string) => {
    if (!rating[appointmentId]) return;
    setSubmittingRating(appointmentId);
    const supabase = createClient();

    const { error } = await supabase
      .from("appointments")
      .update({
        patient_rating: rating[appointmentId],
        patient_feedback: feedback[appointmentId] || "",
      })
      .eq("id", appointmentId);

    if (!error) fetchAppointments();
    setSubmittingRating(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const isUpcoming = (apt: any) =>
    ["pending", "confirmed"].includes(apt.status) &&
    new Date(`${apt.appointment_date}T${apt.appointment_time}`) >= new Date();

  const upcomingApts = appointments.filter(isUpcoming);
  const pastApts = appointments.filter((a) => !isUpcoming(a));
  const displayed = activeTab === "upcoming" ? upcomingApts : pastApts;

  const isDoctor = currentProfile?.role === "doctor";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isDoctor ? "My Appointments" : "My Appointments"}
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              {isDoctor
                ? "Manage your patient appointments"
                : "Track and manage your consultations"}
            </p>
          </div>
          {!isDoctor && (
            <button
              onClick={() => router.push("/doctors")}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              + Book New
            </button>
          )}
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: appointments.length,
                color: "bg-slate-50 border-slate-200",
              },
              {
                label: "Upcoming",
                value: upcomingApts.length,
                color: "bg-teal-50 border-teal-200",
              },
              {
                label: "Completed",
                value: appointments.filter((a) => a.status === "completed")
                  .length,
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
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6">
          {(["upcoming", "past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "upcoming"
                ? `Upcoming (${upcomingApts.length})`
                : `Past (${pastApts.length})`}
            </button>
          ))}
        </div>

        {/* Appointments List */}
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
            <p className="text-4xl mb-3">
              {activeTab === "upcoming" ? "📅" : "📋"}
            </p>
            <p className="text-slate-700 font-semibold">
              No {activeTab} appointments
            </p>
            {activeTab === "upcoming" && !isDoctor && (
              <button
                onClick={() => router.push("/doctors")}
                className="mt-3 text-teal-600 font-semibold hover:underline text-sm"
              >
                Browse doctors to book →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((apt) => {
              const status = statusConfig[apt.status] || statusConfig.pending;
              const otherPerson = isDoctor ? apt.patient : apt.doctor;

              return (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-xl border border-teal-100 shrink-0">
                          {(otherPerson?.name || "?").charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {isDoctor
                              ? otherPerson?.name
                              : `Dr. ${otherPerson?.name || "Unknown"}`}
                          </p>
                          {!isDoctor && (
                            <p className="text-teal-600 text-sm font-medium">
                              {apt.doctor?.specialization ||
                                "General Physician"}
                            </p>
                          )}
                          {isDoctor && apt.patient?.phone && (
                            <p className="text-slate-400 text-xs">
                              📞 {apt.patient.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border shrink-0 ${status.bg} ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Appointment Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
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
                        <p className="text-xs text-slate-400">Fee</p>
                        <p className="text-sm font-semibold text-slate-900 mt-0.5">
                          {apt.fee_amount ? `₹${apt.fee_amount}` : "Free"}
                        </p>
                      </div>
                    </div>

                    {/* Reason */}
                    {apt.reason && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-400">Reason</p>
                        <p className="text-sm text-slate-700 mt-0.5">
                          {apt.reason}
                        </p>
                      </div>
                    )}

                    {/* Symptoms */}
                    {apt.symptoms && (
                      <div className="mt-2 p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-400">Symptoms</p>
                        <p className="text-sm text-slate-700 mt-0.5">
                          {apt.symptoms}
                        </p>
                      </div>
                    )}

                    {/* Doctor Notes */}
                    {apt.notes_by_doctor && (
                      <div className="mt-2 p-3 bg-teal-50 border border-teal-100 rounded-xl">
                        <p className="text-xs text-teal-600 font-semibold">
                          Doctor's Notes
                        </p>
                        <p className="text-sm text-teal-800 mt-0.5">
                          {apt.notes_by_doctor}
                        </p>
                      </div>
                    )}

                    {/* Prescription */}
                    {apt.prescription_notes && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <p className="text-xs text-blue-600 font-semibold">
                          Prescription
                        </p>
                        <p className="text-sm text-blue-800 mt-0.5">
                          {apt.prescription_notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="px-5 pb-5 flex flex-wrap gap-2">
                    {/* DOCTOR ACTIONS */}
                    {isDoctor && apt.status === "pending" && (
                      <>
                        <button
                          onClick={async () => {
                            const supabase = createClient();
                            await supabase
                              .from("appointments")
                              .update({
                                status: "confirmed",
                                confirmed_at: new Date().toISOString(),
                              })
                              .eq("id", apt.id);
                            fetchAppointments();
                          }}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors"
                        >
                          ✅ Confirm
                        </button>
                        <button
                          onClick={async () => {
                            const supabase = createClient();
                            await supabase
                              .from("appointments")
                              .update({
                                status: "rejected",
                                cancelled_by: "doctor",
                                cancelled_at: new Date().toISOString(),
                              })
                              .eq("id", apt.id);
                            fetchAppointments();
                          }}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-colors"
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}

                    {isDoctor && apt.status === "confirmed" && (
                      <button
                        onClick={async () => {
                          const supabase = createClient();
                          await supabase
                            .from("appointments")
                            .update({
                              status: "completed",
                              completed_at: new Date().toISOString(),
                            })
                            .eq("id", apt.id);
                          fetchAppointments();
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
                      >
                        ✓ Mark Complete
                      </button>
                    )}

                    {/* Cancel button — both can cancel if pending/confirmed */}
                    {["pending", "confirmed"].includes(apt.status) && (
                      <button
                        onClick={() => handleCancel(apt.id)}
                        disabled={cancelling === apt.id}
                        className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl text-xs font-semibold transition-colors"
                      >
                        {cancelling === apt.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}

                    {/* PATIENT RATING — after completion */}
                    {!isDoctor &&
                      apt.status === "completed" &&
                      !apt.patient_rating && (
                        <div className="w-full mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                          <p className="text-sm font-semibold text-amber-800 mb-3">
                            ⭐ Rate your consultation
                          </p>
                          <div className="flex gap-2 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() =>
                                  setRating({ ...rating, [apt.id]: star })
                                }
                                className={`text-2xl transition-transform hover:scale-110 ${
                                  (rating[apt.id] || 0) >= star
                                    ? "text-amber-400"
                                    : "text-slate-300"
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                          <textarea
                            value={feedback[apt.id] || ""}
                            onChange={(e) =>
                              setFeedback({
                                ...feedback,
                                [apt.id]: e.target.value,
                              })
                            }
                            placeholder="Share your experience..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none bg-white mb-3"
                          />
                          <button
                            onClick={() => handleRating(apt.id)}
                            disabled={
                              !rating[apt.id] || submittingRating === apt.id
                            }
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-xl text-xs font-semibold transition-colors"
                          >
                            {submittingRating === apt.id
                              ? "Submitting..."
                              : "Submit Rating"}
                          </button>
                        </div>
                      )}

                    {/* Show rating if already rated */}
                    {!isDoctor && apt.patient_rating && (
                      <div className="w-full p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-400">Your Rating</p>
                        <p className="text-amber-400 text-lg">
                          {"★".repeat(apt.patient_rating)}
                          {"☆".repeat(5 - apt.patient_rating)}
                        </p>
                        {apt.patient_feedback && (
                          <p className="text-xs text-slate-500 mt-1 italic">
                            "{apt.patient_feedback}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
