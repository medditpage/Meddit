"use client";

// components/community/RedditLeftSidebar.tsx
// Restrained Light/Dark community left sidebar component (Apple-Style Neutral Icons)

import * as React from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Home, TrendingUp, Folder, Calendar, MessageSquare, Users, LayoutDashboard } from "lucide-react";

interface RedditLeftSidebarProps {
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  className?: string;
}

export function RedditLeftSidebar({
  activeCategory,
  onCategorySelect,
  className = "",
}: RedditLeftSidebarProps) {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const isDoctor = user?.role === "doctor";

  const communities = [
    { name: "All", label: "m/All (Global Feed)" },
    { name: "General", label: "m/GeneralMedicine" },
    { name: "Cardiology", label: "m/Cardiology" },
    { name: "Neurology", label: "m/Neurology" },
    { name: "Pediatrics", label: "m/Pediatrics" },
    { name: "Oncology", label: "m/Oncology" },
    { name: "Orthopedics", label: "m/Orthopedics" },
    { name: "Dermatology", label: "m/Dermatology" },
    { name: "Psychiatry", label: "m/Psychiatry" },
    { name: "Gynecology", label: "m/Gynecology" },
    { name: "Ayurveda", label: "m/Ayurveda" },
  ];

  return (
    <aside className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 space-y-5 text-slate-800 dark:text-slate-200 rounded-2xl shadow-xs font-sans ${className}`}>
      {/* Feeds Section */}
      <div className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 mb-1">
          Feeds
        </p>
        <button
          onClick={() => onCategorySelect("All")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeCategory === "All"
              ? "bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 font-semibold"
              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          <Home className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span>Home Feed</span>
        </button>
        <button
          onClick={() => onCategorySelect("All")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <TrendingUp className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span>Popular</span>
        </button>
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* Subreddit Communities Section (Single Neutral Icon Treatment) */}
      <div className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 mb-1">
          m/ Medical Communities
        </p>
        {communities.map((c) => {
          const isSelected = activeCategory === c.name;
          return (
            <button
              key={c.name}
              onClick={() => onCategorySelect(c.name)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 font-semibold"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate">{c.label}</span>
            </button>
          );
        })}
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* Platform Navigation */}
      <div className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 mb-1">
          Healthcare Platform
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => router.push("/doctors")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Users className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span>Find Doctors</span>
        </button>
        <button
          onClick={() => router.push(isDoctor ? "/appointments/doctor" : "/appointments")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span>Appointments</span>
        </button>
        <button
          onClick={() => router.push("/messages")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span>Direct Messages</span>
        </button>
      </div>
    </aside>
  );
}
