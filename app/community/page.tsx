"use client";

// app/community/page.tsx
// Meddit Community Feed with Google Gemini 2.5 Flash Vision AI Post & Image Moderation

import * as React from "react";
import { createClient } from "@/utils/supabase/client";
import { PostCard } from "@/components/community/PostCard";
import { RedditHeader } from "@/components/layout/RedditHeader";
import { RedditLeftSidebar } from "@/components/community/RedditLeftSidebar";
import { RedditRightSidebar } from "@/components/community/RedditRightSidebar";
import { Flame, TrendingUp, MessageSquare } from "lucide-react";

const REPORT_REASONS = [
  "Spam or promotional content",
  "Not medically relevant",
  "Misinformation / fake advice",
  "Offensive or inappropriate",
  "Patient privacy violation",
  "Other",
];

interface CommunityFeedPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  category?: string;
  author_id?: string;
  author?: { name?: string; avatar_initials?: string; role?: string };
  comments?: { count: number }[];
  post_upvotes?: { count: number }[];
  image_url?: string;
}

interface TrendingTopicItem {
  id: string;
  category: string;
  title: string;
  postsCount: string;
  tag?: string;
  count?: number;
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

export default function CommunityPage() {
  const [posts, setPosts] = React.useState<CommunityFeedPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [userUpvotes, setUserUpvotes] = React.useState<Set<string>>(new Set());
  const [trendingTopics, setTrendingTopics] = React.useState<TrendingTopicItem[]>([]);
  const [activeCategory, setActiveCategory] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<"latest" | "upvotes" | "comments">("latest");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Form State
  const [form, setForm] = React.useState({
    title: "",
    content: "",
    category: "General",
    type: "General",
  });

  // Image Upload State
  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);

  const [saving, setSaving] = React.useState(false);
  const [scanningAI, setScanningAI] = React.useState(false);

  // AI Rejection State
  const [aiRejection, setAiRejection] = React.useState<{
    blocked: boolean;
    reason: string;
    category?: string;
  } | null>(null);

  // Report modal state
  const [reportModal, setReportModal] = React.useState<{
    open: boolean;
    postId: string | null;
  }>({ open: false, postId: null });
  const [reportReason, setReportReason] = React.useState("");
  const [reportSubmitting, setReportSubmitting] = React.useState(false);
  const [reportSuccess, setReportSuccess] = React.useState(false);

  const categories = [
    "General",
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Oncology",
    "Orthopedics",
    "Dermatology",
    "Psychiatry",
    "Gynecology",
    "Ayurveda",
  ];

  const postTypes = [
    "General",
    "❓ Question",
    "🔬 Case Study",
    "📢 Announcement",
    "💊 Drug Info",
    "🚨 Emergency Alert",
  ];

