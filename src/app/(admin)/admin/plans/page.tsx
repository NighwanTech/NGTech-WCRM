'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'

// Mock data structure until API is connected
interface PricingPlan {
  id: string
  slug: string
  name: string
  description: string
  monthly_price: number
  annual_price: number
  max_contacts: number
  max_messages_pm: number
  is_active: boolean
  sort_order: number
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // We'll mock the fetch for now until the Supabase API route is ready
    setTimeout(() => {
      setPlans([
        { id: '1', slug: 'free', name: 'Free', description: 'Basic tier', monthly_price: 0, annual_price: 0, max_contacts: 500, max_messages_pm: 1000, is_active: true, sort_order: 1 },
        { id: '2', slug: 'starter', name: 'Starter', description: 'Small teams', monthly_price: 29, annual_price: 290, max_contacts: 2000, max_messages_pm: 5000, is_active: true, sort_order: 2 },
        { id: '3', slug: 'pro', name: 'Pro', description: 'Growing business', monthly_price: 99, annual_price: 990, max_contacts: 10000, max_messages_pm: 30000, is_active: true, sort_order: 3 },
      ])
      setLoading(false)
    }, 500)
  }, [])

  if (loading) return <div className="p-8">Loading plans...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pricing Plans</h1>
          <p className="text-sm text-muted-foreground">Manage SaaS pricing, limits, and visibility.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
          <Plus className="h-4 w-4" />
          Add Plan
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Plan Name</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Monthly</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Annual</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Limits (Contacts/Msgs)</th>
                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{plan.name}</p>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </td>
                  <td className="px-6 py-4 tabular-nums">${plan.monthly_price}</td>
                  <td className="px-6 py-4 tabular-nums">${plan.annual_price}</td>
                  <td className="px-6 py-4 tabular-nums">
                    {plan.max_contacts === -1 ? 'Unlimited' : plan.max_contacts.toLocaleString()} /{' '}
                    {plan.max_messages_pm === -1 ? 'Unlimited' : plan.max_messages_pm.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${plan.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                      {plan.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
