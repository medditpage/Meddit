"use client";

import Link from "next/link";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { Footer } from "@/components/layout/Footer";
import { useStore } from "@/lib/store";

export default function HomePage() {
  // Grab live data from the AuthProvider/Zustand store
  const user = useStore((state) => state.user);
  const notifications = useStore((state) => state.notifications);

  const modules = [
    {
      title: "Doctor Profile",
      description: "View doctor availability, metrics, and book consultations.",
      href: "/doctors/1",
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      title: "Patient Dashboard",
      description: "Track patient metrics, medical history, and lab reports.",
      href: "/patients/1",
      color: "bg-teal-50 border-teal-200 text-teal-700",
    },
    {
      title: "Clinical Community",
      description: "Engage in peer-to-peer medical discussions and cases.",
      href: "/community",
      color: "bg-purple-50 border-purple-200 text-purple-700",
    },
    {
      title: "Secure Messaging",
      description: "HIPAA-compliant chat with patients and colleagues.",
      href: "/messages",
      color: "bg-amber-50 border-amber-200 text-amber-700",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar now receives real user name from Supabase */}
      <TopNavbar
        variant="secondary"
        userName={user ? user.name : "Guest"}
        notificationCount={notifications}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-24">
        <div className="max-w-4xl w-full text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            System Active
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Welcome to <span className="text-teal-600">Medit.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {user
              ? `Welcome back, ${user.name}. `
              : "Secure medical intelligence for professionals and patients. "}
            Select a module below to view the interactive demo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className={`p-8 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-1 bg-white border-slate-200 group`}
            >
              <div
                className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center border ${mod.color}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                {mod.title} &rarr;
              </h2>
              <p className="text-slate-600">{mod.description}</p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
