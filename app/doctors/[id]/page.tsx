"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";

export default function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoBook = searchParams.get("book") === "true";

  const [doctor, setDoctor] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [currentProfile, setCurrentProfile] = React.useState<any>(null);
  const [availability, setAvailability] = React.useState<any[]>([]);
  const [showBooking, setShowBooking] = React.useState(autoBook);
  const [saving, setSaving] = React.useState(false);
  const [bookingSuccess, setBookingSuccess] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Booking form
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedTime, setSelectedTime] = React.useState("");
  const [consultationType, setConsultationType] = React.useState("online");
  const [reason, setReason] = React.useState("");
  const [symptoms, setSymptoms] = React.useState("");
  const [availableSlots, setAvailableSlots] = React.useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = React.useState<string[]>([]);

  React.useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        setCurrentUser(authUser);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        setCurrentProfile(profile);
      }

      // Fetch doctor profile
      const { data: doctorData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (doctorData) setDoctor(doctorData);

      // Fetch availability
      const { data: avail } = await supabase
        .from("doctor_availability")
        .select("*")
        .eq("doctor_id", id)
        .eq("is_active", true);
      if (avail) setAvailability(avail);

      setLoading(false);
    };
    init();
  }, [id]);

  // Generate time slots when date selected
  React.useEffect(() => {
    if (!selectedDate || availability.length === 0) return;

    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    const dayAvail = availability.find((a) => a.day_of_week === dayOfWeek);

    if (!dayAvail) {
      setAvailableSlots([]);
      return;
    }

    // Generate slots
    const slots: string[] = [];
    const [startH, startM] = dayAvail.start_time.split(":").map(Number);
    const [endH, endM] = dayAvail.end_time.split(":").map(Number);
    const duration = dayAvail.slot_duration_minutes || 30;

    let current = startH * 60 + startM;
    const end = endH * 60 + endM;

    while (current + duration <= end) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      const timeStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      slots.push(timeStr);
      current += duration;
    }

    setAvailableSlots(slots);
    setSelectedTime("");

    // Fetch already booked slots for this date
    const fetchBooked = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("doctor_id", id)
        .eq("appointment_date", selectedDate)
        .in("status", ["pending", "confirmed"]);
      if (data)
        setBookedSlots(data.map((a) => a.appointment_time.substring(0, 5)));
    };
    fetchBooked();
  }, [selectedDate, availability]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !reason) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }
    if (!currentUser) {
      setMessage({
        type: "error",
        text: "Please login to book an appointment.",
      });
      return;
    }
    if (currentProfile?.role === "doctor") {
      setMessage({
        type: "error",
        text: "Doctors cannot book appointments as patients.",
      });
      return;
    }

    setSaving(true);
    setMessage(null);
    const supabase = createClient();

    const { error } = await supabase.from("appointments").insert({
      patient_id: currentUser.id,
      doctor_id: id,
      appointment_date: selectedDate,
      appointment_time: selectedTime,
      consultation_type: consultationType,
      reason,
      symptoms,
      fee_amount: doctor?.consulting_fee
        ? parseFloat(doctor.consulting_fee)
        : 0,
      status: "pending",
      payment_status: "pending",
    });

    if (error) {
      console.error("Booking error:", error);
      setMessage({ type: "error", text: "Booking failed. Please try again." });
    } else {
      setBookingSuccess(true);
      setShowBooking(false);
    }
    setSaving(false);
  };

  // Get min date (today)
  const today = new Date().toISOString().split("T")[0];

  // Get max date (30 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const availableDays = availability.map((a) => dayNames[a.day_of_week]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  if (!doctor) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-slate-500">Doctor not found.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-teal-600 font-medium hover:underline"
          >
            ← Go back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="text-sm text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Doctors
        </button>

        {/* Booking Success Banner */}
        {bookingSuccess && (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex items-center gap-4">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold text-teal-900">Appointment Booked!</p>
              <p className="text-teal-700 text-sm mt-0.5">
                Your appointment with {doctor.name} is pending confirmation.
                You'll be notified once confirmed.
              </p>
              <button
                onClick={() => router.push("/appointments")}
                className="mt-2 text-sm font-semibold text-teal-600 hover:underline"
              >
                View My Appointments →
              </button>
            </div>
          </div>
        )}

        {/* Doctor Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-4xl border border-teal-100 shrink-0">
              {doctor.name?.charAt(0) || "D"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">
                  {doctor.name}
                </h1>
                {doctor.is_verified && (
                  <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-full font-semibold">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-teal-600 font-semibold mt-1">
                {doctor.specialization || "General Physician"}
              </p>
              {doctor.hospital && (
                <p className="text-slate-500 text-sm mt-0.5">
                  🏥 {doctor.hospital}
                </p>
              )}
              {doctor.location && (
                <p className="text-slate-400 text-sm mt-0.5">
                  📍 {doctor.location}
                </p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              {
                label: "Experience",
                value: doctor.experience_years
                  ? `${doctor.experience_years} years`
                  : "N/A",
                icon: "🩺",
              },
              {
                label: "Rating",
                value: `⭐ ${doctor.reliability_rating || "N/A"}`,
                icon: "",
              },
              {
                label: "Consulting Fee",
                value: doctor.consulting_fee
                  ? `₹${doctor.consulting_fee}`
                  : "Free",
                icon: "💰",
              },
              {
                label: "Languages",
                value: doctor.languages || "N/A",
                icon: "🗣",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-3 bg-slate-50 rounded-xl text-center"
              >
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="font-bold text-slate-900 text-sm mt-1">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* About */}
          {doctor.about && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-2">About</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {doctor.about}
              </p>
            </div>
          )}

          {/* Availability */}
          {availableDays.length > 0 && (
            <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
              <p className="text-sm font-semibold text-teal-800 mb-2">
                📅 Available Days
              </p>
              <div className="flex gap-2 flex-wrap">
                {availableDays.map((day) => (
                  <span
                    key={day}
                    className="text-xs bg-white text-teal-700 border border-teal-200 px-3 py-1 rounded-full font-medium"
                  >
                    {day}
                  </span>
                ))}
              </div>
              {availability[0] && (
                <p className="text-xs text-teal-600 mt-2">
                  🕐 {formatTime(availability[0].start_time)} —{" "}
                  {formatTime(availability[0].end_time)}
                  &nbsp;({availability[0].slot_duration_minutes} min slots)
                </p>
              )}
            </div>
          )}

          {/* Book Button */}
          {!showBooking &&
            !bookingSuccess &&
            currentProfile?.role !== "doctor" && (
              <button
                onClick={() => setShowBooking(true)}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-colors"
              >
                📅 Book Appointment —{" "}
                {doctor.consulting_fee ? `₹${doctor.consulting_fee}` : "Free"}
              </button>
            )}
        </div>

        {/* Booking Form */}
        {showBooking && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Book Appointment
              </h2>
              <button
                onClick={() => setShowBooking(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {/* Consultation Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Consultation Type
              </label>
              <div className="flex gap-3">
                {["online", "in_person"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setConsultationType(type)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                      consultationType === type
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-slate-200 text-slate-500 hover:border-teal-300"
                    }`}
                  >
                    {type === "online" ? "💻 Online" : "🏥 In Person"}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Select Date *
              </label>
              <input
                type="date"
                value={selectedDate}
                min={today}
                max={maxDateStr}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {selectedDate && availableSlots.length === 0 && (
                <p className="text-red-500 text-xs mt-1">
                  ⚠️ Doctor is not available on this day. Available:{" "}
                  {availableDays.join(", ")}
                </p>
              )}
            </div>

            {/* Time Slots */}
            {availableSlots.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Select Time Slot *
                </label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {availableSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition-colors ${
                          isBooked
                            ? "bg-slate-100 text-slate-300 cursor-not-allowed line-through"
                            : selectedTime === slot
                              ? "bg-teal-600 text-white"
                              : "bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-700 border border-slate-200"
                        }`}
                      >
                        {formatTime(slot)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Reason for Visit *
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Routine checkup, Chest pain, Fever"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Symptoms (Optional)
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms in detail..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            {/* Summary */}
            {selectedDate && selectedTime && (
              <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl">
                <p className="text-sm font-bold text-teal-900 mb-2">
                  📋 Booking Summary
                </p>
                <div className="space-y-1 text-sm text-teal-700">
                  <p>👨‍⚕️ Dr. {doctor.name}</p>
                  <p>
                    📅{" "}
                    {new Date(selectedDate).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p>🕐 {formatTime(selectedTime)}</p>
                  <p>
                    💻{" "}
                    {consultationType === "online"
                      ? "Online Consultation"
                      : "In-Person Visit"}
                  </p>
                  <p className="font-bold">
                    💰 Fee:{" "}
                    {doctor.consulting_fee
                      ? `₹${doctor.consulting_fee}`
                      : "Free"}
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {message && (
              <div
                className={`px-4 py-3 rounded-xl text-sm font-medium ${
                  message.type === "success"
                    ? "bg-teal-50 text-teal-700 border border-teal-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowBooking(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={saving || !selectedDate || !selectedTime || !reason}
                className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold text-sm transition-colors"
              >
                {saving ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
