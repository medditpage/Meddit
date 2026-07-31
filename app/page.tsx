"use client";

// app/page.tsx - Meddit Landing Page (Apple-Style Refined UI + Light/Dark Parity + Real Clinical Imagery)

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  ShieldCheck,
  Stethoscope,
  Bot,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronDown,
  Activity,
  Users,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = React.useState<number | null>(0);

  const faqs = [
    {
      q: "What is Meddit and how does it work?",
      a: "Meddit is an integrated healthcare ecosystem combining verified practitioner consultations, instant AI pre-visit symptom triage, a moderated medical community (m/meddit), and encrypted patient record management.",
    },
    {
      q: "How does the AI Post & Image Moderation work?",
      a: "All posts and uploaded clinical attachments are scanned by Google Gemini 2.5 Flash Vision AI prior to publication. Non-medical uploads or off-topic posts are automatically blocked to keep community feeds clinical and relevant.",
    },
    {
      q: "Are the doctors on Meddit verified medical practitioners?",
      a: "Yes. Every doctor profile undergoes MCI/NMC medical licensing verification, identity authentication, and specialty licensing before earning the Verified Physician badge.",
    },
    {
      q: "How is my medical data and privacy protected?",
      a: "Direct messages utilize client-side key encryption. Medical records and lab files are saved in isolated storage accessed via short-lived signed URLs. Your files are never scraped or publicly exposed.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* 1. SOLID NAVIGATION HEADER (Universal Light / Dark Support) */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800/80 h-16 px-6 md:px-12 flex items-center justify-between transition-colors">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            m/
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
            meddit<span className="text-teal-600 dark:text-teal-400">.ai</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Features</a>
          <a href="#ai-assistant" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">AI Health Engine</a>
          <Link href="/community" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">m/Community</Link>
          <Link href="/doctors" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Doctors</Link>
          <Link href="/privacy" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Privacy & Security</Link>
          <a href="#faq" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="text-xs font-semibold bg-teal-600 hover:bg-teal-700 dark:hover:bg-teal-500 text-white px-4 py-2 rounded-lg transition-colors shadow-xs"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:py-24 px-6 md:px-12 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-teal-700 dark:text-teal-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Physician Network & AI Symptom Triage</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
              Clinical Healthcare <br />
              <span className="text-teal-600 dark:text-teal-400">Simplified by Intelligence.</span>
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Connect with verified doctors, run instant AI symptom triage, discuss clinical queries in <strong className="text-slate-900 dark:text-slate-200 font-semibold">m/meddit</strong>, and access smart patient history—all in one secure platform.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => router.push("/community")}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 dark:hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-2"
              >
                <span>Explore m/meddit Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => router.push("/doctors")}
                className="px-5 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-medium text-xs rounded-lg transition-colors"
              >
                Find Verified Doctor
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">100%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Verified Physicians</p>
              </div>
              <div>
                <p className="text-lg font-bold text-teal-600 dark:text-teal-400">Gemini 2.5</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Vision AI Safeguard</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">Encrypted</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Private Consultation</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase: Real Clinical Photo + Interactive Product Card */}
          <div className="space-y-4">
            {/* Real High-Quality Doctor Photography */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm group">
              <Image
                src="/images/hero_doctor.png"
                alt="Verified Doctor Reviewing Patient Digital Health Chart"
                width={600}
                height={350}
                unoptimized
                className="w-full h-56 sm:h-64 object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
                <div className="text-white space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Licensed Practitioner Workspace
                  </div>
                  <p className="text-[11px] text-slate-300">Verified doctor reviewing clinical triage history in real time.</p>
                </div>
              </div>
            </div>

            {/* Product Triage Card Mockup */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>
                <span className="text-xs font-mono text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" /> m/meddit_ai_triage
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">m/Cardiology</span>
                  <span>u/patient_care</span>
                </div>
                <p className="font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  Experiencing mild shortness of breath and chest discomfort post-workout.
                </p>
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-teal-600 dark:text-teal-400 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> AI Triage Assessment
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Symptom score indicates non-emergent exertion query. Recommended specialist: <strong>Dr. Ananya Rao (Cardiology)</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CLINICAL WORKSPACE IMAGE BREAK & INFRASTRUCTURE SECTION */}
      <section id="features" className="py-16 px-6 md:px-12 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Real Photography Feature Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xs">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400 text-xs font-semibold">
                <Stethoscope className="w-3.5 h-3.5" /> Professional Practitioner Platform
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Empowering Verified Doctors & Informed Patients
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
                Meddit bridges clinical consultations and public medical discussions with end-to-end encrypted messaging, automated Gemini 2.5 Vision post moderation, and structured EHR timelines.
              </p>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>MCI / NMC verified physician identity licensing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Doctor-assisted AI reply drafting with human physician approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Client-side key cryptographic direct message privacy</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <Image
                src="/images/clinical_workspace.png"
                alt="Modern Clinical Diagnostic Workspace with Health Monitoring Screen"
                width={500}
                height={320}
                unoptimized
                className="w-full h-64 md:h-72 object-cover object-center hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>

          {/* 3 Infrastructure Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Pre-Visit Triage</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Maps patient symptoms to relevant specialties prior to booking, accelerating diagnosis and clinical intake.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">m/ Clinical Community</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Public sub-community discussions with pre-publish AI Vision moderation to enforce medical topic relevance.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Encrypted Direct Messaging</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Direct 1-on-1 consultations with client-side key cryptography and doctor AI reply draft assistance.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section id="faq" className="py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Everything you need to know about Meddit clinical operations.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform ${activeFaq === index ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-6 md:px-12 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 Meddit AI Healthcare. All rights reserved. Clinical advisory platform only.</p>
      </footer>
    </div>
  );
}
