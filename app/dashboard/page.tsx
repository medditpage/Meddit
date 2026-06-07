"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";
import { useStore } from "@/lib/store";

export default function DashboardPage() {
  const router = useRouter();
  const user = useStore((state) => state.user);

  const [stats, setStats] = React.useState({
    totalPatients: 0,
    totalPosts: 0,
    totalDoctors: 0,
    totalComments: 0,
  });
  const [recentPatients, setRecentPatients] = React.useState<any[]>([]);
  const [recentPosts, setRecentPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;

      // Fetch all stats in parallel
      const [
        { count: patientCount },
        { count: postCount },
        { count: doctorCount },
        { count: commentCount },
        { data: patients },
        { data: posts },
      ] = await Promise.all([
        supabase
          .from("patients")
          .select("*", { count: "exact", head: true })
          .eq("doctor_id", authUser.id),
        supabase
          .from("community_posts")
          .select("*", { count: "exact", head: true }),
        supabase.from("doctors").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
        supabase
          .from("patients")
          .select("*")
          .eq("doctor_id", authUser.id)
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("community_posts")
          .select("*, author:profiles(name)")
          .order("created_at", { ascending: false })
          .limit(3),
      ]);

      setStats({
        totalPatients: patientCount || 0,
        totalPosts: postCount || 0,
        totalDoctors: doctorCount || 0,
        totalComments: commentCount || 0,
      });
      if (patients) setRecentPatients(patients);
      if (posts) setRecentPosts(posts);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const formatTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const statCards = [
    {
      label: "My Patients",
      value: stats.totalPatients,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" />
        </svg>
      ),
      color: "bg-teal-50 text-teal-600 border-teal-100",
      href: "/patients",
    },
    {
      label: "Community Posts",
      value: stats.totalPosts,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      color: "bg-blue-50 text-blue-600 border-blue-100",
      href: "/community",
    },
    {
      label: "Verified Doctors",
      value: stats.totalDoctors,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      color: "bg-purple-50 text-purple-600 border-purple-100",
      href: "/doctors",
    },
    {
      label: "Total Comments",
      value: stats.totalComments,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      ),
      color: "bg-amber-50 text-amber-600 border-amber-100",
      href: "/community",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white">
          <p className="text-teal-200 text-sm font-medium mb-1">Good day 👋</p>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || "Doctor"}
          </h1>
          <p className="text-teal-100 text-sm">
            Here's what's happening in your practice today.
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => router.push("/patients")}
              className="px-4 py-2 bg-white text-teal-700 font-semibold rounded-xl text-sm hover:bg-teal-50 transition-colors"
            >
              + Add Patient
            </button>
            <button
              onClick={() => router.push("/community")}
              className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-xl text-sm hover:bg-teal-400 transition-colors border border-teal-400"
            >
              View Community
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <button
                key={card.label}
                onClick={() => router.push(card.href)}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all text-left group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 ${card.color}`}
                >
                  {card.icon}
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {card.value}
                </p>
                <p className="text-sm text-slate-500 mt-1">{card.label}</p>
              </button>
            ))}
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Patients */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 text-lg">
                Recent Patients
              </h2>
              <button
                onClick={() => router.push("/patients")}
                className="text-sm text-teal-600 font-semibold hover:underline"
              >
                View all
              </button>
            </div>

            {recentPatients.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl">
                <p className="text-slate-400 text-sm">No patients yet</p>
                <button
                  onClick={() => router.push("/patients")}
                  className="mt-2 text-teal-600 text-sm font-semibold hover:underline"
                >
                  Add your first patient
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => router.push(`/patients/${patient.id}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold border border-teal-100 shrink-0">
                      {patient.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {patient.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {patient.gender || "—"} •{" "}
                        {patient.age ? `${patient.age} yrs` : "—"} •{" "}
                        {patient.blood_group || "—"}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-slate-300 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Recent Community Posts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 text-lg">Recent Posts</h2>
              <button
                onClick={() => router.push("/community")}
                className="text-sm text-teal-600 font-semibold hover:underline"
              >
                View all
              </button>
            </div>

            {recentPosts.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl">
                <p className="text-slate-400 text-sm">No posts yet</p>
                <button
                  onClick={() => router.push("/community")}
                  className="mt-2 text-teal-600 text-sm font-semibold hover:underline"
                >
                  Be the first to post
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => router.push(`/community/${post.id}`)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 shrink-0 text-sm">
                      {(post.author?.name || "A").substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {post.author?.name || "Anonymous"} •{" "}
                        {formatTime(post.created_at)}
                      </p>
                    </div>
                    <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100 shrink-0">
                      {post.category || "General"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 text-lg mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Add Patient", href: "/patients", emoji: "🏥" },
              { label: "New Post", href: "/community", emoji: "✍️" },
              { label: "Find Doctor", href: "/doctors", emoji: "👨‍⚕️" },
              { label: "Settings", href: "/settings", emoji: "⚙️" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.href)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-all"
              >
                <span className="text-2xl">{action.emoji}</span>
                <span className="text-sm font-semibold text-slate-700">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
