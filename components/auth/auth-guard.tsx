'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import type { UserRole } from '@/lib/types'
import { Spinner } from '@/components/ui/spinner'

interface AuthGuardProps {
  children: ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  allowedRoles, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Wait for hydration
    const checkAuth = () => {
      const state = useAuthStore.getState()
      
      if (!state.isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (allowedRoles && state.user && !allowedRoles.includes(state.user.role)) {
        // Redirect to appropriate page based on role
        if (state.user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/app/projects')
        }
        return
      }

      setIsChecking(false)
    }

    // Small delay to ensure hydration
    const timeout = setTimeout(checkAuth, 100)
    return () => clearTimeout(timeout)
  }, [isAuthenticated, user, allowedRoles, redirectTo, router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
