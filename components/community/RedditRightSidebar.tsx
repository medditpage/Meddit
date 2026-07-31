"use client";

// components/community/RedditRightSidebar.tsx
// Restrained Light/Dark community right sidebar component (Apple-style)

import * as React from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, ShieldCheck, TrendingUp, Bot, Plus } from "lucide-react";

interface TrendingTopicItem {
  id: string;
  category: string;
  title: string;
  postsCount: string;
  tag?: string;
  count?: number;
}

interface RedditRightSidebarProps {
  trendingTopics?: TrendingTopicItem[];
  onTopicClick?: (tag: string) => void;
  onCreatePostClick?: () => void;
  livePostCount?: number;
}

export function RedditRightSidebar({
  trendingTopics = [],
  onTopicClick,
  onCreatePostClick,
  livePostCount = 0,
}: RedditRightSidebarProps) {
  const router = useRouter();

  return (
    <aside className="w-full space-y-4 text-slate-800 dark:text-slate-200 font-sans">
      {/* Community About Card (Solid Apple Surface, No Gradient Banner) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            m/
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">m/meddit</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Verified Clinical Community</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          The verified healthcare community. Patients discuss symptoms & history; certified doctors offer peer-reviewed clinical insights.
        </p>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{livePostCount ?? 0} Active</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Posts</p>
          </div>
          <div>
            <p className="text-sm font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400" />
              Online
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">AI Guard</p>
          </div>
        </div>

        {/* Create Post Button (Teal Primary Accent) */}
        <button
          onClick={onCreatePostClick}
          className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Post</span>
        </button>
      </div>

      {/* AI Triage Banner Card (Solid Card) */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <Stethoscope className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs text-slate-900 dark:text-white">AI Symptom Triage</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug font-normal">
          Map symptoms to recommended medical specialties before booking consultations.
        </p>
        <button
          onClick={() => router.push("/appointments")}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium text-xs rounded-lg transition-colors"
        >
          Run Symptom Triage →
        </button>
      </div>

      {/* Community Rules Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Community Guidelines</span>
        </h4>
        <ol className="space-y-2.5 text-xs divide-y divide-slate-100 dark:divide-slate-800">
          <li className="pt-2 first:pt-0">
            <span className="font-semibold text-slate-800 dark:text-slate-200">1. Medical Relevance Enforced</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal">Posts and clinical images are scanned in real-time. Non-medical content is automatically filtered.</p>
          </li>
          <li className="pt-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">2. Verified Professional Badges</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal">Certified doctors undergo MCI/NMC verification before receiving physician status.</p>
          </li>
          <li className="pt-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">3. Emergency Services</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal">For acute medical emergencies, immediately dial national emergency dispatch (112/911).</p>
          </li>
        </ol>
      </div>

      {/* Trending Medical Topics */}
      {trendingTopics.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Trending Specialties</span>
          </h4>
          <div className="space-y-1">
            {trendingTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => onTopicClick?.(topic.title)}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    m/{topic.title}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{topic.postsCount} posts</p>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 font-semibold">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
