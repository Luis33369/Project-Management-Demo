import { create } from 'zustand'
import type { Project, ProjectStatus } from '@/lib/types'

interface ProjectState {
  projects: Project[]
  selectedProject: Project | null
  isLoading: boolean
  error: string | null
}

interface ProjectActions {
  fetchProjects: () => Promise<void>
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  archiveProject: (id: string) => Promise<void>
  selectProject: (project: Project | null) => void
  setLoading: (loading: boolean) => void
}

// Mock projects data
const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'E-Commerce Platform',
    description: 'Build a modern e-commerce platform with React and Node.js',
    status: 'active',
    ownerId: '2',
    members: ['1', '2', '3'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'proj-2',
    name: 'Mobile App Redesign',
    description: 'Redesign the mobile application UI/UX for better user experience',
    status: 'active',
    ownerId: '2',
    members: ['2', '3'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
  },
  {
    id: 'proj-3',
    name: 'API Integration',
    description: 'Integrate third-party APIs for payment and analytics',
    status: 'active',
    ownerId: '1',
    members: ['1', '3'],
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-16T16:45:00Z',
  },
  {
    id: 'proj-4',
    name: 'Legacy System Migration',
    description: 'Migrate legacy systems to modern cloud infrastructure',
    status: 'archived',
    ownerId: '1',
    members: ['1', '2'],
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
]

export const useProjectStore = create<ProjectState & ProjectActions>()((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null })
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    set({ projects: MOCK_PROJECTS, isLoading: false })
  },

  createProject: async (projectData) => {
    set({ isLoading: true, error: null })
    
    await new Promise((resolve) => setTimeout(resolve, 400))
    
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    set((state) => ({
      projects: [...state.projects, newProject],
      isLoading: false,
    }))
  },

  updateProject: async (id, updates) => {
    set({ isLoading: true, error: null })
    
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
      selectedProject:
        state.selectedProject?.id === id
          ? { ...state.selectedProject, ...updates, updatedAt: new Date().toISOString() }
          : state.selectedProject,
      isLoading: false,
    }))
  },

  archiveProject: async (id) => {
    await get().updateProject(id, { status: 'archived' })
  },

  selectProject: (project) => set({ selectedProject: project }),
  
  setLoading: (loading) => set({ isLoading: loading }),
}))

// Selectors
export const useProjects = () => useProjectStore((state) => state.projects)
export const useActiveProjects = () =>
  useProjectStore((state) => state.projects.filter((p) => p.status === 'active'))
export const useSelectedProject = () => useProjectStore((state) => state.selectedProject)
