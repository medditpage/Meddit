"use client";

// RedditHeader - Meddit Community Navigation Header (Notification button removed, ThemeToggle added)
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { createClient } from "@/utils/supabase/client";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface RedditHeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onCreatePostClick?: () => void;
  onMenuClick?: () => void;
}

export function RedditHeader({
  searchQuery = "",
  onSearchChange,
  onCreatePostClick,
  onMenuClick,
}: RedditHeaderProps) {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const [mounted, setMounted] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const displayedName = mounted ? user?.name || "Patient / Doctor" : "Patient / Doctor";
  const displayedRole = mounted ? user?.role || "patient" : "patient";
  const displayedInitials = mounted
    ? user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "M"
    : "M";

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between gap-3 text-slate-900 dark:text-slate-100 shadow-md">
      {/* Left: Mobile Drawer Button + Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation Drawer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <Link href="/community" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-white text-xs shadow-xs group-hover:scale-105 transition-transform">
            m/
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              meddit
            </span>
            <span className="text-[9px] font-semibold text-teal-600 dark:text-teal-400 tracking-wider uppercase">
              m/medical_community
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-xl mx-2">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search m/meddit, symptoms, doctors, or medical posts..."
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
          </svg>
        </div>
      </div>

      {/* Right: Actions, ThemeToggle, & Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Create Post CTA */}
        <button
          onClick={onCreatePostClick}
          className="hidden sm:flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors shadow-xs"
        >
          <span>+</span>
          <span>Create Post</span>
        </button>

        {/* Theme Toggle (Sun/Moon Switcher) */}
        <ThemeToggle />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 sm:px-2 py-1 rounded-full hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
          >
            <div className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-extrabold flex items-center justify-center">
              {displayedInitials}
            </div>
            <div className="hidden lg:flex flex-col text-left pr-1">
              <span className="text-xs font-bold text-slate-200 leading-tight">
                u/{displayedName.replace(/\s+/g, "_").toLowerCase()}
              </span>
              <span className="text-[10px] text-teal-400 font-semibold capitalize">
                {displayedRole}
              </span>
            </div>
            <svg className="w-3.5 h-3.5 text-slate-400 hidden sm:block" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-200">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white">{displayedName}</p>
                <p className="text-xs text-teal-400 font-medium">u/{displayedName.replace(/\s+/g, "_").toLowerCase()}</p>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push("/dashboard");
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                📊 Main Dashboard
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push("/doctors");
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                👨‍⚕️ Find Doctors
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push(displayedRole === "doctor" ? "/appointments/doctor" : "/appointments");
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                📅 My Appointments
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push("/settings");
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                ⚙️ User Settings
              </button>

              <hr className="border-slate-800 my-1" />

              <button
                onClick={async () => {
                  setShowProfileMenu(false);
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  router.push("/");
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 flex items-center gap-2"
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
