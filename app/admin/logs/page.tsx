'use client'

import { useEffect, useState, useMemo } from 'react'
import { AppHeader } from '@/components/layout/app-header'
import { useAdminStore } from '@/store/admin-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  FileText,
  Info,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Filter,
} from 'lucide-react'
import type { SystemLog } from '@/lib/types'

export default function LogsPage() {
  const { systemLogs, fetchSystemLogs, isLoading } = useAdminStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')

  useEffect(() => {
    fetchSystemLogs()
  }, [fetchSystemLogs])

  const sources = useMemo(() => {
    return [...new Set(systemLogs.map((log) => log.source))]
  }, [systemLogs])

  const filteredLogs = useMemo(() => {
    return systemLogs.filter((log) => {
      const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.source.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLevel = levelFilter === 'all' || log.level === levelFilter
      const matchesSource = sourceFilter === 'all' || log.source === sourceFilter
      return matchesSearch && matchesLevel && matchesSource
    })
  }, [systemLogs, searchQuery, levelFilter, sourceFilter])

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4 text-primary" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-priority-high" />
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'bg-primary/10 text-primary border-primary/30'
      case 'warning':
        return 'bg-priority-high/10 text-priority-high border-priority-high/30'
      case 'error':
        return 'bg-destructive/10 text-destructive border-destructive/30'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // Stats
  const infoCount = systemLogs.filter((l) => l.level === 'info').length
  const warningCount = systemLogs.filter((l) => l.level === 'warning').length
  const errorCount = systemLogs.filter((l) => l.level === 'error').length

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'System Logs' },
        ]}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">System Logs</h1>
              <p className="text-muted-foreground">
                View and filter system logs and events
              </p>
            </div>
            <Button variant="outline" onClick={() => fetchSystemLogs()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  Total Logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemLogs.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <Info className="h-3.5 w-3.5 text-primary" />
                  Info
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{infoCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-priority-high" />
                  Warnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{warningCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5 text-destructive" />
                  Errors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{errorCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Logs List */}
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No logs found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters to see more results.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        {getLevelIcon(log.level)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={`text-xs ${getLevelBadgeColor(log.level)}`}>
                              {log.level}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {log.source}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{log.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
