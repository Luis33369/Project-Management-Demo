import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthTokens, UserRole } from '@/lib/types'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshTokens: () => Promise<void>
  updateUser: (user: Partial<User>) => void
  setLoading: (loading: boolean) => void
  clearError: () => void
}

// Mock users for demo
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@jira-lite.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@jira-lite.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00Z',
      isActive: true,
    },
  },
  'manager@jira-lite.com': {
    password: 'manager123',
    user: {
      id: '2',
      email: 'manager@jira-lite.com',
      name: 'Project Manager',
      role: 'manager',
      createdAt: '2024-01-01T00:00:00Z',
      isActive: true,
    },
  },
  'dev@jira-lite.com': {
    password: 'dev123',
    user: {
      id: '3',
      email: 'dev@jira-lite.com',
      name: 'Developer',
      role: 'developer',
      createdAt: '2024-01-01T00:00:00Z',
      isActive: true,
    },
  },
}

// Mock token generation
const generateMockTokens = (): AuthTokens => ({
  accessToken: `access_${Date.now()}_${Math.random().toString(36).substring(7)}`,
  refreshToken: `refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`,
})

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))
        
        const mockUser = MOCK_USERS[email]
        
        if (!mockUser || mockUser.password !== password) {
          set({ isLoading: false, error: 'Invalid email or password' })
          return
        }

        const tokens = generateMockTokens()
        const user = { ...mockUser.user, lastLogin: new Date().toISOString() }
        
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      },

      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        })
      },

      refreshTokens: async () => {
        const { tokens } = get()
        if (!tokens?.refreshToken) {
          get().logout()
          return
        }

        // Simulate token refresh
        await new Promise((resolve) => setTimeout(resolve, 300))
        
        const newTokens = generateMockTokens()
        set({ tokens: newTokens })
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates } })
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'jira-lite-auth',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useUserRole = () => useAuthStore((state) => state.user?.role as UserRole | undefined)
