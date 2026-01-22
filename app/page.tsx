'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { Spinner } from '@/components/ui/spinner'

export default function HomePage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    // Small delay to allow hydration
    const timeout = setTimeout(() => {
      if (isAuthenticated) {
        if (user?.role === 'admin') {
          router.push('/admin/users')
        } else {
          router.push('/app/dashboard')
        }
      } else {
        router.push('/login')
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-8 h-8" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
