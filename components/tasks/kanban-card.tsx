'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useTaskStore } from '@/store/task-store'
import type { Task, User } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Calendar, MessageSquare, CheckSquare, GripVertical } from 'lucide-react'

interface KanbanCardProps {
  task: Task
  assignee?: User
  isDragging?: boolean
}

export function KanbanCard({ task, assignee, isDragging }: KanbanCardProps) {
  const { selectTask } = useTaskStore()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'cursor-pointer hover:shadow-md transition-all bg-background',
        (isDragging || isSortableDragging) && 'opacity-50 shadow-lg rotate-2',
        isDragging && 'shadow-xl'
      )}
      onClick={() => selectTask(task)}
    >
      <CardContent className="p-3">
        {/* Drag Handle + Title */}
        <div className="flex items-start gap-2">
          <div
            {...attributes}
            {...listeners}
            className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "font-medium text-sm line-clamp-2",
              task.status === 'done' && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h4>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-2 ml-6">
            {task.description}
          </p>
        )}

        {/* Metadata Row */}
        <div className="flex items-center justify-between mt-3 ml-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </Badge>
            
            {task.dueDate && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 ml-6">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {task.subtasks.length > 0 && (
              <span className="flex items-center gap-1">
                <CheckSquare className="h-3 w-3" />
                {completedSubtasks}/{task.subtasks.length}
              </span>
            )}
            {task.comments.length > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {task.comments.length}
              </span>
            )}
          </div>

          {assignee && (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {assignee.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
