"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const user = useStore((state) => state.user);
  const login = useStore((state) => state.login);

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [role, setRole] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load current profile data
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setName(data.name || "");
        setPhone(data.phone || "");
        setRole(data.role || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const avatarInitials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const { error } = await supabase
      .from("profiles")
      .update({ name, phone, role, avatar_initials: avatarInitials })
      .eq("id", user.id);

    if (error) {
      setMessage({ type: "error", text: "Failed to save. Please try again." });
    } else {
      // Update Zustand store immediately
      login({ ...user, name, role, avatarInitials });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-4 p-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Profile Settings
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your personal and professional information.
          </p>
        </div>

        {/* Avatar Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-2xl border border-teal-200 shrink-0">
            {name
              ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
              : "?"}
          </div>
          <div>
            <p className="font-bold text-slate-900 text-lg">
              {name || "Your Name"}
            </p>
            <p className="text-teal-600 text-sm font-medium">
              {role || "Your Role"}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Avatar is auto-generated from your name
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Arjun Mehta"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Role / Specialization
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Cardiologist, General Physician"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Feedback Message */}
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

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
