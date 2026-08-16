"use client"

import { useState } from "react"
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription 
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Clock, FileText, MessageSquare, Paperclip, History, UserCheck, ShieldCheck } from "lucide-react"
import { UniversalTimeline } from "@/components/common/universal-timeline"

export interface EntityDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entityType: 'Campaign' | 'Lead' | 'Deal' | 'Customer' | 'Quotation' | 'Invoice' | 'Workflow'
  entityTitle: string
  entitySubtitle?: string
}

/**
 * PRD v16.1 Shared Platform Component — Universal Entity Right Drawer
 * Linear-style right drawer with standardized tabs: Overview, Details, AI Assistant, Timeline, Activity, Comments, Files, History.
 */
export function UniversalEntityDrawer({
  open,
  onOpenChange,
  entityType,
  entityTitle,
  entitySubtitle
}: EntityDrawerProps) {
  const [tab, setTab] = useState<'overview' | 'details' | 'ai' | 'timeline' | 'activity' | 'comments' | 'files' | 'history'>('overview')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col font-mono text-xs">
        <SheetHeader className="p-4 border-b bg-muted/20">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary uppercase">
                  {entityType}
                </Badge>
                <Badge className="bg-emerald-600 text-white text-[9px]">
                  ACTIVE
                </Badge>
              </div>
              <SheetTitle className="text-sm font-bold text-foreground">{entityTitle}</SheetTitle>
              {entitySubtitle && <SheetDescription className="text-[10px] text-muted-foreground">{entitySubtitle}</SheetDescription>}
            </div>
          </div>
        </SheetHeader>

        {/* Standardized 8 Tabs Navigation */}
        <div className="flex items-center gap-1 bg-muted/40 p-1.5 border-b overflow-x-auto text-[10px] font-bold">
          {(['overview', 'details', 'ai', 'timeline', 'activity', 'comments', 'files', 'history'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-2.5 py-1 rounded transition-all capitalize shrink-0 cursor-pointer ${
                tab === t ? 'bg-primary text-primary-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:bg-muted/60'
              }`}
            >
              {t === 'ai' ? '✨ AI Assistant' : t}
            </button>
          ))}
        </div>

        {/* Drawer Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {tab === 'overview' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Record Summary</span>
                <p className="text-foreground text-xs font-bold">{entityTitle}</p>
                <p className="text-[10px] text-muted-foreground">High-intent record active in AIWCRM Enterprise OS pipeline.</p>
              </div>
            </div>
          )}

          {tab === 'ai' && (
            <div className="p-3.5 rounded-xl border bg-primary/5 space-y-2 text-xs">
              <span className="font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Contextual AI Copilot Reasoning
              </span>
              <p className="text-foreground leading-relaxed text-[11px]">
                Record exhibits 94/100 Intent Score. Recommended next best action: Issue formal quotation with 5% early booking discount.
              </p>
            </div>
          )}

          {tab === 'timeline' && <UniversalTimeline title={`${entityType} Activity Stream`} />}

          {(tab === 'details' || tab === 'activity' || tab === 'comments' || tab === 'files' || tab === 'history') && (
            <div className="p-4 text-center text-muted-foreground text-xs">
              Showing {tab} details for {entityTitle}...
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
