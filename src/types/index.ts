export type Task = {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  status: "pending" | "completed";
  imageUri?: string | null;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  syncStatus?: "synced" | "pending";
};

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface SyncQueue {
  id: string;
  action: "create" | "update" | "delete";
  taskId: string;
  taskData?: Task | Partial<Task>; // ✅ Allow both
  timestamp: number;
  retries: number;
}

export interface OfflineStore {
  tasks: Task[];
  syncQueue: SyncQueue[];
}
