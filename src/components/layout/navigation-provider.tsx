'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import { NavGroupConfig, NavItemConfig, NAVIGATION_CONFIG } from '@/config/navigation'
import { TelemetryProvider } from '@/lib/services/telemetry/provider'
import type { LucideIcon } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────

export interface RecentItem {
  itemId: string
  href: string
  label: string
  icon: LucideIcon
  visitedAt: number
}

export interface WorkspaceStub {
  id: string
  name: string
  logoUrl?: string | null
  brandColor?: string | null
  brandIcon?: string | null
}

interface NavigationContextProps {
  /** Resolved navigation groups (static + plugin-registered) */
  groups: NavGroupConfig[]
  /** Pinned favorite item IDs */
  favorites: string[]
  /** Currently expanded group IDs */
  expandedGroups: string[]
  /** Last 5 visited pages */
  recentlyVisited: RecentItem[]
  /** Current workspace (from account) */
  activeWorkspace: WorkspaceStub | null
  /** All workspaces (future: multiple) */
  workspaces: WorkspaceStub[]
  /** Toggle a group open/closed */
  toggleGroup: (groupId: string) => void
  /** Toggle a favorite item */
  toggleFavorite: (itemId: string) => void
  /**
   * Plugin Registration — allows modules to add themselves to the
   * navigation tree at runtime without modifying navigation.ts.
   *
   * @param groupId - Existing group to append to, or a new group ID.
   * @param item - The nav item config to register.
   * @param groupMeta - If groupId is new, provide label/icon/color to create the group.
   */
  registerPlugin: (
    groupId: string,
    item: NavItemConfig,
    groupMeta?: { label: string; groupIcon: LucideIcon; colorClass: string }
  ) => void
  /** Unregister a previously registered plugin item */
  unregisterPlugin: (itemId: string) => void
  /** Log a page visit (telemetry + recently visited) */
  logVisit: (path: string, moduleId?: string) => void
  /** Switch workspace (stub — no-op until backend supports it) */
  switchWorkspace: (id: string) => void
}

const NavigationContext = createContext<NavigationContextProps | undefined>(undefined)

const MAX_RECENT = 5

// ─── Provider ────────────────────────────────────────────────────────

interface NavigationProviderProps {
  children: ReactNode
  tenantId: string
  userId: string
  /** Current account info for workspace context */
  accountName?: string
  accountId?: string
  accountLogoUrl?: string | null
  accountBrandColor?: string | null
  accountBrandIcon?: string | null
}

