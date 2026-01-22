'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from './kanban-card'
import type { Task, TaskStatus, User } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Circle, CircleDot, CheckCircle2 } from 'lucide-react'

interface KanbanColumnProps {
  id: TaskStatus
  title: string
  tasks: Task[]
  users: User[]
}

export function KanbanColumn({ id, title, tasks, users }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  const getColumnIcon = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return <Circle className="h-4 w-4" />
      case 'in-progress':
        return <CircleDot className="h-4 w-4" />
      case 'done':
        return <CheckCircle2 className="h-4 w-4" />
    }
  }

  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return 'text-status-todo border-status-todo/30 bg-status-todo/5'
      case 'in-progress':
        return 'text-status-in-progress border-status-in-progress/30 bg-status-in-progress/5'
      case 'done':
        return 'text-status-done border-status-done/30 bg-status-done/5'
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-lg border p-3 min-h-[200px] transition-colors',
        getColumnColor(id),
        isOver && 'ring-2 ring-primary/50 bg-primary/5'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        {getColumnIcon(id)}
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="ml-auto text-xs bg-background/80 px-2 py-0.5 rounded-full border">
          {tasks.length}
        </span>
      </div>

      {/* Task Cards */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 overflow-auto">
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-sm text-muted-foreground border border-dashed rounded-lg bg-background/50">
              No tasks
            </div>
          ) : (
            tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                assignee={users.find((u) => u.id === task.assigneeId)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}
