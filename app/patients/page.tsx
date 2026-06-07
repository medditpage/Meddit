"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";
import { useStore } from "@/lib/store";

export default function PatientsPage() {
  const router = useRouter();
  const user = useStore((state) => state.user);

  const [patients, setPatients] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // New patient form state
  const [form, setForm] = React.useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    blood_group: "",
    address: "",
  });

  const fetchPatients = async () => {
    const supabase = createClient();

    // Get session directly from Supabase — don't rely on Zustand timing
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("doctor_id", authUser.id)
      .order("created_at", { ascending: false });
if (error) console.error("Patients fetch error:", JSON.stringify(error));
    
    if (data) setPatients(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchPatients();
  }, [user?.id]);

  const handleAddPatient = async () => {
    if (!form.name) return;
    setSaving(true);

    const supabase = createClient();

    // Get auth user directly
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) {
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("patients").insert({
      doctor_id: authUser.id,
      name: form.name,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender,
      phone: form.phone,
      blood_group: form.blood_group,
      address: form.address,
    });

    if (!error) {
      setShowModal(false);
      setForm({
        name: "",
        age: "",
        gender: "",
        phone: "",
        blood_group: "",
        address: "",
      });
      fetchPatients();
    }
    setSaving(false);
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Patients</h1>
            <p className="text-slate-500 mt-1">
              Manage your patient records and health history.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            + Add Patient
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search patients by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
        </div>

        {/* Patient List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-4xl mb-3">🏥</p>
            <p className="text-slate-700 font-semibold">No patients found</p>
            <p className="text-slate-400 text-sm mt-1">
              Add your first patient to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => router.push(`/patients/${patient.id}`)}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all text-left group"
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-lg border border-teal-100 group-hover:bg-teal-100 transition-colors shrink-0">
                    {patient.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{patient.name}</p>
                    <p className="text-xs text-slate-400">
                      {patient.gender || "—"} •{" "}
                      {patient.age ? `${patient.age} yrs` : "—"}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Blood Group</span>
                    <span className="font-semibold text-red-500">
                      {patient.blood_group || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Phone</span>
                    <span className="font-medium text-slate-700">
                      {patient.phone || "—"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">New Patient</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Age + Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="35"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Blood Group
                </label>
                <select
                  value={form.blood_group}
                  onChange={(e) =>
                    setForm({ ...form, blood_group: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Kanpur, UP"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPatient}
                disabled={saving || !form.name}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold text-sm transition-colors"
              >
                {saving ? "Saving..." : "Add Patient"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
