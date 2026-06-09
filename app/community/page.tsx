"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { createClient } from "@/utils/supabase/client";
import { PostCard } from "@/components/community/PostCard";
import { TrendingTopicsList } from "@/components/community/TrendingTopics";

// ============================================================
// MEDICAL RELEVANCE RULES
// ============================================================
const MEDICAL_RULES: Record<string, string[]> = {
  professionals: [
    "doctor",
    "physician",
    "surgeon",
    "nurse",
    "specialist",
    "cardiologist",
    "neurologist",
    "pediatrician",
    "oncologist",
    "dermatologist",
    "psychiatrist",
    "orthopedic",
    "gynecologist",
    "urologist",
    "radiologist",
    "anesthesiologist",
    "pharmacist",
    "therapist",
    "dentist",
    "ophthalmologist",
    "endocrinologist",
    "nephrologist",
    "gastroenterologist",
    "pulmonologist",
    "hematologist",
    "rheumatologist",
    "pathologist",
    "immunologist",
    "vaidya",
    "ayurvedacharya",
  ],
  symptoms: [
    "pain",
    "fever",
    "cough",
    "fatigue",
    "nausea",
    "vomiting",
    "dizziness",
    "headache",
    "breathlessness",
    "swelling",
    "bleeding",
    "rash",
    "itching",
    "weakness",
    "chest pain",
    "back pain",
    "joint pain",
    "abdominal pain",
    "diarrhea",
    "constipation",
    "insomnia",
    "anxiety",
    "depression",
    "numbness",
    "tingling",
    "palpitations",
    "weight loss",
    "weight gain",
    "appetite loss",
    "shortness of breath",
    "burning",
    "inflammation",
    "edema",
    "seizure",
    "bukhar",
    "dard",
    "khasi",
    "ulti",
    "chakkar",
    "kamzori",
    "sujan",
    "suggest",
    "help",
    "advice",
    "problem",
    "issue",
    "suffering",
    "relief",
  ],
  diseases: [
    "diabetes",
    "hypertension",
    "cancer",
    "tuberculosis",
    "asthma",
    "covid",
    "heart disease",
    "stroke",
    "arthritis",
    "anemia",
    "thyroid",
    "kidney disease",
    "liver disease",
    "pneumonia",
    "dengue",
    "malaria",
    "typhoid",
    "cholera",
    "hepatitis",
    "hiv",
    "aids",
    "alzheimer",
    "parkinson",
    "epilepsy",
    "psoriasis",
    "eczema",
    "migraine",
    "osteoporosis",
    "obesity",
    "pcod",
    "pcos",
    "ibs",
    "crohn",
    "colitis",
    "appendicitis",
    "hernia",
    "cataract",
    "glaucoma",
    "infection",
    "allergy",
    "autoimmune",
    "sepsis",
    "fracture",
    "tumor",
    "bp",
    "sugar",
    "pressure",
    "madhumeh",
    "tb",
    "corona",
  ],
  treatments: [
    "surgery",
    "operation",
    "chemotherapy",
    "radiation",
    "dialysis",
    "transplant",
    "vaccination",
    "injection",
    "physiotherapy",
    "rehabilitation",
    "prescription",
    "medication",
    "dose",
    "tablet",
    "capsule",
    "syrup",
    "ointment",
    "inhaler",
    "insulin",
    "biopsy",
    "endoscopy",
    "colonoscopy",
    "angioplasty",
    "bypass",
    "laser",
    "therapy",
    "treatment",
    "remedy",
    "ayurveda",
    "homeopathy",
    "yoga",
    "meditation",
    "dawa",
    "dawai",
    "ilaaj",
    "upchar",
    "aushadhi",
  ],
  diagnostics: [
    "blood test",
    "urine test",
    "mri",
    "ct scan",
    "xray",
    "x-ray",
    "ultrasound",
    "ecg",
    "ekg",
    "echo",
    "biopsy",
    "culture",
    "hemoglobin",
    "hba1c",
    "cholesterol",
    "creatinine",
    "thyroid test",
    "liver function",
    "kidney function",
    "cbc",
    "crp",
    "esr",
    "platelet",
    "glucose",
    "insulin test",
    "vitamin d",
    "vitamin b12",
    "calcium",
    "potassium",
    "sodium",
    "lipid profile",
    "report",
    "test result",
    "diagnosis",
    "lab",
    "pathology",
    "radiology",
  ],
  settings: [
    "hospital",
    "clinic",
    "pharmacy",
    "icu",
    "ot",
    "emergency",
    "opd",
    "ward",
    "health center",
    "dispensary",
    "nursing home",
    "medical college",
    "aiims",
    "pgi",
    "government hospital",
    "health insurance",
    "abha",
    "ayushman",
    "healthcare",
    "medical",
    "health",
  ],
  bodyParts: [
    "heart",
    "brain",
    "lung",
    "kidney",
    "liver",
    "stomach",
    "intestine",
    "bone",
    "muscle",
    "nerve",
    "blood",
    "artery",
    "vein",
    "skin",
    "eye",
    "ear",
    "nose",
    "throat",
    "spine",
    "joint",
    "pancreas",
    "thyroid",
    "uterus",
    "prostate",
    "bladder",
    "colon",
    "esophagus",
    "trachea",
    "dil",
    "dimag",
    "haddi",
    "khoon",
    "aankh",
    "kaan",
    "pet",
    "gurda",
  ],
};

