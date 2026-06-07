"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [patient, setPatient] = React.useState<any>(null);
  const [records, setRecords] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    diagnosis: "",
    prescription: "",
    notes: "",
    visit_date: new Date().toISOString().split("T")[0],
  });

  const fetchData = async () => {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser || !id) {
      setLoading(false);
      return;
    }

    // Fetch patient
    const { data: patientData } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    // Fetch health records
    const { data: recordsData } = await supabase
      .from("health_records")
      .select("*")
      .eq("patient_id", id)
      .order("visit_date", { ascending: false });

    if (patientData) setPatient(patientData);
    if (recordsData) setRecords(recordsData);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddRecord = async () => {
    if (!form.diagnosis) return;
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) {
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("health_records").insert({
      patient_id: id,
      doctor_id: authUser.id,
      diagnosis: form.diagnosis,
      prescription: form.prescription,
      notes: form.notes,
      visit_date: form.visit_date,
    });

    if (!error) {
      setShowModal(false);
      setForm({
        diagnosis: "",
        prescription: "",
        notes: "",
        visit_date: new Date().toISOString().split("T")[0],
      });
      fetchData();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-4 p-6">
          <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-slate-500">Patient not found.</p>
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
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm text-slate-500 hover:text-teal-600 transition-colors"
        >
          ← Back to Patients
        </button>

        {/* Patient Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-3xl border border-teal-100 shrink-0">
              {patient.name?.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">
                {patient.name}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {patient.gender || "—"} •{" "}
                {patient.age ? `${patient.age} years old` : "—"}
              </p>
            </div>
          </div>

          {/* Patient Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Blood Group
              </p>
              <p className="font-bold text-red-500 mt-1">
                {patient.blood_group || "—"}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Phone
              </p>
              <p className="font-bold text-slate-900 mt-1 text-sm">
                {patient.phone || "—"}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Age
              </p>
              <p className="font-bold text-slate-900 mt-1">
                {patient.age ? `${patient.age} yrs` : "—"}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Address
              </p>
              <p className="font-bold text-slate-900 mt-1 text-sm">
                {patient.address || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Health Records Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Health Records</h2>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              + Add Record
            </button>
          </div>

          {records.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl">
              <p className="text-2xl mb-2">📋</p>
              <p className="text-slate-600 font-semibold">
                No health records yet
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Add the first health record for this patient.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="p-5 border border-slate-200 rounded-xl hover:border-teal-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-slate-900">
                      {record.diagnosis}
                    </h3>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full shrink-0 ml-2">
                      {new Date(record.visit_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {record.prescription && (
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
                        Prescription
                      </span>
                      <p className="text-sm text-slate-600 mt-1">
                        {record.prescription}
                      </p>
                    </div>
                  )}
                  {record.notes && (
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Notes
                      </span>
                      <p className="text-sm text-slate-500 mt-1 italic">
                        {record.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Health Record Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                New Health Record
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Diagnosis */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Diagnosis *
                </label>
                <input
                  type="text"
                  value={form.diagnosis}
                  onChange={(e) =>
                    setForm({ ...form, diagnosis: e.target.value })
                  }
                  placeholder="e.g. Hypertension Stage 1"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Prescription */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Prescription
                </label>
                <textarea
                  value={form.prescription}
                  onChange={(e) =>
                    setForm({ ...form, prescription: e.target.value })
                  }
                  placeholder="e.g. Amlodipine 5mg once daily"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional observations..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Visit Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Visit Date
                </label>
                <input
                  type="date"
                  value={form.visit_date}
                  onChange={(e) =>
                    setForm({ ...form, visit_date: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRecord}
                disabled={saving || !form.diagnosis}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold text-sm transition-colors"
              >
                {saving ? "Saving..." : "Add Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
