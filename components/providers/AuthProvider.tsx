"use client";
// this is components/providers/AuthProvider.tsx
import * as React from "react";
import { createClient } from "@/utils/supabase/client";
import { useStore } from "@/lib/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);

  React.useEffect(() => {
    const supabase = createClient();

    const initializeAuth = async () => {
      // 1. Check if the browser has an active Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // 2. Try to fetch their REAL profile from the database
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          // 3a. Success! Use the database profile
          login({
            id: profile.id,
            name: profile.name,
            role: profile.role,
            avatarInitials: profile.avatar_initials,
          });
        } else {
          // 3b. FALLBACK: If the profile is missing, use their email prefix
          const emailName = session.user.email?.split("@")[0] || "Doctor";
          login({
            id: session.user.id,
            name: `Dr. ${emailName.charAt(0).toUpperCase() + emailName.slice(1)}`,
            role: "Verified User",
            avatarInitials: emailName.substring(0, 2).toUpperCase(),
          });
        }
      } else {
        logout();
      }
    };

    initializeAuth();

    // 4. Set up a listener for sign-in/sign-out events
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        logout();
      } else if (event === "SIGNED_IN") {
        initializeAuth();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [login, logout]);

  return <>{children}</>;
}
