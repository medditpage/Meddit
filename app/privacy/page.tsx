"use client";

// app/privacy/page.tsx
// Meddit Privacy & Security Overview

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 h-16 px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 via-teal-500 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
            m/
          </div>
          <span className="font-extrabold text-white text-xl tracking-tight">
            meddit<span className="text-teal-400">.ai</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => router.push("/login")}
            className="text-xs font-extrabold bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-full transition-all shadow-xs"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Privacy & Security Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold">
            🔒 End-to-End Clinical Data Security
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Privacy & Data Security <br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
              Built for Health Confidentiality.
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Meddit employs strict client-side encryption, private medical record storage, and Google Gemini AI moderation safeguards to ensure your health information remains 100% private and protected.
          </p>
        </div>

        {/* Security Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg">
              🔐
            </div>
            <h3 className="font-extrabold text-white text-lg">End-to-End Encrypted DMs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct messages between patients and doctors are encrypted using client-side cryptographic keys stored securely in browser local storage. Only authorized session participants can decrypt conversation content.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
              🤖
            </div>
            <h3 className="font-extrabold text-white text-lg">AI Content Safety Guard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini 2.5 Vision AI automatically screens clinical community posts and attachments prior to publishing to prevent patient identifying data leaks, non-medical spam, or unsafe medical misinformation.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg">
              👨‍⚕️
            </div>
            <h3 className="font-extrabold text-white text-lg">Verified Practitioner Licensing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Doctor profiles undergo MCI/NMC medical license verification and identity checks before earning the Verified Physician badge, guaranteeing authenticated medical credentials.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
              🛡️
            </div>
            <h3 className="font-extrabold text-white text-lg">HIPAA & ABHA Standards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Patient health records, lab documents, and clinical history are isolated in private Supabase storage buckets accessed via short-lived signed URLs.
            </p>
          </div>
        </div>

        {/* Deep Dive Security Policy Details */}
        <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-black text-white">Meddit Data Handling Commitments</h2>
          
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div>
              <h4 className="font-bold text-teal-400 text-sm">1. Patient Ownership of Medical Records</h4>
              <p className="text-slate-400 mt-1">
                You retain full ownership of your uploaded medical history, prescriptions, and symptom logs. You may update or request removal of your account data at any time through account settings.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-teal-400 text-sm">2. AI Advisory Scope</h4>
              <p className="text-slate-400 mt-1">
                AI outputs—including symptom triage summaries, moderation pre-scans, and doctor reply drafts—are advisory and supplementary. Physician judgment is required prior to taking clinical decisions.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-teal-400 text-sm">3. Zero Selling of Personal Health Data</h4>
              <p className="text-slate-400 mt-1">
                Meddit will never monetize, sell, or license patient identities, medical queries, or health records to third-party advertisers or insurance providers.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center flex-wrap gap-4">
            <span className="text-xs text-slate-500 font-medium">Last updated: July 2026</span>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-full transition-colors"
            >
              ← Return to Home Page
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
