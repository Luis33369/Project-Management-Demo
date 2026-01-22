'use client'

import { useEffect } from 'react'
import { AppHeader } from '@/components/layout/app-header'
import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Flag, Shield, UserCog, Code } from 'lucide-react'
import type { UserRole } from '@/lib/types'

export default function FeatureFlagsPage() {
  const { featureFlags, fetchFeatureFlags, updateFeatureFlag, isLoading } = useAdminStore()

  useEffect(() => {
    fetchFeatureFlags()
  }, [fetchFeatureFlags])

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3 w-3" />
      case 'manager':
        return <UserCog className="h-3 w-3" />
      case 'developer':
        return <Code className="h-3 w-3" />
    }
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-primary/10 text-primary border-primary/30'
      case 'manager':
        return 'bg-chart-2/10 text-chart-2 border-chart-2/30'
      case 'developer':
        return 'bg-chart-3/10 text-chart-3 border-chart-3/30'
    }
  }

  const enabledCount = featureFlags.filter((f) => f.enabled).length

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'Feature Flags' },
        ]}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Feature Flags</h1>
            <p className="text-muted-foreground">
              Control feature availability across the application
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <Flag className="h-3.5 w-3.5" />
                  Total Flags
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{featureFlags.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1 text-status-done">
                  Enabled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{enabledCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1 text-muted-foreground">
                  Disabled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{featureFlags.length - enabledCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Flags List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {featureFlags.map((flag) => (
                <Card key={flag.id} className={!flag.enabled ? 'opacity-60' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Flag className={`h-4 w-4 ${flag.enabled ? 'text-status-done' : 'text-muted-foreground'}`} />
                          <h3 className="font-semibold">{flag.name}</h3>
                          <Badge
                            variant="outline"
                            className={flag.enabled
                              ? 'bg-status-done/10 text-status-done border-status-done/30'
                              : 'bg-muted text-muted-foreground'
                            }
                          >
                            {flag.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {flag.description}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-xs text-muted-foreground">Available to:</span>
                          <div className="flex gap-1">
                            {flag.roles.map((role) => (
                              <Badge
                                key={role}
                                variant="outline"
                                className={`text-xs capitalize ${getRoleBadgeColor(role)}`}
                              >
                                {getRoleIcon(role)}
                                <span className="ml-1">{role}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={flag.enabled}
                        onCheckedChange={(checked) => updateFeatureFlag(flag.id, { enabled: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
