import { create } from 'zustand'
import type { Task, TaskStatus, Subtask, Comment } from '@/lib/types'

interface TaskState {
  tasks: Task[]
  selectedTask: Task | null
  isLoading: boolean
  error: string | null
  optimisticUpdates: Map<string, Task>
}

interface TaskActions {
  fetchTasks: (projectId?: string) => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'subtasks' | 'comments' | 'attachments'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  selectTask: (task: Task | null) => void
  addSubtask: (taskId: string, title: string) => Promise<void>
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>
  addComment: (taskId: string, content: string, authorId: string) => Promise<void>
  reorderTasks: (tasks: Task[]) => void
}

// Mock tasks data
const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Design System Setup',
    description: 'Create a comprehensive design system with reusable components',
    status: 'done',
    priority: 'high',
    projectId: 'proj-1',
    assigneeId: '3',
    reporterId: '2',
    dueDate: '2024-01-25',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    subtasks: [
      { id: 'sub-1', title: 'Create color palette', completed: true, taskId: 'task-1' },
      { id: 'sub-2', title: 'Design button variants', completed: true, taskId: 'task-1' },
    ],
    comments: [
      { id: 'com-1', content: 'Looking great!', authorId: '2', taskId: 'task-1', createdAt: '2024-01-18T10:00:00Z', mentions: [] },
    ],
    attachments: [],
  },
  {
    id: 'task-2',
    title: 'User Authentication',
    description: 'Implement JWT-based authentication with refresh token flow',
    status: 'in-progress',
    priority: 'urgent',
    projectId: 'proj-1',
    assigneeId: '3',
    reporterId: '2',
    dueDate: '2024-01-28',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-19T11:00:00Z',
    subtasks: [
      { id: 'sub-3', title: 'Setup JWT middleware', completed: true, taskId: 'task-2' },
      { id: 'sub-4', title: 'Implement refresh tokens', completed: false, taskId: 'task-2' },
      { id: 'sub-5', title: 'Add password reset flow', completed: false, taskId: 'task-2' },
    ],
    comments: [],
    attachments: [],
  },
  {
    id: 'task-3',
    title: 'Database Schema Design',
    description: 'Design and implement the database schema for the application',
    status: 'in-progress',
    priority: 'high',
    projectId: 'proj-1',
    assigneeId: '1',
    reporterId: '2',
    dueDate: '2024-01-30',
    createdAt: '2024-01-14T08:00:00Z',
    updatedAt: '2024-01-17T16:45:00Z',
    subtasks: [],
    comments: [],
    attachments: [],
  },
  {
    id: 'task-4',
    title: 'API Documentation',
    description: 'Write comprehensive API documentation using OpenAPI spec',
    status: 'todo',
    priority: 'medium',
    projectId: 'proj-1',
    assigneeId: '3',
    reporterId: '1',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
    subtasks: [],
    comments: [],
    attachments: [],
  },
  {
    id: 'task-5',
    title: 'Performance Optimization',
    description: 'Optimize application performance and reduce bundle size',
    status: 'todo',
    priority: 'low',
    projectId: 'proj-1',
    assigneeId: undefined,
    reporterId: '2',
    createdAt: '2024-01-19T14:00:00Z',
    updatedAt: '2024-01-19T14:00:00Z',
    subtasks: [],
    comments: [],
    attachments: [],
  },
  {
    id: 'task-6',
    title: 'Mobile UI Components',
    description: 'Create responsive UI components for mobile screens',
    status: 'in-progress',
    priority: 'high',
    projectId: 'proj-2',
    assigneeId: '3',
    reporterId: '2',
    dueDate: '2024-01-26',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    subtasks: [
      { id: 'sub-6', title: 'Navigation component', completed: true, taskId: 'task-6' },
      { id: 'sub-7', title: 'Card layouts', completed: false, taskId: 'task-6' },
    ],
    comments: [],
    attachments: [],
  },
  {
    id: 'task-7',
    title: 'Payment Gateway Setup',
    description: 'Integrate Stripe payment gateway for subscriptions',
    status: 'todo',
    priority: 'urgent',
    projectId: 'proj-3',
    assigneeId: '3',
    reporterId: '1',
    dueDate: '2024-01-24',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
    subtasks: [],
    comments: [],
    attachments: [],
  },
]

export const useTaskStore = create<TaskState & TaskActions>()((set, get) => ({
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,
  optimisticUpdates: new Map(),

  fetchTasks: async (projectId) => {
    set({ isLoading: true, error: null })
    
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const tasks = projectId
      ? MOCK_TASKS.filter((t) => t.projectId === projectId)
      : MOCK_TASKS
    
    set({ tasks, isLoading: false })
  },

  createTask: async (taskData) => {
    set({ isLoading: true, error: null })
    
    await new Promise((resolve) => setTimeout(resolve, 400))
    
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: [],
      comments: [],
      attachments: [],
    }
    
    set((state) => ({
      tasks: [...state.tasks, newTask],
      isLoading: false,
    }))
  },

  updateTask: async (id, updates) => {
    const { tasks } = get()
    const originalTask = tasks.find((t) => t.id === id)
    
    if (!originalTask) return

    // Optimistic update
    const optimisticTask = { ...originalTask, ...updates, updatedAt: new Date().toISOString() }
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? optimisticTask : t)),
      selectedTask: state.selectedTask?.id === id ? optimisticTask : state.selectedTask,
    }))
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      // API call would go here
    } catch {
      // Rollback on failure
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? originalTask : t)),
        error: 'Failed to update task',
      }))
    }
  },

  updateTaskStatus: async (id, status) => {
    await get().updateTask(id, { status })
  },

  deleteTask: async (id) => {
    set({ isLoading: true })
    
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
      isLoading: false,
    }))
  },

  selectTask: (task) => set({ selectedTask: task }),

  addSubtask: async (taskId, title) => {
    const newSubtask: Subtask = {
      id: `sub-${Date.now()}`,
      title,
      completed: false,
      taskId,
    }
    
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, subtasks: [...t.subtasks, newSubtask] } : t
      ),
    }))
  },

  toggleSubtask: async (taskId, subtaskId) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, completed: !s.completed } : s
              ),
            }
          : t
      ),
    }))
  },

  addComment: async (taskId, content, authorId) => {
    const newComment: Comment = {
      id: `com-${Date.now()}`,
      content,
      authorId,
      taskId,
      createdAt: new Date().toISOString(),
      mentions: [],
    }
    
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t
      ),
    }))
  },

  reorderTasks: (tasks) => set({ tasks }),
}))

// Selectors
export const useTasks = () => useTaskStore((state) => state.tasks)
export const useTasksByProject = (projectId: string) =>
  useTaskStore((state) => state.tasks.filter((t) => t.projectId === projectId))
export const useTasksByStatus = (status: TaskStatus) =>
  useTaskStore((state) => state.tasks.filter((t) => t.status === status))
export const useSelectedTask = () => useTaskStore((state) => state.selectedTask)