const checkMedicalRelevance = (title: string, content: string) => {
  const text = `${title} ${content}`.toLowerCase();
  let score = 0;
  let matchedCategories: string[] = [];

  Object.entries(MEDICAL_RULES).forEach(([category, keywords]) => {
    const matches = keywords.filter((k) => text.includes(k));
    if (matches.length > 0) {
      score += matches.length * 10;
      matchedCategories.push(category);
    }
  });

  score = Math.min(score, 100);

  return {
    relevant: score >= 10,
    score,
    categories: matchedCategories,
    reason:
      score < 20
        ? "Post doesn't seem medically relevant. Please share health-related content only."
        : score < 50
          ? "Post seems partially relevant — are you sure this is medical content?"
          : "Medical content verified",
  };
};

// ============================================================
// REPORT REASONS
// ============================================================
const REPORT_REASONS = [
  "Spam or promotional content",
  "Not medically relevant",
  "Misinformation / fake advice",
  "Offensive or inappropriate",
  "Patient privacy violation",
  "Other",
];

export default function CommunityPage() {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [userUpvotes, setUserUpvotes] = React.useState<Set<string>>(new Set());
  const [trendingTopics, setTrendingTopics] = React.useState<any[]>([]);
  const [activeCategory, setActiveCategory] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<"latest" | "upvotes" | "comments">(
    "latest",
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [form, setForm] = React.useState({
    title: "",
    content: "",
    category: "General",
    type: "General",
  });
  const [saving, setSaving] = React.useState(false);
  const [relevanceWarning, setRelevanceWarning] = React.useState<string | null>(
    null,
  );

  // Report modal state
  const [reportModal, setReportModal] = React.useState<{
    open: boolean;
    postId: string | null;
  }>({ open: false, postId: null });
  const [reportReason, setReportReason] = React.useState("");
  const [reportSubmitting, setReportSubmitting] = React.useState(false);
  const [reportSuccess, setReportSuccess] = React.useState(false);

  const categories = [
    "All",
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
    if (data) setUserUpvotes(new Set(data.map((u) => u.post_id)));
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

    // ML Relevance Check
    const result = checkMedicalRelevance(form.title, form.content);

    if (!result.relevant) {
      setRelevanceWarning(result.reason);
      return;
    }

    if (result.score < 50) {
      setRelevanceWarning(result.reason);
      // Still allow posting after warning — user can proceed
    }

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
      setForm({ title: "", content: "", category: "General", type: "General" });
      setRelevanceWarning(null);
      fetchPosts();
    }
    setSaving(false);
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

  if (sortBy === "upvotes")
    filteredPosts = [...filteredPosts].sort(
      (a, b) =>
        (b.post_upvotes?.[0]?.count || 0) - (a.post_upvotes?.[0]?.count || 0),
    );
  if (sortBy === "comments")
    filteredPosts = [...filteredPosts].sort(
      (a, b) => (b.comments?.[0]?.count || 0) - (a.comments?.[0]?.count || 0),
    );

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
        {/* Left Sidebar */}
        <aside className="hidden md:block space-y-4">
          <TrendingTopicsList
            topics={trendingTopics}
            onTopicClick={(id) => {
              const topic = trendingTopics.find((t) => t.id === id);
              if (topic) setActiveCategory(topic.title);
            }}
          />
          {/* Post Types Legend */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Post Types
            </h3>
            <div className="space-y-1.5 text-xs text-slate-500">
              <p>❓ Question — Ask anything</p>
              <p>🔬 Case Study — Share a case</p>
              <p>📢 Announcement — Updates</p>
              <p>💊 Drug Info — Medicine info</p>
              <p>🚨 Emergency Alert — Urgent</p>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="space-y-4">
          {/* Header */}
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

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              🔍
            </span>
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

          {/* Sort Options */}
          <div className="flex gap-2">
            {(["latest", "upvotes", "comments"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                  sortBy === s
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {s === "latest"
                  ? "🕐 Latest"
                  : s === "upvotes"
                    ? "⬆️ Top"
                    : "💬 Most Discussed"}
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
              <p className="text-slate-700 font-semibold">No posts found</p>
              <p className="text-slate-400 text-sm mt-1">
                Be the first to post!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="relative group">
                <PostCard
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
                {/* Report Button */}
                <button
                  onClick={() =>
                    setReportModal({ open: true, postId: post.id })
                  }
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-400 hover:text-red-500 bg-white border border-slate-200 px-2 py-1 rounded-lg"
                >
                  🚩 Report
                </button>
              </div>
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
              <li>🚫 No spam or promotions</li>
              <li>⚕️ Medical content only</li>
            </ul>
          </div>
          <div className="bg-teal-50 rounded-2xl border border-teal-100 p-5">
            <h3 className="font-bold text-teal-900 mb-1">Active Posts</h3>
            <p className="text-3xl font-bold text-teal-600">{posts.length}</p>
            <p className="text-sm text-teal-600 mt-1">posts in community</p>
          </div>
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
            <h3 className="font-bold text-amber-900 mb-1">🤖 AI Moderation</h3>
            <p className="text-xs text-amber-700 mt-1">
              All posts are checked for medical relevance before publishing.
            </p>
          </div>
        </aside>
      </div>

      {/* ============================================================ */}
      {/* CREATE POST MODAL */}
      {/* ============================================================ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Create Post</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setRelevanceWarning(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Post Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Post Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {postTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setForm({ ...form, type })}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        form.type === type
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
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

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Title *{" "}
                  <span className="text-slate-300 font-normal">
                    {form.title.length}/100
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                    setRelevanceWarning(null);
                  }}
                  placeholder="e.g. Managing hypertension in elderly patients..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Content *{" "}
                  <span className="text-slate-300 font-normal">
                    {form.content.length}/2000
                  </span>
                </label>
                <textarea
                  maxLength={2000}
                  value={form.content}
                  onChange={(e) => {
                    setForm({ ...form, content: e.target.value });
                    setRelevanceWarning(null);
                  }}
                  placeholder="Share your clinical insight, case study, or question..."
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* AI Relevance Warning */}
              {relevanceWarning && (
                <div
                  className={`p-3 rounded-xl text-sm font-medium flex items-start gap-2 ${
                    relevanceWarning.includes("doesn't seem")
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  <span>
                    {relevanceWarning.includes("doesn't seem") ? "❌" : "⚠️"}
                  </span>
                  <div>
                    <p className="font-semibold">
                      {relevanceWarning.includes("doesn't seem")
                        ? "Post Blocked"
                        : "Warning"}
                    </p>
                    <p className="font-normal mt-0.5">{relevanceWarning}</p>
                    {!relevanceWarning.includes("doesn't seem") && (
                      <button
                        onClick={() => {
                          setRelevanceWarning(null);
                          setSaving(false);
                          handleCreatePost();
                        }}
                        className="mt-2 text-xs underline"
                      >
                        Post anyway
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* AI Badge */}
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg">
                <span>🤖</span>
                <span>AI checks medical relevance before publishing</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setRelevanceWarning(null);
                }}
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

      {/* ============================================================ */}
      {/* REPORT MODAL */}
      {/* ============================================================ */}
      {reportModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                🚩 Report Post
              </h2>
              <button
                onClick={() => {
                  setReportModal({ open: false, postId: null });
                  setReportReason("");
                }}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {reportSuccess ? (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">✅</p>
                <p className="font-semibold text-slate-900">Report Submitted</p>
                <p className="text-sm text-slate-500 mt-1">
                  Our team will review this post.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-500 mb-4">
                  Why are you reporting this post?
                </p>
                <div className="space-y-2 mb-6">
                  {REPORT_REASONS.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setReportReason(reason)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors border ${
                        reportReason === reason
                          ? "bg-red-50 border-red-300 text-red-700 font-semibold"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleReport}
                  disabled={!reportReason || reportSubmitting}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  {reportSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
