"use client";

// components/patient/MedicalTimelinePanel.tsx
// AI Medical Timeline Panel UI Component

import * as React from "react";
import { MedicalTimelineOutput } from "@/lib/ai/schemas";

interface MedicalTimelinePanelProps {
  timeline: MedicalTimelineOutput;
}

export function MedicalTimelinePanel({ timeline }: MedicalTimelinePanelProps) {
  const [showEvidence, setShowEvidence] = React.useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 font-extrabold text-xs flex items-center justify-center border border-teal-200 dark:border-teal-500/40">
            📜
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI Medical Story & Longitudinal Timeline</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Synthesized health story across consultations & lab reports</p>
          </div>
        </div>

        <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40">
          Confidence: {Math.round(timeline.confidence * 100)}%
        </span>
      </div>

      {/* Main Trend Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
        <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
          Longitudinal Health Trend
        </span>
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{timeline.trend}</h4>
        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{timeline.insight}</p>
      </div>

      {/* Anomaly Badge if present */}
      {timeline.anomaly && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/80 text-xs flex items-center justify-between">
          <span className="font-bold text-amber-800 dark:text-amber-300">⚠️ Outlier Insight: {timeline.anomaly}</span>
        </div>
      )}

      {/* Suggested Follow Up Topics */}
      <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800/80 space-y-1.5 text-xs">
        <span className="font-extrabold text-teal-800 dark:text-teal-300 block">💡 Assistive Follow-Up Topics for Doctor Visit:</span>
        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{timeline.suggestedFollowUpTopics}</p>
      </div>

      {/* Expandable Supporting Evidence Records */}
      <div className="pt-2">
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="text-xs font-extrabold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
        >
          {showEvidence ? "Hide Supporting Medical Records ▲" : "Show Supporting Medical Records (Evidence) ▼"}
        </button>

        {showEvidence && (
          <div className="mt-3 space-y-2 animate-in fade-in">
            {timeline.evidence.map((ev, i) => (
              <div key={i} className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono">
                • {ev}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 text-[10px] text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800 text-center">
        This explanation is educational only and is not a substitute for professional medical advice or diagnosis.
      </div>
    </div>
  );
}
