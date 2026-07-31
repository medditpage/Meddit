"use client";

// app/community/[id]/page.tsx
// Meddit Post Detail & Discussion Thread Page

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { RedditHeader } from "@/components/layout/RedditHeader";
import { RedditLeftSidebar } from "@/components/community/RedditLeftSidebar";
import { RedditRightSidebar } from "@/components/community/RedditRightSidebar";
import { useStore } from "@/lib/store";

interface CommunityPostDetail {
  id: string;
  title: string;
  content: string;
  created_at: string;
  category?: string;
  author?: { name?: string; avatar_initials?: string; role?: string };
  post_upvotes?: { count: number }[];
}

interface PostCommentDetail {
  id: string;
  content: string;
  created_at: string;
  author?: { name?: string; avatar_initials?: string; role?: string };
}

function formatTime(timestamp: string, now = Date.now()) {
  const diff = now - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useStore((state) => state.user);

  const [post, setPost] = React.useState<CommunityPostDetail | null>(null);
  const [comments, setComments] = React.useState<PostCommentDetail[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [isUpvoted, setIsUpvoted] = React.useState(false);
  const [upvoteCount, setUpvoteCount] = React.useState(0);
  const [commentText, setCommentText] = React.useState("");
  const [posting, setPosting] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const fetchPost = React.useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_posts")
      .select(
        `
        *,
        author:profiles(name, avatar_initials, role),
        post_upvotes(count)
      `,
      )
      .eq("id", id)
      .single();

    if (data) {
      setPost(data as CommunityPostDetail);
      setUpvoteCount(data.post_upvotes?.[0]?.count || 0);
    }
  }, [id]);

  const fetchComments = React.useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("comments")
      .select(`*, author:profiles(name, avatar_initials, role)`)
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    if (data) setComments(data as PostCommentDetail[]);
  }, [id]);

  const fetchUserUpvote = React.useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("post_upvotes")
      .select("id")
      .eq("post_id", id)
      .eq("user_id", userId)
      .single();
    setIsUpvoted(!!data);
  }, [id]);

  React.useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        setCurrentUserId(authUser.id);
        fetchUserUpvote(authUser.id);
      }
      await fetchPost();
      await fetchComments();
      setLoading(false);

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
  }, [id, fetchComments, fetchPost, fetchUserUpvote]);

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

  const currentUserHandle = user?.name
    ? `u/${user.name.replace(/\s+/g, "_").toLowerCase()}`
    : "u/guest";

  // Extract embedded image markdown if present
  const imgMatch = post?.content ? post.content.match(/!\[.*?\]\((.*?)\)/) : null;
  const imageUrl = imgMatch ? imgMatch[1] : undefined;
  const cleanContent = post?.content ? post.content.replace(/!\[.*?\]\((.*?)\)/, "").trim() : "";

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      {/* Header (No Notification Bell) */}
      <RedditHeader
        onCreatePostClick={() => router.push("/community")}
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main 3-Column Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_310px] gap-5 items-start">
          
          {/* Left Sidebar */}
          <div className="hidden md:block sticky top-20">
            <RedditLeftSidebar
              activeCategory={post?.category || "General"}
              onCategorySelect={(cat) => router.push(`/community?cat=${cat}`)}
            />
          </div>

          {/* Center Column: Thread View */}
          <div className="space-y-4 min-w-0">
            {/* Back button */}
            <button
              onClick={() => router.push("/community")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-orange-400 font-bold text-xs shadow-2xs transition-all hover:bg-slate-800"
            >
              ← Back to m/{post?.category || "meddit"}
            </button>

            {loading ? (
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 animate-pulse h-64" />
            ) : !post ? (
              <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800 space-y-3">
                <p className="text-4xl">❌</p>
                <h3 className="font-extrabold text-white text-lg">Post Not Found</h3>
                <p className="text-xs text-slate-400">This post may have been removed or deleted.</p>
                <button
                  onClick={() => router.push("/community")}
                  className="px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-full shadow-xs"
                >
                  Return to Feed
                </button>
              </div>
            ) : (
              <>
                {/* Main Post Detail Card */}
                <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                  {/* Vertical Vote Pill */}
                  <div className="bg-slate-950/80 sm:w-14 shrink-0 p-3 flex sm:flex-col items-center justify-between sm:justify-start gap-2 border-b sm:border-b-0 sm:border-r border-slate-800">
                    <button
                      onClick={handleUpvote}
                      className={`p-2 rounded-xl transition-all active:scale-90 ${
                        isUpvoted
                          ? "bg-orange-500 text-white shadow-xs"
                          : "text-slate-400 hover:text-orange-500 hover:bg-slate-800"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                      </svg>
                    </button>
                    <span className={`font-extrabold text-xs ${isUpvoted ? "text-orange-400" : "text-slate-300"}`}>
                      {upvoteCount}
                    </span>
                    <button
                      onClick={handleUpvote}
                      className="p-2 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 p-5 sm:p-6 space-y-4">
                    {/* Subreddit & Author Metadata */}
                    <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-teal-400">
                          m/{post.category || "General"}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">
                          Posted by <strong className="text-slate-200">u/{(post.author?.name || "anonymous").replace(/\s+/g, "_").toLowerCase()}</strong>
                        </span>
                        {post.author?.role && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            post.author.role === "doctor" ? "bg-teal-500/20 text-teal-300 border-teal-500/40" : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}>
                            {post.author.role === "doctor" ? "👨‍⚕️ Doctor" : "👤 Patient"}
                          </span>
                        )}
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500">{formatTime(post.created_at)}</span>
                      </div>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
                      {post.title}
                    </h1>

                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {cleanContent}
                    </div>

                    {/* Image Attachment Display */}
                    {imageUrl && (
                      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 my-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt="Clinical Attachment"
                          className="w-full max-h-[500px] object-contain"
                        />
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-800 text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-slate-200">
                        💬 <span>{comments.length} Comments</span>
                      </div>
                      <button
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied!"));
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-800 transition-colors"
                      >
                        🔗 <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comment Box */}
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">
                      Comment as <strong className="text-white">{currentUserHandle}</strong>
                    </span>
                    <span className="text-teal-400 font-bold flex items-center gap-1 text-[11px]">
                      <span>🩺</span> Clinical Advice Welcome
                    </span>
                  </div>

                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your clinical thoughts or suggestions..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-800 text-sm leading-relaxed bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none placeholder-slate-500"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleComment}
                      disabled={posting || !commentText.trim()}
                      className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-800 text-white font-extrabold text-xs rounded-full transition-all shadow-xs"
                    >
                      {posting ? "Posting..." : "Comment"}
                    </button>
                  </div>
                </div>

                {/* Indented Comment Tree */}
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-sm text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                    <span>💬</span> Discussion Thread ({comments.length})
                  </h3>

                  {comments.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No comments yet. Be the first to respond!
                    </div>
                  ) : (
                    <div className="space-y-4 divide-y divide-slate-800">
                      {comments.map((comment) => (
                        <div key={comment.id} className="pt-4 first:pt-0 flex gap-3 group">
                          {/* Left Guide Line */}
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-teal-950 text-teal-300 font-extrabold text-xs flex items-center justify-center shrink-0 border border-teal-800">
                              {(comment.author?.name || "A").substring(0, 2).toUpperCase()}
                            </div>
                            <div className="w-0.5 flex-1 bg-slate-800 group-hover:bg-teal-500/40 transition-colors mt-2 rounded-full" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 space-y-1.5 text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-white">
                                u/{(comment.author?.name || "anonymous").replace(/\s+/g, "_").toLowerCase()}
                              </span>
                              {comment.author?.role && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border uppercase ${
                                  comment.author.role === "doctor" ? "bg-teal-500/20 text-teal-300 border-teal-500/40" : "bg-slate-800 text-slate-400 border-slate-700"
                                }`}>
                                  {comment.author.role === "doctor" ? "👨‍⚕️ Doctor" : "👤 Patient"}
                                </span>
                              )}
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-500">{formatTime(comment.created_at)}</span>
                            </div>

                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                              {comment.content}
                            </p>

                            {/* Comment Actions */}
                            <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-slate-500">
                              <button className="hover:text-orange-400 transition-colors flex items-center gap-1">
                                ⬆️ Upvote
                              </button>
                              <button className="hover:text-teal-400 transition-colors flex items-center gap-1">
                                💬 Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block sticky top-20">
            <RedditRightSidebar
              onCreatePostClick={() => router.push("/community")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
