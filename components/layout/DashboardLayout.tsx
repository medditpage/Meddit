"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { TopNavbar } from "./TopNavbar";
import { FloatingSidebar } from "./FloatingSidebar";
import { PageContainer } from "./PageContainer";
import { Footer } from "./Footer";
import { useStore } from "@/lib/store";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  companyName?: string;
  navItems?: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    iconPath?: React.ReactNode;
  }[];
  activeNavId?: string;
  emergencyNumber?: string;
}

export function DashboardLayout({
  children,
  companyName = "Medit",
  navItems,
  activeNavId,
  emergencyNumber = "108",
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const user = useStore((state) => state.user);
  const unreadMessages = useStore((state) => state.unreadMessages);
  const notifications = useStore((state) => state.notifications);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const displayedUserName = mounted ? (user ? user.name : "Guest") : "Guest";
  const displayedNotifications = mounted ? notifications : 0;
  const displayedUnreadMessages = mounted ? unreadMessages : 0;

  // Layout logic: Sidebar ke liye alag se width reserve kar rahe hain
  const isDoctor = mounted ? user?.role === "doctor" : false;

  const defaultSidebarItems = [
    {
      id: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: "/community",
      label: "Community",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    // Doctor only
    ...(isDoctor
      ? [
          {
            id: "/patients",
            label: "Patients",
            icon: (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" />
              </svg>
            ),
          },
          {
            id: "/appointments/doctor",
            label: "Appointments",
            icon: (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            ),
          },
        ]
      : []),
    // Patient only
    ...(!isDoctor
      ? [
          {
            id: "/appointments",
            label: "My Appointments",
            icon: (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            ),
          },
        ]
      : []),
    // Both see doctors directory
    {
      id: "/doctors",
      label: "Doctors",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "/messages",
      label: "Messages",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: "/settings",
      label: "Settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];
  const sidebarItems = navItems ?? defaultSidebarItems;
  const activeIdValue = activeNavId ?? (mounted ? pathname : "");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <TopNavbar
        variant="secondary"
        userName={displayedUserName}
        notificationCount={displayedNotifications}
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Container: Flex row layout */}
      <div className="flex flex-1 w-full">
        {/* Desktop Sidebar (Permanent space reserve kar raha hai) */}
        <div className="hidden sm:flex flex-col shrink-0 border-r border-slate-200 bg-white z-20">
          {mounted ? (
            <FloatingSidebar
              position="left"
              items={sidebarItems}
              activeId={activeIdValue}
              onItemClick={(id) => router.push(id)}
              className="top-32"
            />
          ) : (
            <div className="w-64 h-full" aria-hidden="true" />
          )}
        </div>

        {/* Content Area: Ye sidebar ke baaju mein hi rahega */}
        <main className="flex-1 w-full min-w-0 p-6 md:p-10">{children}</main>
      </div>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl z-10">
            <FloatingSidebar
              position="left"
              items={sidebarItems}
              activeId={activeIdValue}
              onItemClick={(id) => {
                router.push(id);
                setIsMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      <Footer companyName={companyName} emergencyNumber="108" />
    </div>
  );
}
