'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, useMemo, useCallback } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useTotalUnread } from "@/hooks/use-total-unread"
import { useNavigation } from "./navigation-provider"
import { usePermissions } from "@/hooks/use-permissions"
import {
  Crown,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
  User,
  UserCog,
  X,
  ChevronDown,
  Search,
  Building,
  Star,
  Clock,
  ChevronsUpDown,
  Settings,
  Lock,
} from "lucide-react"
import type { AccountRole } from "@/lib/auth/roles"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { CommandPalette } from "./command-palette"
import { NAVIGATION_CONFIG } from "@/config/navigation"

// ─── Constants & Color Mapping ────────────────────────────────────────

const ROLE_CHIP: Record<AccountRole, { icon: typeof Crown; label: string; className: string }> = {
  owner:   { icon: Crown,   label: "Owner",   className: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
  admin:   { icon: Shield,  label: "Admin",   className: "border-primary/40 bg-primary/10 text-primary" },
  manager: { icon: UserCog,  label: "Manager", className: "border-blue-500/40 bg-blue-500/10 text-blue-400" },
  agent:   { icon: UserCog,  label: "Agent",   className: "border-border bg-muted text-foreground" },
  client:  { icon: User,    label: "Client",  className: "border-purple-500/40 bg-purple-500/10 text-purple-400" },
  viewer:  { icon: User,    label: "Viewer",  className: "border-border bg-card text-muted-foreground" },
}

/** Groups that remain permanently expanded without collapse capability (empty to allow show/hide on all groups) */
const PERMANENT_GROUPS: string[] = []

/** Badge styling mapping */
const BADGE_COLORS: Record<string, string> = {
  'New':    'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  'Beta':   'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  'Alert':  'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
  'Update': 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
}

const DEFAULT_GROUP_COLOR = {
  iconText: 'text-primary',
  iconBg: 'bg-primary/10',
  iconBorder: 'border-primary/25',
  activeBorder: 'border-primary',
  activeBg: 'bg-primary/10',
}

/** Group color token definitions for custom tinted styles */
const GROUP_COLOR_MAP: Record<string, {
  iconText: string
  iconBg: string
  iconBorder: string
  activeBorder: string
  activeBg: string
}> = {
  home: {
    iconText: 'text-indigo-500 dark:text-indigo-400',
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    iconBorder: 'border-indigo-500/25',
    activeBorder: 'border-indigo-500',
    activeBg: 'bg-indigo-500/8 dark:bg-indigo-500/12',
  },
  marketing: {
    iconText: 'text-amber-500 dark:text-amber-400',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    iconBorder: 'border-amber-500/25',
    activeBorder: 'border-amber-500',
    activeBg: 'bg-amber-500/8 dark:bg-amber-500/12',
  },
  'lead-hub': {
    iconText: 'text-emerald-500 dark:text-emerald-400',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    iconBorder: 'border-emerald-500/25',
    activeBorder: 'border-emerald-500',
    activeBg: 'bg-emerald-500/8 dark:bg-emerald-500/12',
  },
  crm: {
    iconText: 'text-blue-500 dark:text-blue-400',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    iconBorder: 'border-blue-500/25',
    activeBorder: 'border-blue-500',
    activeBg: 'bg-blue-500/8 dark:bg-blue-500/12',
  },
  sales: {
    iconText: 'text-amber-500 dark:text-amber-400',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    iconBorder: 'border-amber-500/25',
    activeBorder: 'border-amber-500',
    activeBg: 'bg-amber-500/8 dark:bg-amber-500/12',
  },
  finance: {
    iconText: 'text-emerald-500 dark:text-emerald-400',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    iconBorder: 'border-emerald-500/25',
    activeBorder: 'border-emerald-500',
    activeBg: 'bg-emerald-500/8 dark:bg-emerald-500/12',
  },
  success: {
    iconText: 'text-rose-500 dark:text-rose-400',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    iconBorder: 'border-rose-500/25',
    activeBorder: 'border-rose-500',
    activeBg: 'bg-rose-500/8 dark:bg-rose-500/12',
  },
  ai: {
    iconText: 'text-cyan-500 dark:text-cyan-400',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    iconBorder: 'border-cyan-500/25',
    activeBorder: 'border-cyan-500',
    activeBg: 'bg-cyan-500/8 dark:bg-cyan-500/12',
  },
  automation: {
    iconText: 'text-pink-500 dark:text-pink-400',
    iconBg: 'bg-pink-500/10 dark:bg-pink-500/15',
    iconBorder: 'border-pink-500/25',
    activeBorder: 'border-pink-500',
    activeBg: 'bg-pink-500/8 dark:bg-pink-500/12',
  },
  analytics: {
    iconText: 'text-teal-500 dark:text-teal-400',
    iconBg: 'bg-teal-500/10 dark:bg-teal-500/15',
    iconBorder: 'border-teal-500/25',
    activeBorder: 'border-teal-500',
    activeBg: 'bg-teal-500/8 dark:bg-teal-500/12',
  },
  integrations: {
    iconText: 'text-indigo-500 dark:text-indigo-400',
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    iconBorder: 'border-indigo-500/25',
    activeBorder: 'border-indigo-500',
    activeBg: 'bg-indigo-500/8 dark:bg-indigo-500/12',
  },
  settings: {
    iconText: 'text-slate-500 dark:text-slate-400',
    iconBg: 'bg-slate-500/10 dark:bg-slate-500/15',
    iconBorder: 'border-slate-500/25',
    activeBorder: 'border-slate-500',
    activeBg: 'bg-slate-500/8 dark:bg-slate-500/12',
  },
}

// ─── Component ───────────────────────────────────────────────────────

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const tHeader = useTranslations('Header')
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const { user, profile, profileLoading, account, accountRole, enabledMenus, signOut } = useAuth()
  const totalUnread = useTotalUnread()
  const { can } = usePermissions()
  const {
    groups,
    expandedGroups,
    favorites,
    recentlyVisited,
    activeWorkspace,
    toggleGroup,
    logVisit,
  } = useNavigation()

  const showAccountStrip = !profileLoading && !!account?.name && account.name !== profile?.full_name
  const isTrialActive = account?.plan === 'free' && account.trial_ends_at && new Date(account.trial_ends_at).getTime() > new Date().getTime()

  // ── Auto-expand active section on route change ──
  useEffect(() => {
    onClose?.()
    logVisit(pathname)

    const activeGroup = groups.find(g =>
      g.items.some(i => pathname === i.href || (i.href !== "/dashboard" && pathname.startsWith(i.href.split('?')[0])))
    )
    if (activeGroup && !expandedGroups.includes(activeGroup.id) && !PERMANENT_GROUPS.includes(activeGroup.id)) {
      toggleGroup(activeGroup.id)
    }
  }, [pathname, groups])

  // ── Mobile drawer body lock ──
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  // ── Permission check ──
  const canAccess = useCallback((href: string, permission?: string) => {
    if (profileLoading) return true
    if (permission && !can(permission as any)) return false
    if (isTrialActive) return true
    const baseHref = href.split('?')[0]
    if ([
      '/meta-ads', '/dashboard', '/settings/security', '/intelligence/voice', 
      '/decisions', '/settings', '/sales/proposals', '/sales/quotations', 
      '/finance', '/finance/collections', '/pipelines', '/contacts'
    ].includes(baseHref)) return true
    return enabledMenus.length > 0 ? (enabledMenus.includes(href) || enabledMenus.includes(baseHref)) : true
  }, [profileLoading, enabledMenus, isTrialActive, can])

  // ── Badge count helpers ──
  const getGroupBadge = useCallback((groupId: string) => {
    if (groupId === 'workspace' && totalUnread > 0) return totalUnread
    return 0
  }, [totalUnread])

  const getItemBadgeCount = useCallback((itemId: string) => {
    if (itemId === 'inbox' && totalUnread > 0) return totalUnread
    return 0
  }, [totalUnread])

  // ── Filtered groups & favorites ──
  const visibleGroups = useMemo(() =>
    groups
      .map(group => ({
        ...group,
        items: group.items.filter(item => canAccess(item.href, item.permission)),
      }))
      .filter(group => group.items.length > 0),
    [groups, canAccess]
  )

  const favoriteItems = useMemo(
    () => NAVIGATION_CONFIG.flatMap(g => g.items)
      .filter(i => favorites.includes(i.id))
      .filter(item => canAccess(item.href, item.permission)),
    [favorites, canAccess]
  )

  // ── Route matching ──
  const isItemActive = useCallback((href: string) => {
    const baseHref = href.split('?')[0]
    if (pathname === href || pathname === baseHref) return true

    // Check if another nav item is an exact match or a more specific prefix match
    const allHrefs = visibleGroups.flatMap(g => g.items.map(i => i.href.split('?')[0]))
    const hasMoreSpecificMatch = allHrefs.some(h => h !== baseHref && (pathname === h || (pathname.startsWith(h + '/') && h.length > baseHref.length)))

    if (hasMoreSpecificMatch) return false
    return baseHref !== "/dashboard" && pathname.startsWith(baseHref + '/')
  }, [pathname, visibleGroups])

  // ── Badge renderer ──
  const renderItemBadge = useCallback((item: { id: string; badge?: string }) => {
    const count = getItemBadgeCount(item.id)
    if (count > 0) {
      return (
        <Badge className="bg-primary text-primary-foreground h-[18px] px-1.5 min-w-[20px] flex items-center justify-center text-[10px] font-bold border-0 rounded-full">
          {count}
        </Badge>
      )
    }
    if (item.badge && BADGE_COLORS[item.badge]) {
      return (
        <Badge variant="outline" className={cn("h-[18px] px-1.5 text-[9px] uppercase tracking-wider font-bold border rounded-full", BADGE_COLORS[item.badge])}>
          {item.badge}
        </Badge>
      )
    }
    return null
  }, [getItemBadgeCount])

  // ── Workspace info ──
  const workspaceName = activeWorkspace?.name || account?.name || 'AIWCRM'
  const workspaceInitial = workspaceName.charAt(0).toUpperCase()
  const orgLogoUrl = (account as any)?.logo_url || activeWorkspace?.brandIcon || '/logo.svg'

  return (
    <>
      <CommandPalette />

      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "h-full flex flex-col border-r border-border/70 bg-card select-none",
          "transition-[width,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[width,transform]",
          // Mobile: full drawer
          "fixed inset-y-0 left-0 z-50 w-[var(--sidebar-mobile-width)] shadow-2xl",
          open ? "translate-x-0" : "-translate-x-full",
          // Desktop & Tablet: static flex column
          "md:static md:translate-x-0 md:shadow-none md:z-20 shrink-0",
          collapsed ? "md:w-[var(--sidebar-rail-width)]" : "md:w-[var(--sidebar-width)]",
        )}
        aria-label="Primary navigation"
      >
        {/* ━━━ Header / Brand & Workspace Switcher ━━━━━━━━━━━━━━━━ */}
        <div className="flex h-[56px] shrink-0 items-center justify-between px-3 border-b border-border/60 bg-background/50">
          {!collapsed ? (
            /* Expanded Header */
            <div className="flex items-center justify-between w-full min-w-0 gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-2.5 min-w-0 rounded-lg p-1.5 -ml-1 hover:bg-accent/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/20 text-left group"
                >
                  {/* Workspace Avatar / Organization Logo */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shadow-2xs transition-transform group-hover:scale-105 overflow-hidden p-0.5">
                    <img 
                      src={orgLogoUrl} 
                      alt={workspaceName} 
                      className="h-full w-full rounded-md object-contain" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo.png'
                      }}
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[13px] font-bold text-foreground truncate leading-tight tracking-tight">
                      {workspaceName}
                    </span>
                    <span className="text-[10.5px] text-muted-foreground font-medium leading-tight truncate">
                      Enterprise Workspace
                    </span>
                  </div>
                  <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 group-hover:text-foreground transition-colors ml-0.5" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" sideOffset={8} className="w-72 rounded-xl bg-background/95 backdrop-blur-xl shadow-2xl border-border/60 p-1.5">
                  <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                    Workspace
                  </div>
                  
                  {/* Current workspace card */}
                  <div className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg bg-accent/50 border border-border/50 mx-1 mb-1">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/25 font-bold text-primary text-sm overflow-hidden p-0.5">
                      <img 
                        src={orgLogoUrl} 
                        alt={workspaceName} 
                        className="h-full w-full rounded-md object-contain" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo.png'
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-foreground truncate">{workspaceName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{account?.plan === 'free' ? 'Free Tier' : 'Enterprise Plan'}</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-bold uppercase border-emerald-500/30 text-emerald-500 bg-emerald-500/10 px-1.5 h-5">
                      Active
                    </Badge>
                  </div>

                  <DropdownMenuSeparator className="my-1 bg-border/40" />

                  {/* Switch workspace slot */}
                  <DropdownMenuItem disabled className="rounded-lg p-2 opacity-50 cursor-not-allowed">
                    <Lock className="size-4 mr-2.5 opacity-50" />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium">Switch Workspace</span>
                      <span className="text-[10px] text-muted-foreground">Multi-workspace in future release</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 bg-border/40" />

                  <DropdownMenuItem
                    render={<Link href="/settings?tab=overview" className="w-full flex items-center" />}
                    className="rounded-lg p-2 cursor-pointer hover:bg-muted focus:bg-muted"
                  >
                    <Settings className="size-4 mr-2.5 opacity-60" />
                    <span className="text-[13px] font-medium">Workspace Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    render={<Link href="/settings?tab=profile" className="w-full flex items-center" />}
                    className="rounded-lg p-2 cursor-pointer hover:bg-muted focus:bg-muted"
                  >
                    <Building className="size-4 mr-2.5 opacity-60" />
                    <span className="text-[13px] font-medium">Organization Profile</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Collapse button (desktop) */}
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="hidden md:flex shrink-0 h-7 w-7 items-center justify-center rounded-md text-muted-foreground/70 hover:bg-accent hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                aria-label="Collapse sidebar"
                title="Collapse sidebar (Rail Mode)"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>

              {/* Close button (mobile) */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground md:hidden transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* Collapsed (Rail) Header */
            <div className="flex items-center justify-center w-full px-1">
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                title={`Expand Sidebar (${workspaceName})`}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/20 mx-auto overflow-hidden"
                aria-label="Expand sidebar"
              >
                <img 
                  src={orgLogoUrl} 
                  alt={workspaceName} 
                  className="h-full w-full rounded-md object-contain" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png'
                  }}
                />
              </button>
            </div>
          )}
        </div>

        {/* ━━━ Global Workspace Search (⌘K) ━━━━━━━━━━━━━━━━━━━━━━━ */}
        {!collapsed ? (
          <div className="px-3 pt-3 pb-1 shrink-0">
            <button
              type="button"
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className={cn(
                "flex w-full items-center justify-between text-[12.5px] text-muted-foreground/80 bg-background rounded-lg px-2.5 py-1.5 cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/20 group",
                "border border-border/70 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:border-border hover:text-foreground"
              )}
              aria-label="Search Workspace"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-primary/80 transition-opacity" />
                <span className="font-medium">Search AIWCRM...</span>
              </div>
              <kbd className="font-sans font-semibold bg-muted/80 border border-border/60 rounded text-[10px] px-1.5 py-0.5 text-muted-foreground/80">
                ⌘K
              </kbd>
            </button>
          </div>
        ) : (
          <div className="flex justify-center py-2 shrink-0">
            <button
              type="button"
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground/70 hover:bg-accent hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              aria-label="Search (⌘K)"
              title="Search (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ━━━ Main Navigation Scroll Area ━━━━━━━━━━━━━━━━━━━━━━━ */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2.5 hide-scrollbar space-y-3" aria-label="Main menu">

          {/* ── Pinned Favorites (Expanded only) ── */}
          {!collapsed && favoriteItems.length > 0 && (
            <div className="mb-2">
              <div className="px-2 mb-1 flex items-center gap-1.5">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500/20" />
                <span className="text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground/70 uppercase">
                  Favorites
                </span>
              </div>
              <ul className="flex flex-col gap-0.5">
                {favoriteItems.map(item => {
                  const active = isItemActive(item.href)
                  return (
                    <li key={`fav-${item.id}`}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-[6px] text-[13px] transition-all duration-150 group outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                          active
                            ? "bg-primary/10 text-foreground font-semibold border-l-[3px] border-primary pl-[7px] shadow-sm"
                            : "text-muted-foreground font-medium hover:bg-accent/50 hover:text-foreground border-l-[3px] border-transparent pl-[7px]",
                        )}
                      >
                        <item.icon className={cn("h-4 w-4 shrink-0 transition-colors duration-150", active ? "text-primary" : "opacity-60 group-hover:opacity-100")} />
                        <span className="flex-1 truncate">{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* ── Recently Visited (Expanded only) ── */}
          {!collapsed && recentlyVisited.length > 0 && (
            <div className="mb-2">
              <div className="px-2 mb-1 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-muted-foreground/60" />
                <span className="text-[10.5px] font-bold tracking-[0.06em] text-muted-foreground/70 uppercase">
                  Recent
                </span>
              </div>
              <ul className="flex flex-col gap-0.5">
                {recentlyVisited.map(item => {
                  const active = isItemActive(item.href)
                  const ItemIcon = item.icon
                  return (
                    <li key={`recent-${item.itemId}`}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-[6px] text-[13px] transition-all duration-150 group outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                          active
                            ? "bg-primary/10 text-foreground font-semibold border-l-[3px] border-primary pl-[7px] shadow-sm"
                            : "text-muted-foreground/80 font-medium hover:bg-accent/50 hover:text-foreground border-l-[3px] border-transparent pl-[7px]",
                        )}
                      >
                        <ItemIcon className={cn("h-3.5 w-3.5 shrink-0 transition-colors duration-150", active ? "text-primary" : "opacity-50 group-hover:opacity-80")} />
                        <span className="flex-1 truncate">{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* ── Core Navigation Groups ── */}
          <div className="flex flex-col gap-1.5">
            {visibleGroups.map((group) => {
              const isPermanent = PERMANENT_GROUPS.includes(group.id)
              const isExpanded = isPermanent || expandedGroups.includes(group.id)
              const groupBadge = getGroupBadge(group.id)
              const GroupIcon = group.groupIcon
              const isSingleItem = group.items.length === 1
              const hasActiveItem = group.items.some(i => isItemActive(i.href))
              const colors = GROUP_COLOR_MAP[group.id] || DEFAULT_GROUP_COLOR

              return (
                <div key={group.id} className="flex flex-col">

                  {/* ════ EXPANDED MODE (Default Desktop Experience) ════ */}
                  {!collapsed ? (
                    <div>
                      {isSingleItem ? (
                        /* Single-Item Card Link (e.g. Settings) */
                        <Link
                          href={group.items[0].href}
                          aria-current={isItemActive(group.items[0].href) ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between w-full rounded-lg px-2 py-1.5 transition-all duration-150 group outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                            isItemActive(group.items[0].href)
                              ? cn(colors.activeBg, "border border-border/70 shadow-sm")
                              : "hover:bg-accent/50 border border-transparent hover:border-border/40",
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-150",
                              colors.iconBg, colors.iconBorder,
                            )}>
                              <GroupIcon className={cn("w-4 h-4 transition-colors", colors.iconText)} />
                            </div>
                            <span className={cn(
                              "text-[12px] font-bold uppercase tracking-[0.05em] truncate transition-colors",
                              isItemActive(group.items[0].href) ? "text-foreground" : "text-muted-foreground/80 group-hover:text-foreground"
                            )}>
                              {group.label}
                            </span>
                          </div>
                          {groupBadge > 0 && (
                            <Badge className="bg-primary text-primary-foreground h-[18px] px-1.5 min-w-[20px] text-[10px] font-bold border-0 rounded-full">
                              {groupBadge}
                            </Badge>
                          )}
                        </Link>
                      ) : (
                        /* Multi-Item Group Card Header */
                        <div className="flex flex-col">
                          <button
                            type="button"
                            role="button"
                            aria-expanded={isExpanded}
                            aria-controls={`nav-group-${group.id}`}
                            onClick={() => !isPermanent && toggleGroup(group.id)}
                            className={cn(
                              "flex items-center justify-between w-full rounded-lg px-2 py-1.5 transition-all duration-150 group outline-none focus-visible:ring-2 focus-visible:ring-primary/20 text-left",
                              isPermanent ? "cursor-default" : "cursor-pointer",
                              !isPermanent && "hover:bg-accent/50",
                              isExpanded && hasActiveItem ? "text-foreground" : "text-muted-foreground/80 hover:text-foreground",
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-150",
                                colors.iconBg, colors.iconBorder,
                              )}>
                                <GroupIcon className={cn("w-4 h-4 transition-colors", colors.iconText)} />
                              </div>
                              <span className={cn(
                                "text-[12px] font-bold uppercase tracking-[0.05em] truncate transition-colors",
                                isExpanded ? "text-foreground/90 font-extrabold" : "text-muted-foreground/70 group-hover:text-foreground/90"
                              )}>
                                {group.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {groupBadge > 0 && !isExpanded && (
                                <Badge className="bg-primary text-primary-foreground h-[18px] px-1.5 min-w-[20px] text-[10px] font-bold border-0 rounded-full">
                                  {groupBadge}
                                </Badge>
                              )}
                              {!isPermanent && (
                                <ChevronDown className={cn(
                                  "w-3.5 h-3.5 transition-transform duration-200 ease-out",
                                  isExpanded ? "rotate-0 text-muted-foreground/70" : "-rotate-90 text-muted-foreground/40 group-hover:text-muted-foreground/70"
                                )} />
                              )}
                            </div>
                          </button>

                          {/* Sub-items with smooth accordion transition */}
                          <div
                            id={`nav-group-${group.id}`}
                            role="region"
                            className={cn(
                              "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
                              isExpanded ? "grid-rows-[1fr] opacity-100 mt-0.5" : "grid-rows-[0fr] opacity-0"
                            )}
                          >
                            <ul className="overflow-hidden flex flex-col gap-0.5">
                              <div className="pl-[16px] pb-1 flex flex-col gap-0.5 relative">
                                {/* Connecting Vertical Guide Line */}
                                <div className="absolute left-[15px] top-0 bottom-1 w-px bg-border/40" />

                                {group.items.map((item) => {
                                  const active = isItemActive(item.href)
                                  return (
                                    <li key={item.id} className="relative z-10">
                                      <Link
                                        href={item.href}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                          "flex items-center gap-2.5 rounded-lg px-2.5 py-[6px] text-[13px] transition-all duration-150 group/item outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                                          active
                                            ? cn(colors.activeBg, "text-foreground font-semibold border-l-[3px] pl-[7px] shadow-sm", colors.activeBorder)
                                            : "text-muted-foreground/85 font-medium hover:bg-accent/50 hover:text-foreground border-l-[3px] border-transparent pl-[7px]",
                                        )}
                                      >
                                        <item.icon className={cn(
                                          "h-4 w-4 shrink-0 transition-colors duration-150",
                                          active ? colors.iconText : "opacity-60 group-hover/item:opacity-100"
                                        )} />
                                        <span className="flex-1 truncate">{item.label}</span>
                                        {renderItemBadge(item)}
                                      </Link>
                                    </li>
                                  )
                                })}
                              </div>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* ════ COLLAPSED RAIL MODE (64px, Optional) ════ */
                    <div className="flex justify-center">
                      {isSingleItem ? (
                        /* Rail Single Item */
                        <Link
                          href={group.items[0].href}
                          aria-label={group.label}
                          title={group.label}
                          aria-current={isItemActive(group.items[0].href) ? "page" : undefined}
                          className={cn(
                            "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 relative group",
                            isItemActive(group.items[0].href)
                              ? cn(colors.iconBg, colors.iconBorder, "border shadow-sm")
                              : "hover:bg-accent/60 text-muted-foreground/70 hover:text-foreground border border-transparent hover:border-border/40"
                          )}
                        >
                          <GroupIcon className={cn("w-5 h-5 transition-colors", isItemActive(group.items[0].href) ? colors.iconText : "group-hover:text-foreground")} />
                          {groupBadge > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary border-2 border-card" />}
                        </Link>
                      ) : (
                        /* Rail Multi-Item Group Flyout */
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            aria-label={group.label}
                            title={group.label}
                            className={cn(
                              "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 relative group cursor-pointer",
                              hasActiveItem
                                ? cn(colors.iconBg, colors.iconBorder, "border shadow-sm")
                                : "hover:bg-accent/60 text-muted-foreground/70 hover:text-foreground border border-transparent hover:border-border/40"
                            )}
                          >
                            <GroupIcon className={cn("w-5 h-5 transition-colors", hasActiveItem ? colors.iconText : "group-hover:text-foreground")} />
                            {groupBadge > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary border-2 border-card" />}
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            side="right"
                            align="start"
                            sideOffset={14}
                            className="w-64 p-2 rounded-xl shadow-2xl border-border/60 bg-background/95 backdrop-blur-xl"
                          >
                            <div className="text-[11px] px-2 py-1.5 font-bold uppercase tracking-[0.06em] text-muted-foreground/70 flex items-center gap-2">
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center", colors.iconBg)}>
                                <GroupIcon className={cn("w-3.5 h-3.5", colors.iconText)} />
                              </div>
                              {group.label}
                            </div>
                            <DropdownMenuSeparator className="my-1 bg-border/40" />
                            <DropdownMenuGroup>
                              {group.items.map(item => {
                                const active = isItemActive(item.href)
                                return (
                                  <DropdownMenuItem
                                    key={item.id}
                                    render={<Link href={item.href} className="w-full flex items-center px-2 py-2 gap-2.5 rounded-lg" />}
                                    className={cn(
                                      "cursor-pointer rounded-lg p-0 mb-0.5 transition-colors",
                                      active ? cn(colors.activeBg, "font-semibold text-foreground") : "hover:bg-muted/80 focus:bg-muted/80"
                                    )}
                                  >
                                    <item.icon className={cn("h-4 w-4 shrink-0", active ? colors.iconText : "opacity-60")} />
                                    <div className="flex-1 min-w-0">
                                      <span className="text-[13px] block truncate leading-tight">{item.label}</span>
                                      {item.description && (
                                        <span className="text-[10.5px] text-muted-foreground/70 block truncate leading-tight mt-0.5">{item.description}</span>
                                      )}
                                    </div>
                                    <div className="shrink-0">
                                      {renderItemBadge(item)}
                                    </div>
                                  </DropdownMenuItem>
                                )
                              })}
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        </nav>

        {/* ━━━ Footer / Organization & User Profile ━━━━━━━━━━━━━━ */}
        <div className="shrink-0 border-t border-border/60 bg-background/50 p-2 mt-auto">

          {/* Account organization strip (Expanded only) */}
          {!collapsed && showAccountStrip && account?.name && (
            <div className="px-2 pt-1 pb-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                <Building className="size-3.5 shrink-0 opacity-60 text-primary" />
                <span className="truncate font-semibold text-foreground/90" title={account.name}>{account.name}</span>
                {accountRole && (
                  <span className={`ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${ROLE_CHIP[accountRole].className}`}>
                    {(() => { const Icon = ROLE_CHIP[accountRole].icon; return <Icon className="size-[10px]" /> })()}
                    {ROLE_CHIP[accountRole].label}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* User profile dropdown button */}
          <DropdownMenu>
            {!collapsed ? (
              /* Expanded User Row */
              <DropdownMenuTrigger
                className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-all duration-150 hover:bg-accent/60 focus:bg-accent/60 focus:outline-none outline-none group border border-transparent hover:border-border/40"
              >
                <Avatar className="size-8 shrink-0 border border-border/60 shadow-sm transition-transform duration-150 group-hover:scale-105">
                  {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.full_name ?? "Avatar"} />}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {profile?.full_name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                  <span className="truncate text-[13px] font-bold text-foreground leading-tight">{profile?.full_name || user?.email}</span>
                  <span className="truncate text-[11px] text-muted-foreground leading-tight">{user?.email}</span>
                </div>
              </DropdownMenuTrigger>
            ) : (
              /* Collapsed User Avatar */
              <DropdownMenuTrigger
                className="w-full flex justify-center py-1 outline-none cursor-pointer"
                title={profile?.full_name || user?.email || 'User Account'}
              >
                <Avatar className="size-8 border border-border/60 shadow-sm hover:scale-105 transition-transform duration-150 cursor-pointer">
                  {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.full_name ?? "Avatar"} />}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {profile?.full_name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
            )}

            <DropdownMenuContent align="end" side="top" sideOffset={8} className="min-w-64 rounded-xl bg-background/95 backdrop-blur-xl shadow-2xl border-border/60 p-1.5">
              <div className="px-2 py-2 mb-1 flex items-center gap-3">
                <Avatar className="size-9 border border-border/60">
                  {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.full_name ?? "Avatar"} />}
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                    {profile?.full_name?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-bold truncate">{profile?.full_name || user?.email}</span>
                  <span className="text-[11px] text-muted-foreground truncate">{user?.email}</span>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-border/40 mb-1" />
              <DropdownMenuItem
                render={<Link href="/settings?tab=profile" onClick={onClose} className="w-full flex items-center" />}
                className="rounded-lg p-2 cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
              >
                <User className="size-4 mr-2.5 opacity-60" />
                <span className="font-medium text-[13px]">{tHeader("Profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-border/30" />
              <DropdownMenuItem
                onClick={signOut}
                className="rounded-lg p-2 text-red-600 focus:bg-red-500/10 focus:text-red-600 dark:text-red-400 dark:focus:text-red-300 dark:focus:bg-red-500/10 cursor-pointer transition-colors"
              >
                <LogOut className="size-4 mr-2.5 opacity-60" />
                <span className="font-medium text-[13px]">{tHeader("SignOut")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  )
}
