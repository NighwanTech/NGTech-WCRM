'use client'

import React from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { CampaignWorkspaceProvider } from '@/components/meta-ads/campaign-workspace-context'
import { CampaignWorkspaceHeader } from '@/components/meta-ads/campaign-workspace-header'
import { CampaignWorkspaceSidebar } from '@/components/meta-ads/campaign-workspace-sidebar'
import { CampaignWorkspaceRightSidebar } from '@/components/meta-ads/campaign-workspace-right-sidebar'
import { CampaignWorkspaceTabContent } from '@/components/meta-ads/campaign-workspace-tab-content'

export default function CampaignWorkspacePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const campaignId = (params?.campaignId as string) || ''
  const tab = searchParams?.get('tab') || 'overview'

  if (!campaignId) {
    return <div className="p-8 text-center text-muted-foreground">Invalid Campaign ID.</div>
  }

  return (
    <CampaignWorkspaceProvider campaignId={campaignId} initialTab={tab}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Sticky Header with FSM Action Bar */}
        <CampaignWorkspaceHeader />

        {/* 3-Column Enterprise Workspace Layout */}
        <div className="flex-1 flex w-full">
          {/* Left Sidebar Workflow Tabs */}
          <CampaignWorkspaceSidebar />

          {/* Center Main Editor View */}
          <main className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto">
            <CampaignWorkspaceTabContent />
          </main>

          {/* Right Sidebar Live Summary & Diagnostics */}
          <CampaignWorkspaceRightSidebar />
        </div>
      </div>
    </CampaignWorkspaceProvider>
  )
}
