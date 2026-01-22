// User & Auth Types
export type UserRole = 'admin' | 'manager' | 'developer'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  createdAt: string
  lastLogin?: string
  isActive: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// Project Types
export type ProjectStatus = 'active' | 'archived' | 'completed'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  ownerId: string
  members: string[]
  createdAt: string
  updatedAt: string
}

// Task Types
export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string
  assigneeId?: string
  reporterId: string
  dueDate?: string
  createdAt: string
  updatedAt: string
  subtasks: Subtask[]
  comments: Comment[]
  attachments: Attachment[]
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
  taskId: string
}

export interface Comment {
  id: string
  content: string
  authorId: string
  taskId: string
  createdAt: string
  mentions: string[]
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: string
}

// Activity & Audit Types
export interface ActivityLog {
  id: string
  userId: string
  action: string
  entityType: 'project' | 'task' | 'user' | 'system'
  entityId: string
  details: Record<string, unknown>
  timestamp: string
}

// Admin Types
export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  roles: UserRole[]
}

export interface SystemMetrics {
  activeUsers: number
  totalProjects: number
  totalTasks: number
  apiLatency: number
  errorRate: number
  uptime: number
}

export interface SystemLog {
  id: string
  level: 'info' | 'warning' | 'error'
  message: string
  source: string
  timestamp: string
  metadata?: Record<string, unknown>
}

// UI Types
export type Theme = 'light' | 'dark'

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Permission helpers
export const ROLE_PERMISSIONS = {
  admin: {
    canManageUsers: true,
    canManageProjects: true,
    canManageTasks: true,
    canViewAdminDashboard: true,
    canManageFeatureFlags: true,
    canViewSystemLogs: true,
    canViewMetrics: true,
  },
  manager: {
    canManageUsers: false,
    canManageProjects: true,
    canManageTasks: true,
    canViewAdminDashboard: false,
    canManageFeatureFlags: false,
    canViewSystemLogs: false,
    canViewMetrics: true,
  },
  developer: {
    canManageUsers: false,
    canManageProjects: false,
    canManageTasks: true,
    canViewAdminDashboard: false,
    canManageFeatureFlags: false,
    canViewSystemLogs: false,
    canViewMetrics: false,
  },
} as const

export type Permission = keyof typeof ROLE_PERMISSIONS.admin

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role][permission]
}
