'use client'

import { useEffect } from 'react'
import { AppHeader } from '@/components/layout/app-header'
import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  FolderKanban,
  CheckSquare,
  Zap,
  AlertTriangle,
  Clock,
  Activity,
  Server,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

// Mock chart data
const activityData = [
  { name: 'Mon', users: 32, tasks: 45 },
  { name: 'Tue', users: 45, tasks: 52 },
  { name: 'Wed', users: 38, tasks: 48 },
  { name: 'Thu', users: 52, tasks: 61 },
  { name: 'Fri', users: 48, tasks: 55 },
  { name: 'Sat', users: 22, tasks: 28 },
  { name: 'Sun', users: 18, tasks: 22 },
]

const latencyData = [
  { time: '00:00', latency: 42 },
  { time: '04:00', latency: 38 },
  { time: '08:00', latency: 55 },
  { time: '12:00', latency: 62 },
  { time: '16:00', latency: 48 },
  { time: '20:00', latency: 45 },
]

export default function MetricsPage() {
  const { systemMetrics, fetchSystemMetrics, isLoading } = useAdminStore()

  useEffect(() => {
    fetchSystemMetrics()
  }, [fetchSystemMetrics])

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'System Metrics' },
        ]}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">System Metrics</h1>
            <p className="text-muted-foreground">
              Monitor system performance and usage statistics
            </p>
          </div>

          {/* Primary Stats */}
          {isLoading || !systemMetrics ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    Active Users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.activeUsers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1">
                    <FolderKanban className="h-3.5 w-3.5 text-chart-2" />
                    Projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.totalProjects}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1">
                    <CheckSquare className="h-3.5 w-3.5 text-chart-3" />
                    Tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.totalTasks}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-chart-4" />
                    API Latency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.apiLatency}ms</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-priority-high" />
                    Error Rate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.errorRate}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1">
                    <Server className="h-3.5 w-3.5 text-status-done" />
                    Uptime
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.uptime}%</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Weekly Activity
                </CardTitle>
                <CardDescription>
                  User activity and task completion over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    users: {
                      label: 'Active Users',
                      color: 'hsl(var(--chart-1))',
                    },
                    tasks: {
                      label: 'Tasks Completed',
                      color: 'hsl(var(--chart-2))',
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="tasks" fill="var(--color-tasks)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Latency Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  API Latency
                </CardTitle>
                <CardDescription>
                  Average API response time throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    latency: {
                      label: 'Latency (ms)',
                      color: 'hsl(var(--chart-3))',
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={latencyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="latency"
                        stroke="var(--color-latency)"
                        fill="var(--color-latency)"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Health</CardTitle>
              <CardDescription>
                Current status of system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">API Server</span>
                  </div>
                  <Badge className="bg-status-done/10 text-status-done border-status-done/30">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Database</span>
                  </div>
                  <Badge className="bg-status-done/10 text-status-done border-status-done/30">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Cache</span>
                  </div>
                  <Badge className="bg-status-done/10 text-status-done border-status-done/30">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Background Jobs</span>
                  </div>
                  <Badge className="bg-status-in-progress/10 text-status-in-progress border-status-in-progress/30">
                    Running
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
