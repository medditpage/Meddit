"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";
import { PostCard } from "@/components/community/PostCard";
import { TrendingTopicsList } from "@/components/community/TrendingTopics";

export default function CommunityPage() {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [userUpvotes, setUserUpvotes] = React.useState<Set<string>>(new Set());
  const [trendingTopics, setTrendingTopics] = React.useState<any[]>([]);
  const [activeCategory, setActiveCategory] = React.useState<string>("All");
  const [form, setForm] = React.useState({
    title: "",
    content: "",
    category: "General",
  });
  const [saving, setSaving] = React.useState(false);

  const categories = [
    "All",
    "General",
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Oncology",
    "Orthopedics",
    "Dermatology",
  ];

  const fetchPosts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_posts")
      .select(
        `
        *,
        author:profiles(name, avatar_initials),
        comments(count),
        post_upvotes(count)
      `,
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
      // Count posts per category
      const counts: Record<string, number> = {};
      data.forEach((p) => {
        counts[p.category] = (counts[p.category] || 0) + 1;
      });
      const topics = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([category, count], i) => ({
          id: String(i),
          category: "Medical",
          title: category,
          postsCount: String(count),
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
    if (data) {
      setUserUpvotes(new Set(data.map((u) => u.post_id)));
    }
  };

 React.useEffect(() => {
   const supabase = createClient();
   let channel: any;

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

  const handleCreatePost = async () => {
    if (!form.title || !form.content || !currentUserId) return;
    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase.from("community_posts").insert({
      title: form.title,
      content: form.content,
      category: form.category,
      author_id: currentUserId,
      upvotes: 0,
    });

    if (!error) {
      setShowModal(false);
      setForm({ title: "", content: "", category: "General" });
      fetchPosts();
    }
    setSaving(false);
  };

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

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

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_280px] gap-6 max-w-7xl mx-auto">
        {/* Left Sidebar — Trending Topics */}
        <aside className="hidden md:block">
          <TrendingTopicsList
            topics={trendingTopics}
            onTopicClick={(id) => {
              const topic = trendingTopics.find((t) => t.id === id);
              if (topic) setActiveCategory(topic.title);
            }}
          />
        </aside>

        {/* Main Feed */}
        <main className="space-y-4">
          {/* Header + Create Post Button */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">
              Community Feed
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              + New Post
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? "bg-teal-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-teal-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-slate-100 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <p className="text-3xl mb-2">💬</p>
              <p className="text-slate-700 font-semibold">No posts yet</p>
              <p className="text-slate-400 text-sm mt-1">
                Be the first to post in this category!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                author={{
                  username: post.author?.name || "Anonymous",
                  reliabilityRating: "4.5",
                }}
                timeAgo={formatTime(post.created_at)}
                title={post.title}
                content={post.content}
                upvotes={post.post_upvotes?.[0]?.count || 0}
                commentsCount={post.comments?.[0]?.count || 0}
                tags={[post.category || "General"]}
                isUpvoted={userUpvotes.has(post.id)}
                onUpvote={() => handleUpvote(post.id)}
                postId={post.id}
              />
            ))
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-900 mb-2">
              Community Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>🩺 Share verified clinical insights</li>
              <li>🤝 Be respectful to colleagues</li>
              <li>📋 Anonymize patient data</li>
              <li>✅ Cite sources when possible</li>
            </ul>
          </div>
          <div className="bg-teal-50 rounded-2xl border border-teal-100 p-5">
            <h3 className="font-bold text-teal-900 mb-1">Active Members</h3>
            <p className="text-3xl font-bold text-teal-600">{posts.length}</p>
            <p className="text-sm text-teal-600 mt-1">posts this session</p>
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Create Post</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {categories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Best practices for managing hypertension..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Content *
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  placeholder="Share your clinical insight, case study, or question..."
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={saving || !form.title || !form.content}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold text-sm transition-colors"
              >
                {saving ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
