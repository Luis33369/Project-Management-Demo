'use client'

import { useEffect, useState, useMemo } from 'react'
import { AppHeader } from '@/components/layout/app-header'
import { useTaskStore } from '@/store/task-store'
import { useProjectStore } from '@/store/project-store'
import { useAuthStore } from '@/store/auth-store'
import { KanbanBoard } from '@/components/tasks/kanban-board'
import { TaskList } from '@/components/tasks/task-list'
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RoleGate } from '@/components/auth/role-gate'
import { Plus, Search, LayoutGrid, List } from 'lucide-react'

export default function TasksPage() {
  const { tasks, fetchTasks, isLoading } = useTaskStore()
  const { projects, fetchProjects } = useProjectStore()
  const user = useAuthStore((state) => state.user)

  const [searchQuery, setSearchQuery] = useState('')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  useEffect(() => {
    fetchTasks()
    fetchProjects()
  }, [fetchTasks, fetchProjects])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesProject = projectFilter === 'all' || task.projectId === projectFilter
      
      const matchesAssignee = assigneeFilter === 'all' ||
        (assigneeFilter === 'me' && task.assigneeId === user?.id) ||
        (assigneeFilter === 'unassigned' && !task.assigneeId)

      return matchesSearch && matchesProject && matchesAssignee
    })
  }, [tasks, searchQuery, projectFilter, assigneeFilter, user?.id])

  return (
    <>
      <AppHeader breadcrumbs={[{ label: 'Tasks' }]} />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Tasks</h1>
              <p className="text-muted-foreground">
                View and manage tasks across all projects
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'board' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('board')}
                  className="rounded-r-none"
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Board
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </Button>
              </div>
              <RoleGate allowedRoles={['admin', 'manager']}>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </RoleGate>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="me">Assigned to Me</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          {viewMode === 'board' ? (
            <KanbanBoard tasks={filteredTasks} isLoading={isLoading} />
          ) : (
            <TaskList tasks={filteredTasks} isLoading={isLoading} />
          )}
        </div>
      </div>

      <CreateTaskDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  )
}

// loading.tsx
// export default function Loading() {
//   return null
// }
