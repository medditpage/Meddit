"use client";
import * as React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { createClient } from "@/utils/supabase/client";

export default function VerificationsPage() {
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [userType, setUserType] = React.useState<"doctor" | "patient">(
    "doctor",
  );
  const [processing, setProcessing] = React.useState<string | null>(null);
  const [noteModal, setNoteModal] = React.useState<{
    open: boolean;
    doctorId: string;
    doctorName: string;
    action: "approved" | "rejected";
  } | null>(null);
  const [noteText, setNoteText] = React.useState("");
  const [viewDoc, setViewDoc] = React.useState<{
    url: string;
    label: string;
  } | null>(null);

  const fetchDoctors = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .in("role", ["doctor", "patient"])
      .order("created_at", { ascending: false });
    if (data) setDoctors(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchDoctors();
  }, []);

  const getSignedUrl = async (path: string, bucket = "documents") => {
    if (!path) return null;
    const supabase = createClient();
    if (path.startsWith("http")) return path;
    const { data } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600);
    return data?.signedUrl || null;
  };

  const handleViewDoc = async (path: string, label: string) => {
    const url = await getSignedUrl(path);
    if (url) setViewDoc({ url, label });
    else alert("Could not load document.");
  };

  const handleAction = async (
    doctorId: string,
    action: "approved" | "rejected",
  ) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    setNoteModal({
      open: true,
      doctorId,
      doctorName: doctor?.name || "Doctor",
      action,
    });
    setNoteText("");
  };

  const confirmAction = async () => {
    if (!noteModal) return;
    setProcessing(noteModal.doctorId);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({
        verification_status: noteModal.action,
        is_verified: noteModal.action === "approved",
        verification_notes: noteText || null,
      })
      .eq("id", noteModal.doctorId);
    setNoteModal(null);
    setProcessing(null);
    fetchDoctors();
  };

  const handleSuspend = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "suspended" ? "active" : "suspended";
    if (
      !confirm(
        `Are you sure you want to ${newStatus === "suspended" ? "suspend" : "unsuspend"} this account?`,
      )
    )
      return;
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ account_status: newStatus })
      .eq("id", userId);
    fetchDoctors();
  };

  const byType = doctors.filter((d) => d.role === userType);
  const filtered = byType.filter(
    (d) => (d.verification_status || "pending") === activeTab,
  );

  const tabCounts = {
    pending: byType.filter(
      (d) => (d.verification_status || "pending") === "pending",
    ).length,
    approved: byType.filter((d) => d.verification_status === "approved").length,
    rejected: byType.filter((d) => d.verification_status === "rejected").length,
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Doctor Verifications
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Review Aadhaar, CV, and MCI number to approve or reject doctors
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setUserType("doctor")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              userType === "doctor"
                ? "bg-teal-600 text-white"
                : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            👨‍⚕️ Doctors
          </button>
          <button
            onClick={() => setUserType("patient")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              userType === "patient"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            🏥 Patients
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {(["pending", "approved", "rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors capitalize flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  tab === "pending" && tabCounts.pending > 0
                    ? "bg-amber-100 text-amber-700"
                    : tab === "approved"
                      ? "bg-teal-100 text-teal-700"
                      : tab === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-200 text-slate-600"
                }`}
              >
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Doctor Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-3xl mb-2">
              {activeTab === "pending"
                ? "✅"
                : activeTab === "approved"
                  ? "👨‍⚕️"
                  : "❌"}
            </p>
            <p className="font-semibold text-slate-700">
              No {activeTab} verifications
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  {/* Doctor Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold text-2xl shrink-0">
                        {doc.name?.charAt(0) || "D"}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">
                          {doc.name}
                        </h3>
                        <p className="text-teal-600 text-sm font-medium">
                          {doc.specialization || "No specialization set"}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {doc.hospital || "No hospital set"} •{" "}
                          {doc.location || "No location"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                          doc.account_status === "suspended"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {doc.account_status === "suspended"
                          ? "🚫 Suspended"
                          : "✅ Active"}
                      </span>
                    </div>
                  </div>

                  {/* Doctor Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      {
                        label: "MCI Number",
                        value: doc.mci_number || "Not provided",
                      },
                      {
                        label: "Experience",
                        value: doc.experience_years
                          ? `${doc.experience_years} years`
                          : "Not set",
                      },
                      {
                        label: "Consulting Fee",
                        value: doc.consulting_fee
                          ? `₹${doc.consulting_fee}`
                          : "Free",
                      },
                      { label: "Languages", value: doc.languages || "Not set" },
                    ].map((field) => (
                      <div
                        key={field.label}
                        className="p-3 bg-slate-50 rounded-xl"
                      >
                        <p className="text-xs text-slate-400">{field.label}</p>
                        <p className="text-sm font-semibold text-slate-900 mt-0.5">
                          {field.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Documents */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    <div
                      className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                        doc.aadhaar_url
                          ? "bg-teal-50 border-teal-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {doc.aadhaar_url ? "📄" : "❌"}
                        </span>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">
                            Aadhaar Card
                          </p>
                          <p
                            className={`text-xs ${doc.aadhaar_url ? "text-teal-600" : "text-red-600"}`}
                          >
                            {doc.aadhaar_url ? "Uploaded" : "Missing"}
                          </p>
                        </div>
                      </div>
                      {doc.aadhaar_url && (
                        <button
                          onClick={() =>
                            handleViewDoc(doc.aadhaar_url, "Aadhaar Card")
                          }
                          className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors font-medium shrink-0"
                        >
                          👁 View
                        </button>
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                        doc.cv_url
                          ? "bg-teal-50 border-teal-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {doc.cv_url ? "📋" : "❌"}
                        </span>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">
                            Resume / CV
                          </p>
                          <p
                            className={`text-xs ${doc.cv_url ? "text-teal-600" : "text-red-600"}`}
                          >
                            {doc.cv_url ? "Uploaded" : "Missing"}
                          </p>
                        </div>
                      </div>
                      {doc.cv_url && (
                        <button
                          onClick={() =>
                            handleViewDoc(doc.cv_url, "Resume / CV")
                          }
                          className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-colors font-medium shrink-0"
                        >
                          👁 View
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Verification Notes */}
                  {doc.verification_notes && (
                    <div
                      className={`p-3 rounded-xl mb-4 text-sm ${
                        doc.verification_status === "rejected"
                          ? "bg-red-50 border border-red-100 text-red-700"
                          : "bg-teal-50 border border-teal-100 text-teal-700"
                      }`}
                    >
                      <span className="font-semibold">Admin Note: </span>
                      {doc.verification_notes}
                    </div>
                  )}

                  {/* About */}
                  {doc.about && (
                    <div className="p-3 bg-slate-50 rounded-xl mb-4">
                      <p className="text-xs text-slate-400 mb-1">About</p>
                      <p className="text-sm text-slate-700">{doc.about}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {activeTab === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(doc.id, "approved")}
                          disabled={processing === doc.id}
                          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                        >
                          ✅ Approve Doctor
                        </button>
                        <button
                          onClick={() => handleAction(doc.id, "rejected")}
                          disabled={processing === doc.id}
                          className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                    {activeTab === "approved" && (
                      <button
                        onClick={() => handleAction(doc.id, "rejected")}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Revoke Verification
                      </button>
                    )}
                    {activeTab === "rejected" && (
                      <button
                        onClick={() => handleAction(doc.id, "approved")}
                        className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-600 border border-teal-200 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Re-approve
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleSuspend(doc.id, doc.account_status || "active")
                      }
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                        doc.account_status === "suspended"
                          ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                          : "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                      }`}
                    >
                      {doc.account_status === "suspended"
                        ? "🔓 Unsuspend"
                        : "🚫 Suspend"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Modal */}
      {noteModal?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {noteModal.action === "approved"
                ? "✅ Approve Doctor"
                : "❌ Reject Doctor"}
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              {noteModal.action === "approved"
                ? `Approve ${noteModal.doctorName}? They will be marked as verified.`
                : `Reject ${noteModal.doctorName}? Add a reason so they can fix issues.`}
            </p>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={
                noteModal.action === "approved"
                  ? "Optional note for records..."
                  : "Reason for rejection (required for rejection)..."
              }
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setNoteModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={processing !== null}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors ${
                  noteModal.action === "approved"
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-50`}
              >
                {processing
                  ? "Processing..."
                  : `Confirm ${noteModal.action === "approved" ? "Approval" : "Rejection"}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col"
            style={{ maxHeight: "90vh" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
              <h3 className="font-bold text-slate-900">{viewDoc.label}</h3>
              <button
                onClick={() => setViewDoc(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 min-h-[400px]">
              {viewDoc.url.includes(".pdf") ||
              viewDoc.url.includes("application/pdf") ? (
                <iframe
                  src={viewDoc.url}
                  className="w-full h-full min-h-[500px] rounded-xl border border-slate-200"
                  title={viewDoc.label}
                />
              ) : (
                <img
                  src={viewDoc.url}
                  alt={viewDoc.label}
                  className="max-w-full max-h-[600px] object-contain mx-auto rounded-xl"
                />
              )}
            </div>
            <div className="p-4 border-t border-slate-200 shrink-0">
              <a
                href={viewDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                Open in New Tab ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
