import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import type { AuthState, User } from "../types";

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
}

const mockUsers: Record<string, { password: string; user: User }> = {
  "test@example.com": {
    password: "password123",
    user: {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      createdAt: new Date().toISOString(),
    },
  },
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser = mockUsers[email];
      if (!mockUser || mockUser.password !== password) {
        throw new Error("Invalid credentials");
      }

      await AsyncStorage.setItem("user", JSON.stringify(mockUser.user));
      set({ user: mockUser.user, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  signup: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (mockUsers[email]) {
        throw new Error("Email already exists");
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };

      mockUsers[email] = { password, user: newUser };
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      set({ user: newUser, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("user");
    set({ user: null, error: null });
  },

  restoreToken: async () => {
    try {
      const stored = await AsyncStorage.getItem("user");
      if (stored) {
        set({ user: JSON.parse(stored), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
