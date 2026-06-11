// this is TopNavbar
import * as React from "react";
import { cn } from "@/lib/utils";

import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

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
  notificationCount?: number;
  onMenuClick?: () => void;
}

export const TopNavbar = ({
  variant = "primary",
  userName = "Guest",
  notificationCount = 0,
  onMenuClick,
}: TopNavbarProps) => {
  // Generate initials for the avatar (e.g., "Ananya Rao" -> "AR", "Guest" -> "?")
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
          ? "bg-white border-slate-200"
          : "bg-slate-50 border-slate-200",
      )}
    >
      {/* Left side: Mobile menu & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="sm:hidden p-2 -ml-2 text-slate-600 hover:text-teal-600 transition-colors"
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="font-bold text-xl hidden sm:block text-slate-900 tracking-tight">
            Medit
          </span>
        </div>
      </div>

      {/* Right side: Notifications & User Profile */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-500 hover:text-teal-600 transition-colors rounded-full hover:bg-teal-50">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white/50">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User Profile Block */}
        <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-slate-200">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900">{userName}</span>
            <span className="text-xs text-slate-500">
              {userName === "Guest" ? "Please sign in" : "Active Session"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Admin switch button — only renders if user is admin */}
            <AdminSwitchButton />
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold border border-teal-200 shrink-0">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
