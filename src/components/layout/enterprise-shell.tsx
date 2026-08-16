"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Home, Megaphone, Users, MessageSquare, Briefcase, DollarSign, Heart, 
  Cpu, Rocket, LineChart, Plug, Settings, Plus, Search, Bell, Shield, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { AgencyClientSwitcher } from "@/components/meta-ads/agency-client-switcher"
import { GlobalSearchDialog } from "@/components/meta-ads/global-search-dialog"
import { NotificationCenter } from "@/components/meta-ads/notification-center"
import { GlobalCreateModal } from "@/components/common/global-create-modal"
import { UniversalEntityDrawer } from "@/components/common/universal-entity-drawer"

export interface EnterpriseShellProps {
  activeTab: 'HOME' | 'MARKETING' | 'LEAD_HUB' | 'CRM' | 'SALES' | 'FINANCE' | 'SUCCESS' | 'AI' | 'AUTOMATION' | 'ANALYTICS' | 'INTEGRATIONS' | 'SETTINGS'
  onTabChange: (tab: 'HOME' | 'MARKETING' | 'LEAD_HUB' | 'CRM' | 'SALES' | 'FINANCE' | 'SUCCESS' | 'AI' | 'AUTOMATION' | 'ANALYTICS' | 'INTEGRATIONS' | 'SETTINGS') => void
  children: React.ReactNode
}

/**
 * PRD v16.1 Layout Infrastructure — Enterprise Shell Component
 * Standardized application framework hosting all 12 business modules.
 */
export function EnterpriseShell({
  activeTab,
  onTabChange,
  children
}: EnterpriseShellProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<{ title: string; type: any }>({ title: "Patna Property Lead #991", type: "Lead" })

  const sidebarItems = [
    { id: 'HOME', label: 'Home', icon: Home, color: 'text-foreground' },
    { id: 'MARKETING', label: 'Marketing', icon: Megaphone, color: 'text-purple-400' },
    { id: 'LEAD_HUB', label: 'Lead Hub', icon: Users, color: 'text-emerald-400' },
    { id: 'CRM', label: 'CRM', icon: MessageSquare, color: 'text-blue-400' },
    { id: 'SALES', label: 'Sales', icon: Briefcase, color: 'text-amber-400' },
    { id: 'FINANCE', label: 'Finance', icon: DollarSign, color: 'text-emerald-400' },
    { id: 'SUCCESS', label: 'Success', icon: Heart, color: 'text-rose-400' },
    { id: 'AI', label: 'AI', icon: Cpu, color: 'text-cyan-400' },
    { id: 'AUTOMATION', label: 'Automation', icon: Rocket, color: 'text-pink-400' },
    { id: 'ANALYTICS', label: 'Analytics', icon: LineChart, color: 'text-teal-400' },
    { id: 'INTEGRATIONS', label: 'Integrations', icon: Plug, color: 'text-indigo-400' },
    { id: 'SETTINGS', label: 'Settings', icon: Settings, color: 'text-slate-400' }
  ] as const

  return (
    <div className="min-h-screen bg-background text-foreground text-xs flex flex-col font-sans">
      {/* TOP APPLICATION HEADER */}
      <header className="border-b bg-card px-4 py-2.5 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold font-mono text-sm">
              EOS
            </div>
            <span className="font-extrabold text-sm tracking-tight text-foreground hidden sm:inline-block">
              AIWCRM Enterprise OS
            </span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 hidden sm:inline-block" />

          {/* Agency & Multi-Tenant Switcher */}
          <AgencyClientSwitcher />
        </div>

        {/* Global Utilities */}
        <div className="flex items-center gap-2">
          {/* Universal + Create Global Button */}
          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="h-8 text-xs font-bold bg-primary text-primary-foreground gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" /> + Create
          </Button>

          <GlobalSearchDialog />
          <NotificationCenter />
        </div>
      </header>

      {/* PRIMARY WORKSPACE CONTENT & NAVIGATION AREA */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* SECONDARY SIDEBAR / TAB BAR */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-1 bg-muted/60 p-1.5 rounded-2xl border text-xs font-bold shadow-2xs font-mono overflow-x-auto max-w-full no-scrollbar shrink-0">
            {sidebarItems.map(item => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary-foreground' : item.color}`} />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 px-6 pb-6">
          {children}
        </main>
      </div>

      {/* SHARED PLATFORM MODALS & DRAWERS */}
      <GlobalCreateModal open={createModalOpen} onOpenChange={setCreateModalOpen} />

      <UniversalEntityDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        entityType={selectedEntity.type}
        entityTitle={selectedEntity.title}
      />
    </div>
  )
}
