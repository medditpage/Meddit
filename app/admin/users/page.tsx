"use client";
import * as React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { createClient } from "@/utils/supabase/client";

export default function UsersPage() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<
    "all" | "doctor" | "patient"
  >("all");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "active" | "suspended"
  >("all");
  const [processing, setProcessing] = React.useState<string | null>(null);

  const fetchUsers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .in("role", ["doctor", "patient"])
      .order("created_at", { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuspend = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "suspended" ? "active" : "suspended";
    if (
      !confirm(
        `${newStatus === "suspended" ? "Suspend" : "Unsuspend"} this account?`,
      )
    )
      return;
    setProcessing(userId);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ account_status: newStatus })
      .eq("id", userId);
    setProcessing(null);
    fetchUsers();
  };

  const handleDelete = async (userId: string, name: string) => {
    if (
      !confirm(
        `⚠️ PERMANENTLY DELETE account for "${name}"? This cannot be undone.`,
      )
    )
      return;
    if (!confirm("Are you absolutely sure? All data will be lost.")) return;
    setProcessing(userId);
    const supabase = createClient();
    await supabase.from("profiles").delete().eq("id", userId);
    setProcessing(null);
    fetchUsers();
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus =
      statusFilter === "all" || (u.account_status || "active") === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              User Management
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              {filtered.length} users found
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          >
            <option value="all">All Roles</option>
            <option value="doctor">Doctors</option>
            <option value="patient">Patients</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-3xl mb-2">👥</p>
            <p className="font-semibold text-slate-700">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                      Verification
                    </th>
                    <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="text-right px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50 transition-colors ${user.account_status === "suspended" ? "opacity-60" : ""}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                              user.role === "doctor"
                                ? "bg-teal-50 text-teal-700 border border-teal-100"
                                : "bg-blue-50 text-blue-700 border border-blue-100"
                            }`}
                          >
                            {user.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {user.name || "No name"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {user.phone || "No phone"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            user.role === "doctor"
                              ? "bg-teal-50 text-teal-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {user.role === "doctor" ? "👨‍⚕️ Doctor" : "🏥 Patient"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            user.account_status === "suspended"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {user.account_status === "suspended"
                            ? "Suspended"
                            : "Active"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {user.role === "doctor" ? (
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              user.verification_status === "approved"
                                ? "bg-teal-50 text-teal-700"
                                : user.verification_status === "rejected"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {user.verification_status || "pending"}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              handleSuspend(
                                user.id,
                                user.account_status || "active",
                              )
                            }
                            disabled={processing === user.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              user.account_status === "suspended"
                                ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                                : "bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100"
                            } disabled:opacity-50`}
                          >
                            {processing === user.id
                              ? "..."
                              : user.account_status === "suspended"
                                ? "Unsuspend"
                                : "Suspend"}
                          </button>
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            disabled={processing === user.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-slate-100">
              {filtered.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 ${user.account_status === "suspended" ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                          user.role === "doctor"
                            ? "bg-teal-50 text-teal-700 border border-teal-100"
                            : "bg-blue-50 text-blue-700 border border-blue-100"
                        }`}
                      >
                        {user.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {user.name || "No name"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {user.role} • {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        user.account_status === "suspended"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {user.account_status === "suspended"
                        ? "Suspended"
                        : "Active"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleSuspend(user.id, user.account_status || "active")
                      }
                      disabled={processing === user.id}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        user.account_status === "suspended"
                          ? "bg-green-50 text-green-600 border border-green-200"
                          : "bg-orange-50 text-orange-600 border border-orange-200"
                      } disabled:opacity-50`}
                    >
                      {user.account_status === "suspended"
                        ? "Unsuspend"
                        : "Suspend"}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      disabled={processing === user.id}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 border border-red-200 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