export function NavigationProvider({
  children,
  tenantId,
  userId,
  accountName,
  accountId,
  accountLogoUrl,
  accountBrandColor,
  accountBrandIcon,
}: NavigationProviderProps) {
  // ── Core state ──
  const [pluginGroups, setPluginGroups] = useState<NavGroupConfig[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [recentlyVisited, setRecentlyVisited] = useState<RecentItem[]>([])

  // ── Workspace (single workspace for now, extensible to multi) ──
  const activeWorkspace = useMemo<WorkspaceStub | null>(() => {
    if (!accountId) return null
    return {
      id: accountId,
      name: accountName || 'My Workspace',
      logoUrl: accountLogoUrl,
      brandColor: accountBrandColor,
      brandIcon: accountBrandIcon,
    }
  }, [accountId, accountName, accountLogoUrl, accountBrandColor, accountBrandIcon])

  const workspaces = useMemo<WorkspaceStub[]>(
    () => (activeWorkspace ? [activeWorkspace] : []),
    [activeWorkspace]
  )

  // ── Merge static config with plugin-registered groups ──
  const groups = useMemo<NavGroupConfig[]>(() => {
    const merged = [...NAVIGATION_CONFIG]
    for (const pg of pluginGroups) {
      const existing = merged.find(g => g.id === pg.id)
      if (existing) {
        // Deduplicate: only add items with IDs not already present
        const existingIds = new Set(existing.items.map(i => i.id))
        const newItems = pg.items.filter(i => !existingIds.has(i.id))
        existing.items = [...existing.items, ...newItems]
      } else {
        merged.push(pg)
      }
    }
    return merged
  }, [pluginGroups])

  // ── Load preferences from localStorage ──
  useEffect(() => {
    try {
      const cache = localStorage.getItem(`aiwcrm-nav-${userId}`)
      if (cache) {
        const parsed = JSON.parse(cache)
        if (parsed.expandedGroups) setExpandedGroups(parsed.expandedGroups)
        if (parsed.favorites) setFavorites(parsed.favorites)
        if (parsed.recentlyVisited) {
          // Rehydrate recently visited — resolve icons from config
          const allItems = NAVIGATION_CONFIG.flatMap(g => g.items)
          const hydrated: RecentItem[] = (parsed.recentlyVisited as Array<{ itemId: string; href: string; label: string; visitedAt: number }>)
            .map(r => {
              const configItem = allItems.find(i => i.id === r.itemId)
              if (!configItem) return null
              return { ...r, icon: configItem.icon }
            })
            .filter(Boolean) as RecentItem[]
          setRecentlyVisited(hydrated)
        }
      }
    } catch (e) {
      console.error('Failed to parse nav cache', e)
    }
  }, [userId])

  // ── Persist preferences ──
  useEffect(() => {
    // Strip icon (non-serializable) from recentlyVisited before saving
    const recentSafe = recentlyVisited.map(({ icon, ...rest }) => rest)
    localStorage.setItem(
      `aiwcrm-nav-${userId}`,
      JSON.stringify({ expandedGroups, favorites, recentlyVisited: recentSafe })
    )
  }, [expandedGroups, favorites, recentlyVisited, userId])

  // ── Actions ──

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    )
  }, [])

  const toggleFavorite = useCallback((itemId: string) => {
    setFavorites(prev => {
      const next = prev.includes(itemId) ? prev.filter(i => i !== itemId) : [...prev, itemId]
      TelemetryProvider.log({
        tenantId,
        userId,
        eventType: 'FAVORITE_ADD',
        targetPath: itemId,
        moduleId: itemId,
      })
      return next
    })
  }, [tenantId, userId])

  const registerPlugin = useCallback(
    (
      groupId: string,
      item: NavItemConfig,
      groupMeta?: { label: string; groupIcon: LucideIcon; colorClass: string }
    ) => {
      setPluginGroups(prev => {
        const existing = prev.find(g => g.id === groupId)
        if (existing) {
          // Add to existing plugin group (dedup)
          if (existing.items.some(i => i.id === item.id)) return prev
          return prev.map(g =>
            g.id === groupId ? { ...g, items: [...g.items, item] } : g
          )
        }
        // Check if group exists in static config
        const staticGroup = NAVIGATION_CONFIG.find(g => g.id === groupId)
        if (staticGroup) {
          // Create a plugin overlay for an existing static group
          return [...prev, { ...staticGroup, items: [item] }]
        }
        // Brand new group — groupMeta required
        if (!groupMeta) {
          console.warn(
            `[NavigationRegistry] registerPlugin: groupId "${groupId}" not found and no groupMeta provided.`
          )
          return prev
        }
        return [
          ...prev,
          { id: groupId, label: groupMeta.label, groupIcon: groupMeta.groupIcon, colorClass: groupMeta.colorClass, items: [item] },
        ]
      })
    },
    []
  )

  const unregisterPlugin = useCallback((itemId: string) => {
    setPluginGroups(prev =>
      prev
        .map(g => ({ ...g, items: g.items.filter(i => i.id !== itemId) }))
        .filter(g => g.items.length > 0)
    )
  }, [])

  const logVisit = useCallback(
    (path: string, moduleId?: string) => {
      TelemetryProvider.log({
        tenantId,
        userId,
        eventType: 'PAGE_VISIT',
        targetPath: path,
        moduleId,
      })

      // Update recently visited
      const allItems = groups.flatMap(g => g.items)
      const matched = allItems.find(
        i => path === i.href || (i.href !== '/dashboard' && path.startsWith(i.href.split('?')[0]))
      )
      if (matched) {
        setRecentlyVisited(prev => {
          const filtered = prev.filter(r => r.itemId !== matched.id)
          const entry: RecentItem = {
            itemId: matched.id,
            href: matched.href,
            label: matched.label,
            icon: matched.icon,
            visitedAt: Date.now(),
          }
          return [entry, ...filtered].slice(0, MAX_RECENT)
        })
      }
    },
    [tenantId, userId, groups]
  )

  const switchWorkspace = useCallback(
    (id: string) => {
      // Stub — log telemetry, no actual switch yet
      TelemetryProvider.log({
        tenantId,
        userId,
        eventType: 'MODULE_CLICK',
        targetPath: `/workspace/${id}`,
        metadata: { action: 'switch_workspace', targetWorkspaceId: id },
      })
      console.info(`[NavigationProvider] switchWorkspace("${id}") — not implemented yet`)
    },
    [tenantId, userId]
  )

  const value = useMemo<NavigationContextProps>(
    () => ({
      groups,
      favorites,
      expandedGroups,
      recentlyVisited,
      activeWorkspace,
      workspaces,
      toggleGroup,
      toggleFavorite,
      registerPlugin,
      unregisterPlugin,
      logVisit,
      switchWorkspace,
    }),
    [
      groups,
      favorites,
      expandedGroups,
      recentlyVisited,
      activeWorkspace,
      workspaces,
      toggleGroup,
      toggleFavorite,
      registerPlugin,
      unregisterPlugin,
      logVisit,
      switchWorkspace,
    ]
  )

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

// ─── Hook ────────────────────────────────────────────────────────────

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