  const fetchPosts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_posts")
      .select(
        `*, author:profiles(name, avatar_initials, role), comments(count), post_upvotes(count)`,
      )
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  const fetchTrendingTopics = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_posts")
      .select("category")
      .not("category", "is", null);
    if (data) {
      const counts: Record<string, number> = {};
      data.forEach((p) => {
        if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
      });
      const topics = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cat, count], i) => ({
          id: String(i),
          category: "Medical",
          title: cat,
          postsCount: String(count),
          tag: cat,
          count,
        }));
      setTrendingTopics(topics);
    }
  };

  const fetchUserUpvotes = async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("post_upvotes")
      .select("post_id")
      .eq("user_id", userId);
    if (data) setUserUpvotes(new Set(data.map((u) => u.post_id)));
  };

  React.useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | undefined;
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        fetchUserUpvotes(user.id);
      }
      fetchPosts();
      fetchTrendingTopics();
      channel = supabase
        .channel(`community_posts_feed_${Date.now()}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "community_posts" },
          () => {
            fetchPosts();
            fetchTrendingTopics();
          },
        )
        .subscribe();
    };
    init();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // Handle local image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setAiRejection(null);
  };

  const handleUpvote = async (postId: string) => {
    if (!currentUserId) return;
    const supabase = createClient();
    const alreadyUpvoted = userUpvotes.has(postId);
    if (alreadyUpvoted) {
      await supabase
        .from("post_upvotes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", currentUserId);
      setUserUpvotes((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    } else {
      await supabase
        .from("post_upvotes")
        .insert({ post_id: postId, user_id: currentUserId });
      setUserUpvotes((prev) => new Set([...prev, postId]));
    }
    fetchPosts();
  };

  /**
   * Post Submit with Supabase Private Storage & Google Gemini 2.5 Flash Vision AI Pipeline
   */
  const handleCreatePost = async () => {
    if (!form.title.trim() || !form.content.trim() || !currentUserId) return;

    setSaving(true);
    setScanningAI(true);
    setAiRejection(null);

    try {
      let finalImageUrl: string | undefined = undefined;

      // 1. If an image is selected, upload to Supabase Storage or convert to data URL for Gemini scanning
      if (selectedImageFile && imagePreviewUrl) {
        const supabase = createClient();
        const fileExt = selectedImageFile.name.split(".").pop();
        const fileName = `${currentUserId}_${Date.now()}.${fileExt}`;
        const filePath = `community-media/${fileName}`;

        // Attempt upload to Supabase Storage bucket 'community-media'
        const { error: uploadErr } = await supabase.storage
          .from("community-media")
          .upload(filePath, selectedImageFile);

        if (!uploadErr) {
          const { data: publicUrlData } = supabase.storage
            .from("community-media")
            .getPublicUrl(filePath);
          finalImageUrl = publicUrlData?.publicUrl;
        } else {
          // Fallback to data URL
          finalImageUrl = imagePreviewUrl;
        }
      }

      // 2. Call pre-publish Google Gemini 2.5 Flash Vision AI moderation API
      const res = await fetch("/api/community/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
          imageUrl: finalImageUrl || undefined,
          imageBase64: imagePreviewUrl || undefined,
        }),
      });

      const data = await res.json();
      setScanningAI(false);

      const isBlocked = !data?.isAllowed || data?.blocked === true;

      if (isBlocked) {
        // Post is BLOCKED because text or image is not medically relevant or safety error
        console.warn("[Client Post Creation] Post BLOCKED by AI Moderation:", data?.reason);
        setAiRejection({
          blocked: true,
          reason:
            data?.reason ||
            "Uploaded content is not relevant to medical symptoms, health history, or clinical topics. Meddit requires all posts and images to be medically focused.",
          category: data?.recommendedAction,
        });
        setSaving(false);
        return; // BLOCK SUBMISSION!
      }

      // 3. Save post in Supabase with attached image and category
      const supabase = createClient();
      const contentToSave = finalImageUrl
        ? `${form.content.trim()}\n\n![Clinical Attachment](${finalImageUrl})`
        : form.content.trim();

      const { error } = await supabase.from("community_posts").insert({
        title: form.title.trim(),
        content: contentToSave,
        category: data?.moderation?.category && categories.includes(data.moderation.category) ? data.moderation.category : form.category,
        author_id: currentUserId,
        upvotes: 0,
      });

      if (!error) {
        setShowModal(false);
        setForm({ title: "", content: "", category: "General", type: "General" });
        setSelectedImageFile(null);
        setImagePreviewUrl(null);
        setAiRejection(null);
        fetchPosts();
      } else {
        alert(`Failed to save post: ${error.message}`);
      }
    } catch (err: unknown) {
      console.error("AI post validation error:", err);
      // Fallback submission if API call fails
      const supabase = createClient();
      const contentToSave = imagePreviewUrl
        ? `${form.content.trim()}\n\n![Clinical Attachment](${imagePreviewUrl})`
        : form.content.trim();

      const { error } = await supabase.from("community_posts").insert({
        title: form.title.trim(),
        content: contentToSave,
        category: form.category,
        author_id: currentUserId,
        upvotes: 0,
      });
      if (!error) {
        setShowModal(false);
        setForm({ title: "", content: "", category: "General", type: "General" });
        setSelectedImageFile(null);
        setImagePreviewUrl(null);
        fetchPosts();
      }
    } finally {
      setSaving(false);
      setScanningAI(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason || !reportModal.postId || !currentUserId) return;
    setReportSubmitting(true);
    const supabase = createClient();
    await supabase.from("post_reports").insert({
      post_id: reportModal.postId,
      reported_by: currentUserId,
      reason: reportReason,
    });
    setReportSubmitting(false);
    setReportSuccess(true);
    setTimeout(() => {
      setReportModal({ open: false, postId: null });
      setReportReason("");
      setReportSuccess(false);
    }, 2000);
  };

  // Filter + Sort + Search
  let filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  if (searchQuery.trim()) {
    filteredPosts = filteredPosts.filter(
      (p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  if (sortBy === "upvotes") {
    filteredPosts = [...filteredPosts].sort(
      (a, b) =>
        (b.post_upvotes?.[0]?.count || 0) - (a.post_upvotes?.[0]?.count || 0),
    );
  }
  if (sortBy === "comments") {
    filteredPosts = [...filteredPosts].sort(
      (a, b) => (b.comments?.[0]?.count || 0) - (a.comments?.[0]?.count || 0),
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header (No Notification Bell) */}
      <RedditHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreatePostClick={() => {
          setAiRejection(null);
          setShowModal(true);
        }}
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main 3-Column Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_310px] gap-5 items-start">
          
          {/* Left Navigation Sidebar */}
          <div className="hidden md:block sticky top-20">
            <RedditLeftSidebar
              activeCategory={activeCategory}
              onCategorySelect={setActiveCategory}
            />
          </div>

          {/* Center Main Feed */}
          <div className="space-y-4 min-w-0">

            {/* Reddit Top Post Composer Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-650 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                m/
              </div>
              <input
                type="text"
                readOnly
                onClick={() => {
                  setAiRejection(null);
                  setShowModal(true);
                }}
                placeholder="Create Post in m/meddit..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 cursor-pointer rounded-full px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700 transition-colors shadow-inner"
              />
              <button
                onClick={() => {
                  setAiRejection(null);
                  setShowModal(true);
                }}
                className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
                title="Add Clinical Media"
              >
                🖼️
              </button>
            </div>

            {/* Sort & Feed Category Bar */}
            {/* Filter & Sort Action Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 sm:p-2.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setSortBy("latest")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    sortBy === "latest"
                      ? "bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 font-semibold border border-slate-200 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Hot / New</span>
                </button>
                <button
                  onClick={() => setSortBy("upvotes")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    sortBy === "upvotes"
                      ? "bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 font-semibold border border-slate-200 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Top Voted</span>
                </button>
                <button
                  onClick={() => setSortBy("comments")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    sortBy === "comments"
                      ? "bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 font-semibold border border-slate-200 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Most Discussed</span>
                </button>
              </div>

              {/* Active Category Tag */}
              {activeCategory !== "All" && (
                <span className="hidden sm:inline-flex text-xs font-medium text-teal-700 dark:text-teal-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                  m/{activeCategory}
                </span>
              )}
            </div>

            {/* Posts List */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse h-40" />
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="text-4xl">🩺</div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">No medical posts in this feed</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Be the first to share a clinical inquiry or symptom report in m/{activeCategory}!
                </p>
                <button
                  onClick={() => {
                    setAiRejection(null);
                    setShowModal(true);
                  }}
                  className="px-4 py-2 bg-teal-600 text-white font-medium text-xs rounded-lg shadow-xs hover:bg-teal-700 transition-colors"
                >
                  + Create First Post
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPosts.map((post) => {
                  // Extract image markdown if present
                  const imgMatch = post.content.match(/!\[.*?\]\((.*?)\)/);
                  const imageUrl = imgMatch ? imgMatch[1] : undefined;
                  const cleanText = post.content.replace(/!\[.*?\]\((.*?)\)/, "").trim();

                  return (
                    <PostCard
                      key={post.id}
                      postId={post.id}
                      author={{
                        username: post.author?.name || "Anonymous Patient",
                        role: post.author?.role || "patient",
                      }}
                      timeAgo={formatTime(post.created_at)}
                      title={post.title}
                      content={cleanText}
                      imageUrl={imageUrl}
                      upvotes={post.post_upvotes?.[0]?.count || 0}
                      commentsCount={post.comments?.[0]?.count || 0}
                      tags={post.category ? [post.category] : ["General"]}
                      category={post.category || "General"}
                      isUpvoted={userUpvotes.has(post.id)}
                      onUpvote={() => handleUpvote(post.id)}
                      onReport={() => setReportModal({ open: true, postId: post.id })}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Sidebar Widget */}
          <div className="hidden lg:block sticky top-20">
            <RedditRightSidebar
              trendingTopics={trendingTopics}
              onTopicClick={(tag) => setActiveCategory(tag)}
              onCreatePostClick={() => {
                setAiRejection(null);
                setShowModal(true);
              }}
              livePostCount={posts.length}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl z-10 overflow-y-auto border-r border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-extrabold text-slate-900 dark:text-white text-base">m/meddit Navigation</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <RedditLeftSidebar
              activeCategory={activeCategory}
              onCategorySelect={(cat) => {
                setActiveCategory(cat);
                setIsMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* POST COMPOSER MODAL WITH GOOGLE GEMINI 2.5 VISION SCANNER */}
      {/* ============================================================ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                  m/
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Create Post on Meddit</h2>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1">
                    <span>🤖</span> Google Gemini 2.5 Flash Vision AI Guard
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setAiRejection(null);
                  setSelectedImageFile(null);
                  setImagePreviewUrl(null);
                }}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Format Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Post Format
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {postTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setForm({ ...form, type })}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        form.type === type
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subreddit / Category Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Subcommunity (m/ namespace)
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      m/{cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Post Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Post Title *{" "}
                  <span className="text-slate-400 font-normal">
                    ({form.title.length}/120)
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={120}
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                    setAiRejection(null);
                  }}
                  placeholder="e.g. Symptoms of rash or prescription query..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-slate-400"
                />
              </div>

              {/* Post Content Body */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Medical Details / Symptoms / Question *{" "}
                  <span className="text-slate-400 font-normal">
                    ({form.content.length}/2000)
                  </span>
                </label>
                <textarea
                  maxLength={2000}
                  value={form.content}
                  onChange={(e) => {
                    setForm({ ...form, content: e.target.value });
                    setAiRejection(null);
                  }}
                  placeholder="Share details regarding symptoms, clinical history, or healthcare inquiries..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs leading-relaxed bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none placeholder-slate-400"
                />
              </div>

              {/* Clinical Image Attachment Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Attach Medical Photo / Report (Scanned by Gemini 2.5 Flash Vision AI)
                </label>

                {imagePreviewUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 space-y-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="w-full max-h-48 object-cover rounded-lg"
                    />
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-teal-600 dark:text-teal-400 font-semibold">📷 Photo Selected</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImageFile(null);
                          setImagePreviewUrl(null);
                        }}
                        className="text-red-500 hover:underline font-semibold"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border border-dashed border-slate-300 dark:border-slate-800 hover:border-teal-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-950">
                    <span className="text-2xl mb-1">📷</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click to attach clinical image</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">X-rays, rashes, reports, or lab results (Scanned by Gemini AI)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Scanning State Spinner */}
              {scanningAI && (
                <div className="p-3 bg-teal-950/80 border border-teal-800 rounded-xl flex items-center gap-3 animate-pulse">
                  <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="text-xs font-bold text-teal-300">
                    Google Gemini 2.5 Flash Vision is scanning text & image for medical relevance...
                  </span>
                </div>
              )}

              {/* AI Rejection Warning Banner */}
              {aiRejection?.blocked && (
                <div className="p-4 bg-red-950/60 border border-red-800 rounded-2xl flex items-start gap-3 animate-in fade-in">
                  <span className="text-2xl shrink-0">🚫</span>
                  <div className="text-xs text-red-200 space-y-1">
                    <p className="font-extrabold text-sm text-red-400">Post Blocked — Content Not Medically Relevant</p>
                    <p className="leading-relaxed font-medium">{aiRejection.reason}</p>
                    <div className="mt-2 p-2 bg-slate-950/80 rounded-lg border border-red-800/80 text-[11px] font-semibold text-red-300">
                      💡 <strong>Meddit Policy:</strong> All posts and images must pertain to medical health, symptoms, or clinical history. Please revise your photo or text before publishing.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-5 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowModal(false);
                  setAiRejection(null);
                  setSelectedImageFile(null);
                  setImagePreviewUrl(null);
                }}
                className="flex-1 py-2.5 rounded-full border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={saving || scanningAI || !form.title.trim() || !form.content.trim()}
                className="flex-1 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-medium text-xs transition-colors shadow-xs"
              >
                {scanningAI ? "Gemini Scanning..." : saving ? "Publishing..." : "Post to m/meddit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* REPORT MODAL */}
      {/* ============================================================ */}
      {reportModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-slate-800 text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>🚩</span> Report Post
              </h2>
              <button
                onClick={() => {
                  setReportModal({ open: false, postId: null });
                  setReportReason("");
                }}
                className="text-slate-400 hover:text-white font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {reportSuccess ? (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">✅</p>
                <p className="font-extrabold text-white">Report Submitted</p>
                <p className="text-xs text-slate-400 mt-1">
                  Thank you. Our medical moderators will review this content.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-400 mb-4">
                  Select the primary reason for reporting this post:
                </p>
                <div className="space-y-2 mb-5">
                  {REPORT_REASONS.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setReportReason(reason)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-colors border ${
                        reportReason === reason
                          ? "bg-red-950/60 border-red-800 text-red-300 font-extrabold"
                          : "border-slate-800 text-slate-300 hover:bg-slate-800 font-medium"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleReport}
                  disabled={!reportReason || reportSubmitting}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 text-white font-extrabold rounded-full text-xs transition-all shadow-xs"
                >
                  {reportSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
