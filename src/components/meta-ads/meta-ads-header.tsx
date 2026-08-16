'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ArrowLeft, ChevronRight, Home, ChevronLeft, Rocket, Palette, Target, Sparkles, BookOpen, FlaskConical, Activity, TrendingUp, Layers, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { getActiveWorkspaceModule, EnterpriseWorkspaceModuleId } from '@/lib/meta/workspace-navigation'
import { NotificationCenter } from '@/components/meta-ads/notification-center'
import { GlobalSearchDialog } from '@/components/meta-ads/global-search-dialog'
import { AgencyClientSwitcher } from '@/components/meta-ads/agency-client-switcher'
import { GlobalCreateModal } from '@/components/meta-ads/global-create-modal'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface MetaAdsModuleNav {
  id: EnterpriseWorkspaceModuleId
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export const META_ADS_MODULE_SEQUENCE: MetaAdsModuleNav[] = [
  { id: 'overview', href: '/meta-ads', label: 'Overview', icon: Layers },
  { id: 'analytics', href: '/meta-ads/analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'approvals', href: '/meta-ads/decision-ledger', label: 'Approvals', icon: Activity },
]

export interface MetaAdsHeaderProps {
  title: string
  description?: string
  fallbackHref?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  className?: string
  showModuleSwitcher?: boolean
}

export function MetaAdsHeader({
  title,
  description,
  fallbackHref = '/meta-ads',
  breadcrumbs = [],
  actions,
  icon: Icon,
  className,
  showModuleSwitcher = true,
}: MetaAdsHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const activeModule = getActiveWorkspaceModule(pathname)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 2) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <div className={cn("space-y-4 text-xs", className)}>
      {/* TOP UTILITY HEADER: Agency Switcher + Universal + Create + Search + Notifications */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 w-8 p-0 rounded-xl hover:bg-muted/80 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          {/* Agency & Client Multi-Tenant Switcher */}
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
      </div>

      {/* PRIMARY MODULE SWITCHER (Overview, Analytics, Approvals) & TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
              <Link href="/meta-ads" className="hover:text-foreground transition-colors flex items-center gap-1">
                <Home className="w-3 h-3" /> Meta Ads
              </Link>
              {breadcrumbs.map((item, i) => (
                <React.Fragment key={i}>
                  <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                  {item.href ? (
                    <Link href={item.href} className="hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-semibold">{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Main Title & Description */}
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
                {title}
              </h1>
              {description && (
                <p className="text-xs text-muted-foreground font-normal">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {actions && <div className="shrink-0">{actions}</div>}
      </div>

      <GlobalCreateModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  )
}
