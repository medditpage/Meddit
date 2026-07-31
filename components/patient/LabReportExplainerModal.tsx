"use client";

// components/patient/LabReportExplainerModal.tsx
// AI Lab Report Explainer Modal with document upload and abnormal metric highlighting

import * as React from "react";
import { LabReportExplainerOutput } from "@/lib/ai/schemas";

interface LabReportExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LabReportExplainerModal({ isOpen, onClose }: LabReportExplainerModalProps) {
  const [analyzing, setAnalyzing] = React.useState(false);
  const [textContext, setTextContext] = React.useState("");
  const [result, setResult] = React.useState<LabReportExplainerOutput | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai/lab-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textContext }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 flex items-center justify-center font-extrabold text-sm">
              📄
            </span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI Lab Report Explainer</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-sm">
            ✕
          </button>
        </div>

        {!result ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <label className="block font-extrabold text-slate-700 dark:text-slate-300">
                Paste Lab Report Text or Upload Document Notes:
              </label>
              <textarea
                value={textContext}
                onChange={(e) => setTextContext(e.target.value)}
                placeholder="e.g. Total Cholesterol 185 mg/dL, Triglycerides 158 mg/dL (Reference < 150 mg/dL)"
                rows={4}
                className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-full transition-all shadow-xs"
            >
              {analyzing ? "Analyzing Document Parameters..." : "⚡ Analyze Lab Report"}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            {/* Overall Summary */}
            <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800/80 space-y-1 text-xs">
              <span className="font-extrabold text-teal-800 dark:text-teal-300 uppercase block">Report Summary</span>
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{result.overallSummary}</p>
            </div>

            {/* Highlighted Abnormal Values */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Extracted Metrics & Abnormal Values:
              </h4>
              <div className="space-y-2">
                {result.abnormalValues.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      item.status === "High" || item.status === "Critical"
                        ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200"
                    }`}
                  >
                    <div>
                      <span className="font-extrabold text-slate-900 dark:text-white">{item.parameter}: </span>
                      <span className="font-mono font-black">{item.value}</span>
                      <span className="text-[10px] text-slate-500 font-medium ml-2">(Ref: {item.referenceRange})</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{item.explanation}</p>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shrink-0 ${
                        item.status === "High" || item.status === "Critical"
                          ? "bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700"
                          : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions to Ask Doctor */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-extrabold text-slate-900 dark:text-white block">❓ Questions to Ask Your Doctor:</span>
              <ul className="space-y-1 list-disc pl-4 text-slate-600 dark:text-slate-300">
                {result.questionsToAskDoctor.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>

            <div className="text-[10px] text-slate-400 font-medium text-center pt-2 border-t border-slate-100 dark:border-slate-800">
              {result.disclaimer}
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white font-bold text-xs rounded-full transition-colors"
            >
              Analyze Another Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
