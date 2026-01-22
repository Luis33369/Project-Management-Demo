'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useProjectStore } from '@/store/project-store'
import { useAdminStore } from '@/store/admin-store'
import { RoleGate } from '@/components/auth/role-gate'
import type { Project, Task } from '@/lib/types'
import { MoreHorizontal, Archive, Pencil, Trash2, Users, CheckSquare } from 'lucide-react'
import { useEffect } from 'react'

interface ProjectCardProps {
  project: Project
  tasks: Task[]
}

export function ProjectCard({ project, tasks }: ProjectCardProps) {
  const { archiveProject } = useProjectStore()
  const { users, fetchUsers } = useAdminStore()

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers()
    }
  }, [users.length, fetchUsers])

  const completedTasks = tasks.filter((t) => t.status === 'done').length
  const totalTasks = tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const projectMembers = users.filter((u) => project.members.includes(u.id))

  const statusColors = {
    active: 'bg-status-done/10 text-status-done border-status-done/30',
    archived: 'bg-muted text-muted-foreground border-border',
    completed: 'bg-primary/10 text-primary border-primary/30',
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Link href={`/app/projects/${project.id}`} className="hover:underline">
              <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
            </Link>
            <Badge variant="outline" className={statusColors[project.status]}>
              {project.status}
            </Badge>
          </div>
          <RoleGate allowedRoles={['admin', 'manager']}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/app/projects/${project.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => archiveProject(project.id)}>
                  <Archive className="mr-2 h-4 w-4" />
                  {project.status === 'archived' ? 'Unarchive' : 'Archive'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </RoleGate>
        </div>
        <CardDescription className="line-clamp-2 min-h-[2.5rem]">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <CheckSquare className="h-3.5 w-3.5" />
              <span>Progress</span>
            </div>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>

        {/* Members */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>Team</span>
          </div>
          <div className="flex -space-x-2">
            {projectMembers.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {member.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {projectMembers.length > 4 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{projectMembers.length - 4}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
