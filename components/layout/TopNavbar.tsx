"use client";

// TopNavbar - Meddit Navigation Header (Notification button removed, ThemeToggle integrated)
import * as React from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

function AdminSwitchButton() {
  const user = useStore((state) => state.user);
  const router = useRouter();
  if (user?.role !== "admin") return null;
  return (
    <button
      onClick={() => router.push("/admin")}
      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full transition-colors"
    >
      🔐 Admin Panel
    </button>
  );
}

export interface TopNavbarProps {
  variant?: "primary" | "secondary";
  userName?: string;
  onMenuClick?: () => void;
}

export const TopNavbar = ({
  variant = "primary",
  userName = "Guest",
  onMenuClick,
}: TopNavbarProps) => {
  const initials =
    userName === "Guest"
      ? "?"
      : userName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();

  return (
    <header
      className={cn(
        "h-16 flex items-center justify-between px-4 lg:px-8 border-b transition-colors",
        variant === "primary"
          ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white",
      )}
    >
      {/* Left side: Mobile menu & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="sm:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = "/community"}>
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs">
            m/
          </div>
          <span className="font-bold text-xl hidden sm:block text-slate-900 dark:text-white tracking-tight">
            meddit
          </span>
        </div>
      </div>

      {/* Right side: ThemeToggle, Admin Button, & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Theme Toggle Button */}
        <ThemeToggle />

        <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{userName}</span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
              {userName === "Guest" ? "Please sign in" : "Active Session"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AdminSwitchButton />
            <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xs border border-teal-500 shrink-0 shadow-xs">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
