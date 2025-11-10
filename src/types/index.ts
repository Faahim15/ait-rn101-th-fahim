export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: "pending" | "completed";
  tags?: string[];
  imageUri?: string;
  imageBase64?: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: "synced" | "pending" | "failed";
}

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
  taskData?: Partial<Task>;
  timestamp: number;
  retries: number;
}

export interface OfflineStore {
  tasks: Task[];
  syncQueue: SyncQueue[];
}
