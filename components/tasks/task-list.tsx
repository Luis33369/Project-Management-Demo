'use client'

import { useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTaskStore } from '@/store/task-store'
import { useAdminStore } from '@/store/admin-store'
import type { Task } from '@/lib/types'
import {
  MoreHorizontal,
  Calendar,
  CheckSquare,
  Circle,
  CircleDot,
  CheckCircle2,
  Trash2,
  Pencil,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskListProps {
  tasks: Task[]
  isLoading?: boolean
}

export function TaskList({ tasks, isLoading }: TaskListProps) {
  const { updateTaskStatus, deleteTask, selectTask } = useTaskStore()
  const { users, fetchUsers } = useAdminStore()

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers()
    }
  }, [users.length, fetchUsers])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Circle className="h-4 w-4 text-status-todo" />
      case 'in-progress':
        return <CircleDot className="h-4 w-4 text-status-in-progress" />
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-status-done" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

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

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
            <Skeleton className="h-4 w-4 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckSquare className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No tasks</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          No tasks found in this view.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const assignee = users.find((u) => u.id === task.assigneeId)
        const completedSubtasks = task.subtasks.filter((s) => s.completed).length

        return (
          <div
            key={task.id}
            className="group flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => selectTask(task)}
          >
            {/* Status Icon */}
            <div>{getStatusIcon(task.status)}</div>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className={cn(
                  "font-medium truncate",
                  task.status === 'done' && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h4>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className={`text-xs ${getStatusColor(task.status)}`}>
                  {task.status.replace('-', ' ')}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </Badge>
                {task.subtasks.length > 0 && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckSquare className="h-3 w-3" />
                    {completedSubtasks}/{task.subtasks.length}
                  </span>
                )}
                {task.dueDate && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Assignee */}
            {assignee && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {assignee.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); selectTask(task); }}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, 'todo'); }}
                  disabled={task.status === 'todo'}
                >
                  <Circle className="mr-2 h-4 w-4" />
                  Set To Do
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, 'in-progress'); }}
                  disabled={task.status === 'in-progress'}
                >
                  <CircleDot className="mr-2 h-4 w-4" />
                  Set In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, 'done'); }}
                  disabled={task.status === 'done'}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Set Done
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      })}
    </div>
  )
}
