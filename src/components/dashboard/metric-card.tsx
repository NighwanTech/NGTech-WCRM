import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface MetricCardProps {
  title: string
  /** Pre-formatted value for display (e.g. "42" or "$1,250"). */
  value: string
  icon: ComponentType<{ className?: string }>
  /**
   * Delta-mode secondary row: arrow + delta text. Omit when the metric
   * doesn't have a sensible comparison (e.g. total pipeline value).
   */
  delta?: {
    /** Positive / negative / zero drives arrow + color. */
    sign: number
    /** Pre-formatted delta, e.g. "+3 vs yesterday". */
    label: string
  }
  /** Used instead of `delta` when the metric has a static subtitle. */
  subtitle?: string
  /** Goal progress bar percentage (e.g. 81% of target) */
  progress?: {
    pct: number
    label: string
  }
  /** Contextual status badge (e.g. "Healthy Growth") */
  statusBadge?: string
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  delta, 
  subtitle,
  progress,
  statusBadge
}: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/40 p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-border hover:shadow-md hover:shadow-primary/5 flex flex-col justify-between min-w-0">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />
      
      <div>
        {/* Header: Title + Icon + Status Badge */}
        <div className="relative z-10 flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-foreground/80 leading-tight">
              {title}
            </p>
            {statusBadge && (
              <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border-primary/30 text-primary bg-primary/5 whitespace-nowrap inline-flex">
                {statusBadge}
              </Badge>
            )}
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/50 bg-background/50 text-muted-foreground shadow-2xs transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary shrink-0">
            <Icon className="h-4 w-4" />
          </div>
        </div>

        {/* Primary Metric Value (Never truncated) */}
        <div className="relative z-10 mt-3">
          <p className="text-2xl xl:text-3xl font-black tracking-tight text-foreground tabular-nums whitespace-nowrap">
            {value}
          </p>
        </div>
      </div>

      {/* Footer / Context row */}
      <div className="mt-3 pt-2.5 border-t border-border/40 space-y-1.5">
        {progress && (
          <div className="space-y-1 mb-1">
            <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
              <span>Goal Progress</span>
              <span>{progress.pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, progress.pct))}%` }} 
              />
            </div>
          </div>
        )}

        {delta ? (
          <DeltaRow sign={delta.sign} label={delta.label} />
        ) : subtitle ? (
          <p className="text-[11px] font-medium text-muted-foreground leading-tight">{subtitle}</p>
        ) : null}
      </div>
    </div>
  )
}

function DeltaRow({ sign, label }: { sign: number; label: string }) {
  const tone =
    sign > 0
      ? 'text-emerald-500'
      : sign < 0
        ? 'text-rose-500'
        : 'text-muted-foreground'
  const Arrow = sign > 0 ? ArrowUp : sign < 0 ? ArrowDown : Minus
  return (
    <div className={cn('flex items-center gap-1 text-xs font-semibold', tone)}>
      <Arrow className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="tabular-nums">{label}</span>
    </div>
  )
}
