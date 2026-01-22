'use client'

import { useEffect } from 'react'
import { AppHeader } from '@/components/layout/app-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth-store'
import { useProjectStore } from '@/store/project-store'
import { useTaskStore } from '@/store/task-store'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  FolderKanban,
  CheckSquare,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { projects, fetchProjects, isLoading: projectsLoading } = useProjectStore()
  const { tasks, fetchTasks, isLoading: tasksLoading } = useTaskStore()

  useEffect(() => {
    fetchProjects()
    fetchTasks()
  }, [fetchProjects, fetchTasks])

  const activeProjects = projects.filter((p) => p.status === 'active')
  const myTasks = tasks.filter((t) => t.assigneeId === user?.id)
  const todoTasks = myTasks.filter((t) => t.status === 'todo')
  const inProgressTasks = myTasks.filter((t) => t.status === 'in-progress')
  const completedTasks = myTasks.filter((t) => t.status === 'done')

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-status-todo/10 text-status-todo border-status-todo/30'
      case 'in-progress':
        return 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/30'
      case 'done':
        return 'bg-status-done/10 text-status-done border-status-done/30'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-priority-urgent/10 text-priority-urgent border-priority-urgent/30'
      case 'high':
        return 'bg-priority-high/10 text-priority-high border-priority-high/30'
      case 'medium':
        return 'bg-priority-medium/10 text-priority-medium border-priority-medium/30'
      case 'low':
        return 'bg-priority-low/10 text-priority-low border-priority-low/30'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <>
      <AppHeader breadcrumbs={[{ label: 'Dashboard' }]} />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-2xl font-bold text-balance">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s what&apos;s happening with your projects today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{activeProjects.length}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {projects.length} total projects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{myTasks.length}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {inProgressTasks.length} in progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">To Do</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{todoTasks.length}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  Tasks waiting to start
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{completedTasks.length}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Projects */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Tasks</CardTitle>
                  <CardDescription>Latest task activity across all projects</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/app/tasks">
                    View all
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {task.title.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={`text-xs ${getStatusColor(task.status)}`}>
                              {task.status.replace('-', ' ')}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Projects */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>Projects you&apos;re currently working on</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/app/projects">
                    View all
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeProjects.slice(0, 4).map((project) => {
                      const projectTasks = tasks.filter((t) => t.projectId === project.id)
                      const completedCount = projectTasks.filter((t) => t.status === 'done').length
                      const progress = projectTasks.length > 0 
                        ? Math.round((completedCount / projectTasks.length) * 100) 
                        : 0

                      return (
                        <Link
                          key={project.id}
                          href={`/app/projects/${project.id}`}
                          className="block p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{project.name}</h4>
                            <span className="text-xs text-muted-foreground">
                              {completedCount}/{projectTasks.length} tasks
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                            {project.description}
                          </p>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
