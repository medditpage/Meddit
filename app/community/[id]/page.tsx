"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = React.useState<any>(null);
  const [comments, setComments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [isUpvoted, setIsUpvoted] = React.useState(false);
  const [upvoteCount, setUpvoteCount] = React.useState(0);
  const [commentText, setCommentText] = React.useState("");
  const [posting, setPosting] = React.useState(false);

  const fetchPost = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_posts")
      .select(
        `
        *,
        author:profiles(name, avatar_initials),
        post_upvotes(count)
      `,
      )
      .eq("id", id)
      .single();

    if (data) {
      setPost(data);
      setUpvoteCount(data.post_upvotes?.[0]?.count || 0);
    }
  };

  const fetchComments = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("comments")
      .select(`*, author:profiles(name, avatar_initials)`)
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    if (data) setComments(data);
  };

  const fetchUserUpvote = async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("post_upvotes")
      .select("id")
      .eq("post_id", id)
      .eq("user_id", userId)
      .single();
    setIsUpvoted(!!data);
  };

  React.useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        fetchUserUpvote(user.id);
      }
      await fetchPost();
      await fetchComments();
      setLoading(false);

      // Realtime for comments
      const channel = supabase
        .channel(`comments_${id}_${Date.now()}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "comments" },
          () => fetchComments(),
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };
    init();
  }, [id]);

  const handleUpvote = async () => {
    if (!currentUserId) return;
    const supabase = createClient();

    if (isUpvoted) {
      await supabase
        .from("post_upvotes")
        .delete()
        .eq("post_id", id)
        .eq("user_id", currentUserId);
      setIsUpvoted(false);
      setUpvoteCount((c) => Math.max(0, c - 1));
    } else {
      await supabase
        .from("post_upvotes")
        .insert({ post_id: id, user_id: currentUserId });
      setIsUpvoted(true);
      setUpvoteCount((c) => c + 1);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !currentUserId) return;
    setPosting(true);
    const supabase = createClient();

    await supabase.from("comments").insert({
      post_id: id,
      author_id: currentUserId,
      content: commentText.trim(),
    });

    setCommentText("");
    setPosting(false);
    fetchComments();
  };

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  if (!post) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto text-center py-20">
          <p className="text-slate-500">Post not found.</p>
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
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/community")}
          className="mb-6 text-sm text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-1"
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
          Back to Community
        </button>

        {/* Post Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          {/* Author */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold border border-teal-100">
              {(post.author?.name || "A").substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">
                {post.author?.name || "Anonymous"}
              </p>
              <p className="text-xs text-slate-400">
                {formatTime(post.created_at)}
              </p>
            </div>
            <span className="ml-auto text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
              #{post.category || "General"}
            </span>
          </div>

          {/* Title + Content */}
          <h1 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">
            {post.title}
          </h1>
          <p className="text-slate-600 leading-relaxed">{post.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-6 pt-5 border-t border-slate-100">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isUpvoted
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={isUpvoted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
              {upvoteCount} {upvoteCount === 1 ? "upvote" : "upvotes"}
            </button>

            <span className="flex items-center gap-2 text-sm text-slate-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </span>
          </div>
        </div>

        {/* Comment Input */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <h3 className="font-bold text-slate-900 mb-3">Add a Comment</h3>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts or clinical insight..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleComment}
              disabled={posting || !commentText.trim()}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              {posting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-400 text-sm">
                No comments yet. Be the first to respond!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-xl border border-slate-200 p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200">
                    {(comment.author?.name || "A")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      {comment.author?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatTime(comment.created_at)}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed pl-11">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
