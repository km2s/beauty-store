import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  full_name?: string;
  points_balance?: number;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem("access_token", token);
        set({ user, token });
      },
      clearAuth: () => {
        localStorage.removeItem("access_token");
        set({ user: null, token: null });
      },
      isLoggedIn: () => !!get().token,
    }),
    { name: "beauty-auth" }
  )
);
