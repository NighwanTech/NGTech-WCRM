'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface FinanceKpiCardProps {
  title: string
  amount: string
  subtext?: string
  icon?: LucideIcon
  badgeText?: string
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info'
}

export function FinanceKpiCard({
  title,
  amount,
  subtext,
  icon: Icon,
  badgeText,
  badgeVariant = 'info'
}: FinanceKpiCardProps) {
  let badgeStyles = 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  if (badgeVariant === 'success') badgeStyles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  if (badgeVariant === 'warning') badgeStyles = 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  if (badgeVariant === 'danger') badgeStyles = 'bg-rose-500/10 text-rose-400 border-rose-500/20'

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-2">
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        {badgeText && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyles}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-extrabold text-foreground tracking-tight">
          {amount}
        </span>
        {Icon && <Icon className="w-5 h-5 text-muted-foreground/60" />}
      </div>

      {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
    </div>
  )
}
