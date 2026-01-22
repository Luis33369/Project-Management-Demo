'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { KanbanColumn } from './kanban-column'
import { KanbanCard } from './kanban-card'
import { useTaskStore } from '@/store/task-store'
import { useAdminStore } from '@/store/admin-store'
import type { Task, TaskStatus } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

interface KanbanBoardProps {
  tasks: Task[]
  isLoading?: boolean
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

export function KanbanBoard({ tasks, isLoading }: KanbanBoardProps) {
  const { updateTaskStatus } = useTaskStore()
  const { users, fetchUsers } = useAdminStore()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers()
    }
  }, [users.length, fetchUsers])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeTask = tasks.find((t) => t.id === active.id)
    if (!activeTask) return

    // Check if dropped on a column
    const overColumn = COLUMNS.find((col) => col.id === over.id)
    if (overColumn && activeTask.status !== overColumn.id) {
      updateTaskStatus(activeTask.id, overColumn.id)
      return
    }

    // Check if dropped on another task
    const overTask = tasks.find((t) => t.id === over.id)
    if (overTask && activeTask.status !== overTask.status) {
      updateTaskStatus(activeTask.id, overTask.status)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeTask = tasks.find((t) => t.id === active.id)
    if (!activeTask) return

    // Check if over a column
    const overColumn = COLUMNS.find((col) => col.id === over.id)
    if (overColumn) return

    // Check if over another task
    const overTask = tasks.find((t) => t.id === over.id)
    if (overTask && activeTask.id !== overTask.id) {
      // Could implement task reordering here
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((column) => (
          <div key={column.id} className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[600px]">
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.id)
          return (
            <SortableContext
              key={column.id}
              items={columnTasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                id={column.id}
                title={column.title}
                tasks={columnTasks}
                users={users}
              />
            </SortableContext>
          )
        })}
      </div>
      <DragOverlay>
        {activeTask ? (
          <KanbanCard
            task={activeTask}
            assignee={users.find((u) => u.id === activeTask.assigneeId)}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
