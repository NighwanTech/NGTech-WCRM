"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, CheckCircle2, Rocket, RotateCcw, Sparkles, ShieldAlert, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface SystemNotification {
  id: string
  title: string
  message: string
  type: 'publish_success' | 'publish_failed' | 'simulation_complete' | 'approval_required' | 'rollback_complete' | 'sync_completed'
  timestamp: string
  read: boolean
}

/**
 * FIX 20 — Enterprise Notification Center
 */
export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const [notifications, setNotifications] = useState<SystemNotification[]>([])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'publish_success': return <Rocket className="w-4 h-4 text-emerald-500" />
      case 'publish_failed': return <ShieldAlert className="w-4 h-4 text-destructive" />
      case 'simulation_complete': return <Sparkles className="w-4 h-4 text-primary" />
      case 'approval_required': return <CheckCircle2 className="w-4 h-4 text-amber-500" />
      case 'rollback_complete': return <RotateCcw className="w-4 h-4 text-purple-500" />
      default: return <Bell className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => setOpen(!open)}
        className="relative h-8 w-8 rounded-lg"
        title="Notification Center"
      >
        <Bell className="w-4 h-4 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground font-bold text-[9px] rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border bg-popover text-popover-foreground shadow-xl z-50 overflow-hidden text-xs">
          <div className="p-3 bg-muted/40 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm">System Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 font-bold">
                  {unreadCount} New
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-[10px] text-primary hover:underline font-bold">
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 transition-colors flex items-start gap-2.5 ${
                    !n.read ? 'bg-primary/5' : 'hover:bg-muted/20'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">{getIcon(n.type)}</div>
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-foreground truncate">{n.title}</p>
                      <span className="text-[9px] text-muted-foreground font-mono">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{n.message}</p>
                  </div>
                  <button onClick={() => removeNotification(n.id)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground text-xs font-medium">
                No notifications right now.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
