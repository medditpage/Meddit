import { create } from "zustand";

interface User {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
}

interface AppState {
  // State values
  user: User | null;
  unreadMessages: number;
  notifications: number;

  // Actions
  login: (userData: User) => void;
  logout: () => void;
  clearNotifications: () => void;
  markMessageRead: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null, // User starts logged out
  unreadMessages: 2,
  notifications: 3,

  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
  clearNotifications: () => set({ notifications: 0 }),
  markMessageRead: () =>
    set((state) => ({
      unreadMessages: Math.max(0, state.unreadMessages - 1),
    })),
}));
