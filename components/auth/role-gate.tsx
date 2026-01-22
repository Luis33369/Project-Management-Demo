'use client'

import type { ReactNode } from 'react'
import { useAuthStore } from '@/store/auth-store'
import type { UserRole, Permission } from '@/lib/types'
import { hasPermission } from '@/lib/types'

interface RoleGateProps {
  children: ReactNode
  allowedRoles?: UserRole[]
  permission?: Permission
  fallback?: ReactNode
}

export function RoleGate({ 
  children, 
  allowedRoles, 
  permission,
  fallback = null 
}: RoleGateProps) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <>{fallback}</>
  }

  // Check by role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }

  // Check by permission
  if (permission && !hasPermission(user.role, permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Hook version for conditional logic
export function useRoleGate() {
  const user = useAuthStore((state) => state.user)

  const checkRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false
    return allowedRoles.includes(user.role)
  }

  const checkPermission = (permission: Permission): boolean => {
    if (!user) return false
    return hasPermission(user.role, permission)
  }

  return {
    user,
    checkRole,
    checkPermission,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isDeveloper: user?.role === 'developer',
  }
}
