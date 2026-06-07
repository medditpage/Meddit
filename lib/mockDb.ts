export const database = {
  doctors: {
    "1": {
      id: "1",
      name: "Priya Sharma",
      specialty: "Cardiology",
      location: "Prayagraj, India",
      experience: 12,
      rating: 4.8,
      fee: "₹800",
      isVerified: true,
      imageUrl: "",
      metrics: { successRate: "98%", patients: "1.2k+", reliability: "High" },
      bio: "Dr. Priya Sharma is a distinguished cardiologist with over 12 years of experience in managing complex cardiovascular conditions. She specializes in interventional cardiology and preventative heart care.",
      education: ["MD in Cardiology, AIIMS New Delhi", "MBBS, MNNIT Prayagraj"],
    },
  },
  community: {
    trendingTopics: [
      {
        id: "1",
        category: "Cardiology",
        title: "Latest advancements in AI-driven ECG analysis",
        postsCount: "12.4k",
      },
      {
        id: "2",
        category: "General Health",
        title: "Understanding the impact of sedentary lifestyles",
        postsCount: "8.1k",
      },
    ],
    posts: [
      {
        id: "p1",
        author: { username: "dr_rahul_cardio", reliabilityRating: "4.9" },
        timeAgo: "2h ago",
        title: "My experience managing chronic hypertension in urban patients",
        content:
          "After tracking over 500 patients in the last year, I've noticed a significant correlation between early morning walking routines and stable systolic pressure.",
        upvotes: 1240,
        commentsCount: 88,
        tags: ["cardiology", "hypertension"],
        verifiedResponse: {
          text: "Verified Clinical Perspective",
          excerpt:
            "Evidence supports lifestyle intervention as primary management for Stage 1 HTN.",
        },
      },
    ],
  },
};
