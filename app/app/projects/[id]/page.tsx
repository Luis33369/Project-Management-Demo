'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AppHeader } from '@/components/layout/app-header'
import { useProjectStore } from '@/store/project-store'
import { useTaskStore } from '@/store/task-store'
import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskList } from '@/components/tasks/task-list'
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog'
import { RoleGate } from '@/components/auth/role-gate'
import {
  Plus,
  Calendar,
  Users,
  CheckSquare,
  LayoutGrid,
  List,
} from 'lucide-react'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  
  const { projects, fetchProjects, isLoading: projectsLoading } = useProjectStore()
  const { tasks, fetchTasks, isLoading: tasksLoading } = useTaskStore()
  const { users, fetchUsers } = useAdminStore()
  
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list')

  useEffect(() => {
    fetchProjects()
    fetchTasks(projectId)
    fetchUsers()
  }, [fetchProjects, fetchTasks, fetchUsers, projectId])

  const project = projects.find((p) => p.id === projectId)
  const projectTasks = tasks.filter((t) => t.projectId === projectId)
  const projectMembers = users.filter((u) => project?.members.includes(u.id))

  const todoTasks = projectTasks.filter((t) => t.status === 'todo')
  const inProgressTasks = projectTasks.filter((t) => t.status === 'in-progress')
  const doneTasks = projectTasks.filter((t) => t.status === 'done')

  const completedTasks = doneTasks.length
  const totalTasks = projectTasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  if (projectsLoading || !project) {
    return (
      <>
        <AppHeader breadcrumbs={[{ label: 'Projects', href: '/app/projects' }, { label: 'Loading...' }]} />
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: 'Projects', href: '/app/projects' },
          { label: project.name },
        ]}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Project Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <Badge
                  variant="outline"
                  className={
                    project.status === 'active'
                      ? 'bg-status-done/10 text-status-done border-status-done/30'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {project.status}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">{project.description}</p>
            </div>
            <RoleGate allowedRoles={['admin', 'manager']}>
              <Button onClick={() => setCreateTaskOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </RoleGate>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <CheckSquare className="h-3.5 w-3.5" />
                  Total Tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTasks}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1 text-status-todo">
                  To Do
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todoTasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1 text-status-in-progress">
                  In Progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressTasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1 text-status-done">
                  Completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{doneTasks.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Project Progress</CardTitle>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {projectMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 rounded-lg border bg-card p-2 pr-4"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {member.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Tasks</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'board' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('board')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All ({projectTasks.length})</TabsTrigger>
                  <TabsTrigger value="todo">To Do ({todoTasks.length})</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress ({inProgressTasks.length})</TabsTrigger>
                  <TabsTrigger value="done">Done ({doneTasks.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <TaskList tasks={projectTasks} isLoading={tasksLoading} />
                </TabsContent>
                <TabsContent value="todo" className="mt-4">
                  <TaskList tasks={todoTasks} isLoading={tasksLoading} />
                </TabsContent>
                <TabsContent value="in-progress" className="mt-4">
                  <TaskList tasks={inProgressTasks} isLoading={tasksLoading} />
                </TabsContent>
                <TabsContent value="done" className="mt-4">
                  <TaskList tasks={doneTasks} isLoading={tasksLoading} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateTaskDialog
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        projectId={projectId}
      />
    </>
  )
}
