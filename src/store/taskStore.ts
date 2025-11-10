import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import type { SyncQueue, Task } from "../types";

interface TaskStore {
  tasks: Task[];
  syncQueue: SyncQueue[];
  isLoading: boolean;
  error: string | null;

  loadTasks: () => Promise<void>;
  addTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt" | "syncStatus">
  ) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  searchTasks: (query: string) => Task[];
  filterTasks: (status?: string, tags?: string[]) => Task[];
  syncTasks: () => Promise<void>;
  clearSyncQueue: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  syncQueue: [],
  isLoading: false,
  error: null,

  loadTasks: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem("tasks");
      if (stored) {
        set({ tasks: JSON.parse(stored) });
      }
    } catch {
      set({ error: "Failed to load tasks" });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (taskData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: "pending",
    };

    const { tasks, syncQueue } = get();
    const updated = [...tasks, newTask];
    const newQueue = [
      ...syncQueue,
      {
        id: Date.now().toString(),
        action: "create",
        taskId: newTask.id,
        taskData: newTask,
        timestamp: Date.now(),
        retries: 0,
      },
    ];

    set({ tasks: updated, syncQueue: newQueue });
    await AsyncStorage.setItem("tasks", JSON.stringify(updated));
    await AsyncStorage.setItem("syncQueue", JSON.stringify(newQueue));
  },

  updateTask: async (id, updates) => {
    const { tasks, syncQueue } = get();
    const updated = tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            ...updates,
            updatedAt: new Date().toISOString(),
            syncStatus: "pending" as const,
          }
        : t
    );

    const newQueue = [
      ...syncQueue,
      {
        id: Date.now().toString(),
        action: "update",
        taskId: id,
        taskData: updates,
        timestamp: Date.now(),
        retries: 0,
      },
    ];

    set({ tasks: updated, syncQueue: newQueue });
    await AsyncStorage.setItem("tasks", JSON.stringify(updated));
    await AsyncStorage.setItem("syncQueue", JSON.stringify(newQueue));
  },

  deleteTask: async (id) => {
    const { tasks, syncQueue } = get();
    const updated = tasks.filter((t) => t.id !== id);
    const newQueue = [
      ...syncQueue,
      {
        id: Date.now().toString(),
        action: "delete",
        taskId: id,
        timestamp: Date.now(),
        retries: 0,
      },
    ];

    set({ tasks: updated, syncQueue: newQueue });
    await AsyncStorage.setItem("tasks", JSON.stringify(updated));
    await AsyncStorage.setItem("syncQueue", JSON.stringify(newQueue));
  },

  toggleComplete: async (id) => {
    const { tasks } = get();
    const task = tasks.find((t) => t.id === id);
    if (task) {
      await get().updateTask(id, {
        status: task.status === "completed" ? "pending" : "completed",
      });
    }
  },

  searchTasks: (query) => {
    const { tasks } = get();
    const lower = query.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        t.description?.toLowerCase().includes(lower)
    );
  },

  filterTasks: (status, tags) => {
    let { tasks } = get();
    if (status && status !== "all") {
      tasks = tasks.filter((t) => t.status === status);
    }
    if (tags && tags.length > 0) {
      tasks = tasks.filter((t) => t.tags?.some((tag) => tags.includes(tag)));
    }
    return tasks;
  },

  syncTasks: async () => {
    const { syncQueue, tasks } = get();
    if (syncQueue.length === 0) return;

    try {
      set({ isLoading: true });
      // Simulate API sync
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const synced = tasks.map((t) => ({
        ...t,
        syncStatus: "synced" as const,
      }));
      set({ tasks: synced, syncQueue: [] });
      await AsyncStorage.setItem("tasks", JSON.stringify(synced));
      await AsyncStorage.setItem("syncQueue", JSON.stringify([]));
    } catch {
      set({ error: "Sync failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  clearSyncQueue: async () => {
    set({ syncQueue: [] });
    await AsyncStorage.setItem("syncQueue", JSON.stringify([]));
  },
}));
