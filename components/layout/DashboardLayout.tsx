"use client";

// components/layout/DashboardLayout.tsx
// Meddit Unified Application Workspace Layout (Universal Theme Support)

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { GlobalAIAssistantModal } from "@/components/ai/GlobalAIAssistantModal";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  activeNavId?: string;
  userName?: string;
  userAvatarInitials?: string;
  userRole?: string;
  onNavigate?: (id: string, href: string) => void;
  actions?: React.ReactNode;
  headerTitle?: string;
}

const defaultSidebarItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: "community",
    label: "m/ Community",
    href: "/community",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.97 5.97 0 00-.942 3.197M12 10.5a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    ),
    badge: "m/meddit",
  },
  {
    id: "doctors",
    label: "Find Doctors",
    href: "/doctors",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    id: "appointments",
    label: "Appointments",
    href: "/appointments",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    id: "messages",
    label: "Direct Messages",
    href: "/messages",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-1.006-.934c.264-.814.54-1.61.802-2.399A8.134 8.134 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    id: "patients",
    label: "Patient Records",
    href: "/patients",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export function DashboardLayout({
  children,
  navItems,
  activeNavId,
  userName,
  userRole,
  onNavigate,
  actions,
  headerTitle,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const storeUser = useStore((state) => state.user);
  const [mounted, setMounted] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const displayedUserName = userName || (mounted ? storeUser?.name || "Guest" : "Guest");
  const displayedRole = userRole || (mounted ? storeUser?.role || "patient" : "patient");
  const sidebarItems = navItems ?? defaultSidebarItems;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 selection:bg-teal-500 selection:text-slate-950 transition-colors duration-200">
      {/* Top Header */}
      <TopNavbar
        variant="secondary"
        userName={displayedUserName}
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Grid Container */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="flex w-full gap-5">
          {/* Desktop Left Navigation Sidebar */}
          <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 space-y-6 shadow-xs self-start sticky top-20 transition-colors">
            {/* Header Brand Badge */}
            <div className="px-3 pt-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40 flex items-center justify-center font-extrabold text-xs">
                  m/
                </span>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
                  Meddit App
                </span>
              </div>
              <span
                className={cn(
                  "text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                  displayedRole === "doctor"
                    ? "bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-500/40"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700",
                )}
              >
                {displayedRole === "doctor" ? "Doctor" : "Patient"}
              </span>
            </div>

            <hr className="border-slate-200 dark:border-slate-800/80 my-1" />

            {/* Nav Items List */}
            <nav className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 mb-2">
                Workspace
              </p>
              {sidebarItems.map((item) => {
                const isActive = activeNavId
                  ? activeNavId === item.id
                  : mounted && (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)));

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate(item.id, item.href);
                      } else {
                        router.push(item.href);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group",
                      isActive
                        ? "bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40 shadow-2xs"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("transition-transform group-hover:scale-110", isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-500 dark:text-slate-400")}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Workspace Column */}
          <main className="flex-1 min-w-0">
            {headerTitle && (
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{headerTitle}</h1>
                {actions && <div>{actions}</div>}
              </div>
            )}
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl z-10 overflow-y-auto border-r border-slate-200 dark:border-slate-800 p-4 space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-white text-base">m/meddit Navigation</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <nav className="space-y-1.5">
              {sidebarItems.map((item) => {
                const isActive = activeNavId
                  ? activeNavId === item.id
                  : mounted && (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)));

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onNavigate) {
                        onNavigate(item.id, item.href);
                      } else {
                        router.push(item.href);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all",
                      isActive
                        ? "bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/40"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
      {/* Global Context-Aware AI Assistant Modal (Ctrl+K) */}
      <GlobalAIAssistantModal />
    </div>
  );
}
