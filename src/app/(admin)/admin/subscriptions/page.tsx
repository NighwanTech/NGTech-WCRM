'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, Ban, RefreshCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Subscription {
  id: string
  clientName: string
  planName: string
  status: string
  billingCycle: string
  amount: number
  nextBillingDate: string
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const db = createClient()
        const { data } = await db
          .from('accounts')
          .select('id, name, plan, status, created_at')
          .order('created_at', { ascending: false })

        if (data && data.length > 0) {
          const list: Subscription[] = data.map((acc: any) => ({
            id: acc.id,
            clientName: acc.name || 'Enterprise Account',
            planName: acc.plan ? acc.plan.toUpperCase() : 'ENTERPRISE',
            status: acc.status || 'active',
            billingCycle: 'monthly',
            amount: acc.plan === 'starter' ? 2999 : acc.plan === 'growth' ? 6999 : 14999,
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }))
          setSubscriptions(list)
        } else {
          setSubscriptions([])
        }
      } catch {
        setSubscriptions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [])

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Loading subscriptions...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscriptions & Billing</h1>
          <p className="text-sm text-muted-foreground">Manage active client subscriptions, invoices, and billing issues.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search client..."
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Client</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Plan</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Amount</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Next Billing</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscriptions.length > 0 ? (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4 font-medium text-foreground">{sub.clientName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {sub.planName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        sub.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">₹{sub.amount.toLocaleString('en-IN')}/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{sub.nextBillingDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No active subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
