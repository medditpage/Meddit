"use client";
import * as React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { createClient } from "@/utils/supabase/client";

export default function AdminReportsPage() {
  const [reports, setReports] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [resolving, setResolving] = React.useState<string | null>(null);

  const fetchReports = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("post_reports")
      .select(
        "*, post:community_posts(id, title, content, author_id), reporter:profiles!post_reports_reported_by_fkey(name)",
      )
      .order("created_at", { ascending: false });
    if (data) setReports(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchReports();
  }, []);

  const handleDeletePost = async (postId: string, reportId: string) => {
    if (!confirm("Delete this post and dismiss the report?")) return;
    setResolving(reportId);
    const supabase = createClient();
    await supabase.from("comments").delete().eq("post_id", postId);
    await supabase.from("post_upvotes").delete().eq("post_id", postId);
    await supabase.from("post_reports").delete().eq("post_id", postId);
    await supabase.from("community_posts").delete().eq("id", postId);
    setResolving(null);
    fetchReports();
  };

  const handleDismiss = async (reportId: string) => {
    if (!confirm("Dismiss this report? The post will remain.")) return;
    setResolving(reportId);
    const supabase = createClient();
    await supabase.from("post_reports").delete().eq("id", reportId);
    setResolving(null);
    fetchReports();
  };

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Flagged Reports
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {reports.length} report{reports.length !== 1 ? "s" : ""} awaiting
            review
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-4xl mb-3">✅</p>
            <p className="font-semibold text-slate-700">
              No reports — community is clean!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-red-100 overflow-hidden"
              >
                <div className="bg-red-50 px-5 py-3 border-b border-red-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full border border-red-200">
                      🚩 {report.reason}
                    </span>
                    <span className="text-xs text-slate-500">
                      Reported by{" "}
                      <span className="font-semibold text-slate-700">
                        {report.reporter?.name || "Unknown"}
                      </span>{" "}
                      • {formatTime(report.created_at)}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-1">
                    {report.post?.title || "Post deleted"}
                  </h3>
                  {report.post?.content && (
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                      {report.post.content}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {report.post?.id && (
                      <button
                        onClick={() =>
                          handleDeletePost(report.post.id, report.id)
                        }
                        disabled={resolving === report.id}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        {resolving === report.id
                          ? "Processing..."
                          : "🗑 Delete Post"}
                      </button>
                    )}
                    <button
                      onClick={() => handleDismiss(report.id)}
                      disabled={resolving === report.id}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      Dismiss Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
