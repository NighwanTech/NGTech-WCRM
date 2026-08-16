import React from 'react'

export type PaymentStatus = 
  // Quotation Statuses
  | 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired'
  // Proposal Statuses
  | 'Review' | 'Approved'
  // Invoice Statuses
  | 'Partial' | 'Paid' | 'Overdue' | 'Cancelled'
  // Lowercase variants
  | 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'review' | 'approved' | 'partial' | 'paid' | 'overdue' | 'cancelled'

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  className?: string
}

export function PaymentStatusBadge({ status, className = '' }: PaymentStatusBadgeProps) {
  const normalized = (status || 'Draft').toString().toLowerCase()

  let styles = 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  let label: string = status

  switch (normalized) {
    case 'accepted':
    case 'approved':
    case 'paid':
      styles = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      label = normalized === 'paid' ? 'Paid' : normalized === 'approved' ? 'Approved' : 'Accepted'
      break
    case 'sent':
    case 'viewed':
    case 'review':
      styles = 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
      label = normalized === 'review' ? 'Under Review' : normalized === 'viewed' ? 'Viewed' : 'Sent'
      break
    case 'partial':
      styles = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
      label = 'Partial Paid'
      break
    case 'overdue':
    case 'expired':
      styles = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
      label = normalized === 'overdue' ? 'Overdue' : 'Expired'
      break
    case 'rejected':
    case 'cancelled':
      styles = 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'
      label = normalized === 'cancelled' ? 'Cancelled' : 'Rejected'
      break
    case 'draft':
    default:
      styles = 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30'
      label = 'Draft'
      break
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {label}
    </span>
  )
}
