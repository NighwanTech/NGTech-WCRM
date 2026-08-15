'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

export interface CampaignWorkspaceState {
  campaign: any
  strategy: any
  audience: any
  interests: any[]
  creative: any
  budget: any
  events: any[]
  versions: any[]
}

interface CampaignWorkspaceContextType {
  campaignId: string
  activeTab: string
  setActiveTab: (tab: string) => void
  workspaceData: CampaignWorkspaceState | null
  loading: boolean
  saving: boolean
  error: string | null
  refetchWorkspace: () => Promise<void>
  updateCampaignField: (section: string, payload: any) => void
  saveWorkspaceDebounced: (section: string, payload: any) => Promise<void>
  executeFsmTransition: (targetStatus: string) => Promise<boolean>
}

const CampaignWorkspaceContext = createContext<CampaignWorkspaceContextType | null>(null)

let debounceTimer: NodeJS.Timeout | null = null

export function CampaignWorkspaceProvider({
  campaignId,
  initialTab = 'overview',
  children
}: {
  campaignId: string
  initialTab?: string
  children: React.ReactNode
}) {
  const [activeTab, setActiveTab] = useState<string>(initialTab)
  const [workspaceData, setWorkspaceData] = useState<CampaignWorkspaceState | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Load Full Hydrated Campaign Aggregate Root from API
  const fetchWorkspace = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/meta/campaigns/workspace?campaignId=${campaignId}`)
      const data = await res.json()

      if (!data.success || !data.aggregate) {
        throw new Error(data.error || 'Failed to load campaign aggregate root')
      }

      setWorkspaceData(data.aggregate)
    } catch (err: any) {
      console.error('[CampaignWorkspaceContext] Fetch Error:', err)
      setError(err.message || 'Error loading campaign')
      toast.error(err.message || 'Failed to load campaign')
    } finally {
      setLoading(false)
    }
  }, [campaignId])

  useEffect(() => {
    if (campaignId) {
      fetchWorkspace()
    }
  }, [campaignId, fetchWorkspace])

  // Update Local UI State Immediately
  const updateCampaignField = useCallback((section: string, payload: any) => {
    setWorkspaceData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [section]: {
          ...prev[section as keyof CampaignWorkspaceState],
          ...payload
        }
      }
    })
  }, [])

  // Save to Backend with 3-Second Debounce
  const saveWorkspaceDebounced = useCallback(
    async (section: string, payload: any) => {
      updateCampaignField(section, payload)

      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      debounceTimer = setTimeout(async () => {
        try {
          setSaving(true)
          const res = await fetch('/api/meta/campaigns/workspace', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              campaignId,
              [section]: payload
            })
          })
          const data = await res.json()
          if (!data.success) {
            toast.error(data.error || 'Autosave failed')
          } else {
            toast.success('Autosaved to database')
          }
        } catch (err: any) {
          toast.error('Autosave failed: ' + err.message)
        } finally {
          setSaving(false)
        }
      }, 3000)
    },
    [campaignId, updateCampaignField]
  )

  // Execute State Transition with FSM Validation
  const executeFsmTransition = useCallback(
    async (targetStatus: string): Promise<boolean> => {
      try {
        setSaving(true)
        const res = await fetch('/api/meta/campaigns/workspace', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaignId,
            targetStatus
          })
        })
        const data = await res.json()

        if (!data.success) {
          toast.error(data.error || 'FSM Transition Rejected')
          return false
        }

        toast.success(`Campaign status changed to ${targetStatus}`)
        await fetchWorkspace()
        return true
      } catch (err: any) {
        toast.error('FSM Transition Error: ' + err.message)
        return false
      } finally {
        setSaving(false)
      }
    },
    [campaignId, fetchWorkspace]
  )

  return (
    <CampaignWorkspaceContext.Provider
      value={{
        campaignId,
        activeTab,
        setActiveTab,
        workspaceData,
        loading,
        saving,
        error,
        refetchWorkspace: fetchWorkspace,
        updateCampaignField,
        saveWorkspaceDebounced,
        executeFsmTransition
      }}
    >
      {children}
    </CampaignWorkspaceContext.Provider>
  )
}

export function useCampaignWorkspace() {
  const ctx = useContext(CampaignWorkspaceContext)
  if (!ctx) {
    throw new Error('useCampaignWorkspace must be used within a CampaignWorkspaceProvider')
  }
  return ctx
}
