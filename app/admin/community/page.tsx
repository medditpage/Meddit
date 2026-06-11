"use client";
import * as React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { createClient } from "@/utils/supabase/client";

export default function AdminCommunityPage() {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [expandedPost, setExpandedPost] = React.useState<string | null>(null);
  const [postComments, setPostComments] = React.useState<Record<string, any[]>>(
    {},
  );
  const [loadingComments, setLoadingComments] = React.useState<string | null>(
    null,
  );

  const fetchPosts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_posts")
      .select(
        "*, author:profiles(name, role), comments(count), post_upvotes(count)",
      )
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const fetchComments = async (postId: string) => {
    if (postComments[postId]) return;
    setLoadingComments(postId);
    const supabase = createClient();
    const { data } = await supabase
      .from("comments")
      .select("*, author:profiles(name, role)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (data) setPostComments((prev) => ({ ...prev, [postId]: data }));
    setLoadingComments(null);
  };

  const handleExpandPost = (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      fetchComments(postId);
    }
  };

  const handleDeletePost = async (postId: string, title: string) => {
    if (!confirm(`Delete post "${title}"? This also deletes all comments.`))
      return;
    setDeleting(postId);
    const supabase = createClient();
    await supabase.from("comments").delete().eq("post_id", postId);
    await supabase.from("post_upvotes").delete().eq("post_id", postId);
    await supabase.from("post_reports").delete().eq("post_id", postId);
    await supabase.from("community_posts").delete().eq("id", postId);
    setDeleting(null);
    fetchPosts();
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!confirm("Delete this comment?")) return;
    const supabase = createClient();
    await supabase.from("comments").delete().eq("id", commentId);
    setPostComments((prev) => ({
      ...prev,
      [postId]: prev[postId].filter((c) => c.id !== commentId),
    }));
    fetchPosts();
  };

  const filtered = posts.filter(
    (p) =>
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.content?.toLowerCase().includes(search.toLowerCase()),
  );

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Community Moderation
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {filtered.length} posts • Click a post to read content and comments
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search posts by title, content, or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 bg-slate-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-3xl mb-2">💬</p>
            <p className="font-semibold text-slate-700">No posts found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
                          {post.category || "General"}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            post.author?.role === "doctor"
                              ? "bg-teal-50 text-teal-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {post.author?.role === "doctor" ? "👨‍⚕️" : "🏥"}{" "}
                          {post.author?.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatTime(post.created_at)}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {post.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center hidden sm:block">
                        <p className="text-sm font-bold text-slate-900">
                          {post.post_upvotes?.[0]?.count || 0}
                        </p>
                        <p className="text-xs text-slate-400">votes</p>
                      </div>
                      <div className="text-center hidden sm:block">
                        <p className="text-sm font-bold text-slate-900">
                          {post.comments?.[0]?.count || 0}
                        </p>
                        <p className="text-xs text-slate-400">comments</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button
                      onClick={() => handleExpandPost(post.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      {expandedPost === post.id
                        ? "▲ Collapse"
                        : "▼ Read post & comments"}
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id, post.title)}
                      disabled={deleting === post.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deleting === post.id ? "Deleting..." : "🗑 Delete Post"}
                    </button>
                  </div>
                </div>

                {/* Expanded Content + Comments */}
                {expandedPost === post.id && (
                  <div className="border-t border-slate-100">
                    {/* Full post content */}
                    <div className="p-5 bg-slate-50">
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </div>

                    {/* Comments Section */}
                    <div className="p-5 border-t border-slate-100">
                      <h4 className="font-bold text-slate-900 text-sm mb-4">
                        💬 Comments ({post.comments?.[0]?.count || 0})
                      </h4>

                      {loadingComments === post.id ? (
                        <div className="space-y-2">
                          {[1, 2].map((i) => (
                            <div
                              key={i}
                              className="h-14 bg-slate-100 rounded-xl animate-pulse"
                            />
                          ))}
                        </div>
                      ) : postComments[post.id]?.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-4">
                          No comments yet
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {(postComments[post.id] || []).map((comment) => (
                            <div
                              key={comment.id}
                              className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                  comment.author?.role === "doctor"
                                    ? "bg-teal-100 text-teal-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {comment.author?.name?.charAt(0) || "?"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="text-xs font-bold text-slate-900">
                                    {comment.author?.name || "Anonymous"}
                                  </span>
                                  <span
                                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                                      comment.author?.role === "doctor"
                                        ? "bg-teal-50 text-teal-600"
                                        : "bg-blue-50 text-blue-600"
                                    }`}
                                  >
                                    {comment.author?.role}
                                  </span>
                                  <span className="text-xs text-slate-400">
                                    {formatTime(comment.created_at)}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-700">
                                  {comment.content}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  handleDeleteComment(comment.id, post.id)
                                }
                                className="shrink-0 px-2 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors"
                              >
                                🗑
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
