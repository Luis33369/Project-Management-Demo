import { create } from 'zustand'
import type { User, FeatureFlag, SystemMetrics, SystemLog, UserRole } from '@/lib/types'

interface AdminState {
  users: User[]
  featureFlags: FeatureFlag[]
  systemMetrics: SystemMetrics | null
  systemLogs: SystemLog[]
  isLoading: boolean
  error: string | null
}

interface AdminActions {
  fetchUsers: () => Promise<void>
  createUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>
  updateUser: (id: string, updates: Partial<User>) => Promise<void>
  toggleUserStatus: (id: string) => Promise<void>
  bulkUpdateUsers: (ids: string[], updates: Partial<User>) => Promise<void>
  fetchFeatureFlags: () => Promise<void>
  updateFeatureFlag: (id: string, updates: Partial<FeatureFlag>) => Promise<void>
  fetchSystemMetrics: () => Promise<void>
  fetchSystemLogs: (filters?: { level?: string; timeRange?: string }) => Promise<void>
}

// Mock data
const MOCK_USERS: User[] = [
  { id: '1', email: 'admin@jira-lite.com', name: 'Admin User', role: 'admin', createdAt: '2024-01-01T00:00:00Z', isActive: true },
  { id: '2', email: 'manager@jira-lite.com', name: 'Project Manager', role: 'manager', createdAt: '2024-01-02T00:00:00Z', isActive: true },
  { id: '3', email: 'dev@jira-lite.com', name: 'Developer', role: 'developer', createdAt: '2024-01-03T00:00:00Z', isActive: true },
  { id: '4', email: 'sarah@jira-lite.com', name: 'Sarah Wilson', role: 'developer', createdAt: '2024-01-05T00:00:00Z', isActive: true },
  { id: '5', email: 'mike@jira-lite.com', name: 'Mike Johnson', role: 'manager', createdAt: '2024-01-06T00:00:00Z', isActive: false },
  { id: '6', email: 'emily@jira-lite.com', name: 'Emily Davis', role: 'developer', createdAt: '2024-01-07T00:00:00Z', isActive: true },
]

const MOCK_FEATURE_FLAGS: FeatureFlag[] = [
  { id: 'ff-1', name: 'kanban_board', description: 'Enable drag-and-drop Kanban board', enabled: true, roles: ['admin', 'manager', 'developer'] },
  { id: 'ff-2', name: 'file_attachments', description: 'Allow file attachments on tasks', enabled: true, roles: ['admin', 'manager', 'developer'] },
  { id: 'ff-3', name: 'advanced_analytics', description: 'Show advanced analytics dashboard', enabled: true, roles: ['admin', 'manager'] },
  { id: 'ff-4', name: 'bulk_operations', description: 'Enable bulk task operations', enabled: false, roles: ['admin'] },
  { id: 'ff-5', name: 'ai_suggestions', description: 'AI-powered task suggestions', enabled: false, roles: ['admin', 'manager'] },
]

const MOCK_METRICS: SystemMetrics = {
  activeUsers: 42,
  totalProjects: 15,
  totalTasks: 234,
  apiLatency: 45,
  errorRate: 0.2,
  uptime: 99.9,
}

const MOCK_LOGS: SystemLog[] = [
  { id: 'log-1', level: 'info', message: 'User login successful', source: 'auth-service', timestamp: '2024-01-20T14:30:00Z' },
  { id: 'log-2', level: 'warning', message: 'High API latency detected', source: 'api-gateway', timestamp: '2024-01-20T14:25:00Z' },
  { id: 'log-3', level: 'error', message: 'Database connection timeout', source: 'db-service', timestamp: '2024-01-20T14:20:00Z' },
  { id: 'log-4', level: 'info', message: 'New project created', source: 'project-service', timestamp: '2024-01-20T14:15:00Z' },
  { id: 'log-5', level: 'info', message: 'Task status updated', source: 'task-service', timestamp: '2024-01-20T14:10:00Z' },
  { id: 'log-6', level: 'warning', message: 'Rate limit approaching', source: 'api-gateway', timestamp: '2024-01-20T14:05:00Z' },
  { id: 'log-7', level: 'info', message: 'User role updated', source: 'user-service', timestamp: '2024-01-20T14:00:00Z' },
  { id: 'log-8', level: 'error', message: 'Failed to send notification', source: 'notification-service', timestamp: '2024-01-20T13:55:00Z' },
]

export const useAdminStore = create<AdminState & AdminActions>()((set) => ({
  users: [],
  featureFlags: [],
  systemMetrics: null,
  systemLogs: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null })
    await new Promise((resolve) => setTimeout(resolve, 500))
    set({ users: MOCK_USERS, isLoading: false })
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null })
    await new Promise((resolve) => setTimeout(resolve, 400))
    
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    
    set((state) => ({
      users: [...state.users, newUser],
      isLoading: false,
    }))
  },

  updateUser: async (id, updates) => {
    set({ isLoading: true, error: null })
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
      isLoading: false,
    }))
  },

  toggleUserStatus: async (id) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, isActive: !u.isActive } : u
      ),
    }))
  },

  bulkUpdateUsers: async (ids, updates) => {
    set({ isLoading: true, error: null })
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    set((state) => ({
      users: state.users.map((u) =>
        ids.includes(u.id) ? { ...u, ...updates } : u
      ),
      isLoading: false,
    }))
  },

  fetchFeatureFlags: async () => {
    set({ isLoading: true, error: null })
    await new Promise((resolve) => setTimeout(resolve, 400))
    set({ featureFlags: MOCK_FEATURE_FLAGS, isLoading: false })
  },

  updateFeatureFlag: async (id, updates) => {
    set((state) => ({
      featureFlags: state.featureFlags.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    }))
  },

  fetchSystemMetrics: async () => {
    set({ isLoading: true, error: null })
    await new Promise((resolve) => setTimeout(resolve, 300))
    set({ systemMetrics: MOCK_METRICS, isLoading: false })
  },

  fetchSystemLogs: async () => {
    set({ isLoading: true, error: null })
    await new Promise((resolve) => setTimeout(resolve, 400))
    set({ systemLogs: MOCK_LOGS, isLoading: false })
  },
}))

// Selectors
export const useUsers = () => useAdminStore((state) => state.users)
export const useFeatureFlags = () => useAdminStore((state) => state.featureFlags)
export const useSystemMetrics = () => useAdminStore((state) => state.systemMetrics)
export const useSystemLogs = () => useAdminStore((state) => state.systemLogs)
