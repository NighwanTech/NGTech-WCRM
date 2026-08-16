'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ArrowLeft, ChevronRight, Home, ChevronLeft, Rocket, Palette, Target, Sparkles, BookOpen, FlaskConical, Activity, TrendingUp, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { getActiveWorkspaceModule, EnterpriseWorkspaceModuleId } from '@/lib/meta/workspace-navigation'

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
  { id: 'audience', href: '/meta-ads/audience-studio', label: 'Audience', icon: Target },
  { id: 'creative', href: '/meta-ads/creative-studio', label: 'Creative', icon: Palette },
  { id: 'analytics', href: '/meta-ads/analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'automation', href: '/meta-ads/decision-ledger', label: 'Automation', icon: Activity },
  { id: 'copilot', href: '/meta-ads/copilot', label: 'AI Copilot', icon: Sparkles },
  { id: 'settings', href: '/meta-ads/settings', label: 'Settings', icon: BookOpen },
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

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 2) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  // Calculate Previous and Next module in OS sequence
  const currentIdx = META_ADS_MODULE_SEQUENCE.findIndex((m) => m.id === activeModule)
  const prevModule = currentIdx > 0 ? META_ADS_MODULE_SEQUENCE[currentIdx - 1] : null
  const nextModule = currentIdx >= 0 && currentIdx < META_ADS_MODULE_SEQUENCE.length - 1 ? META_ADS_MODULE_SEQUENCE[currentIdx + 1] : null

  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Campaign', href: '/meta-ads' },
    ...breadcrumbs,
    { label: title },
  ]

  return (
    <header className={cn('space-y-4 pb-4 border-b border-border/60 mb-6 max-w-full overflow-hidden', className)}>
      {/* Top Row: Breadcrumb Trail */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-none max-w-full">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 py-0.5"
        >
          <Home className="w-3.5 h-3.5" />
        </Link>
        {defaultBreadcrumbs.map((crumb, idx) => {
          const isLast = idx === defaultBreadcrumbs.length - 1
          return (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 py-0.5"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-foreground truncate max-w-[160px] sm:max-w-[200px]">{crumb.label}</span>
              )}
            </React.Fragment>
          )
        })}
      </nav>

      {/* Main Row: Back Button + Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full min-w-0">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
            aria-label="Navigate Back"
            className="mt-0.5 h-9 px-3 gap-1.5 font-bold text-xs shrink-0 hover:bg-muted/80 border-border/80 shadow-2xs transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
            <span>Back</span>
          </Button>

          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />}
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate">{title}</h1>
            </div>
            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Optional Actions & Prev/Next Counter */}
        <div className="flex items-center gap-2 flex-wrap shrink-0 max-w-full">
          {actions}

          <div className="hidden sm:flex items-center gap-1 bg-muted/70 px-2 py-1 rounded-lg border shadow-2xs">
            {prevModule ? (
              <Link href={prevModule.href} title={`Previous: ${prevModule.label}`}>
                <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[11px] font-semibold gap-1 hover:bg-background">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="sm" disabled className="h-6 px-1.5 text-[11px] opacity-40">
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
            )}

            <span className="text-[10px] font-mono font-bold text-muted-foreground px-1">
              {currentIdx >= 0 ? `${currentIdx + 1}/${META_ADS_MODULE_SEQUENCE.length}` : 'OS'}
            </span>

            {nextModule ? (
              <Link href={nextModule.href} title={`Next: ${nextModule.label}`}>
                <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[11px] font-semibold gap-1 hover:bg-background">
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="sm" disabled className="h-6 px-1.5 text-[11px] opacity-40">
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sequential Module Bar (Quick OS Switcher with Hidden Scrollbar) */}
      {showModuleSwitcher && (
        <div className="pt-1 max-w-full overflow-hidden">
          <nav
            aria-label="Meta Ads OS Modules"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {META_ADS_MODULE_SEQUENCE.map((m) => {
              const isActive = m.id === activeModule
              const ModIcon = m.icon
              return (
                <Link key={m.id} href={m.href}>
                  <button
                    type="button"
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer',
                      isActive
                        ? 'bg-purple-600 text-white shadow-md font-semibold border-purple-600'
                        : 'bg-background text-gray-600 hover:text-purple-700 hover:bg-purple-50 dark:bg-card dark:text-gray-300 dark:hover:bg-purple-950/40 border border-gray-200 dark:border-border/60'
                    )}
                  >
                    <ModIcon className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-gray-500 hover:text-purple-600")} />
                    <span>{m.label}</span>
                  </button>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
