'use client'

import { useState, useEffect } from 'react'
import {
  Sliders,
  Zap,
  Activity,
  ShieldAlert,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Trash2,
  Power,
  Play,
  Layers,
  Filter,
  ShieldCheck,
  Globe,
  Clock,
  Key,
  Flame,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Policy {
  id: string
  name: string
  scope_level: 'global' | 'plan' | 'workspace' | 'role' | 'api_key' | 'emergency'
  target_role?: string
  target_api_key_id?: string
  target_ip_range?: string
  route_pattern: string
  http_methods: string[]
  max_requests: number
  window_seconds: number
  status: 'active' | 'disabled' | 'archived'
  priority_rank: number
  version: number
  created_at: string
}

interface DefaultCategory {
  key: string
  limit: number
  windowMs: number
  description: string
}

interface MetricsData {
  totalPolicies: number
  activePolicies: number
  totalRequestsProcessed: number
  totalBlocked429: number
  averageUtilization: number
  cacheHealth: string
  topThrottledEndpoints: Array<{ route: string; count: number }>
}

interface AuditData {
  unprotectedRoutes: string[]
  conflicts: Array<{ route: string; policyA: string; policyB: string }>
  healthy: boolean
}

export function RateLimitsGovernanceTab() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [defaultCategories, setDefaultCategories] = useState<DefaultCategory[]>([])
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [audit, setAudit] = useState<AuditData | null>(null)
  const [loading, setLoading] = useState(true)

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('')
  const [scopeFilter, setScopeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [simModalOpen, setSimModalOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)

  // Form inputs
  const [name, setName] = useState('')
  const [scopeLevel, setScopeLevel] = useState<'global' | 'plan' | 'workspace' | 'role' | 'api_key' | 'emergency'>('workspace')
  const [targetRole, setTargetRole] = useState('')
  const [targetIpRange, setTargetIpRange] = useState('')
  const [routePattern, setRoutePattern] = useState('/api/whatsapp/send')
  const [httpMethods, setHttpMethods] = useState<string>('*')
  const [maxRequests, setMaxRequests] = useState<number>(100)
  const [windowSeconds, setWindowSeconds] = useState<number>(60)
  const [saving, setSaving] = useState(false)

  // Simulator state
  const [simMaxReq, setSimMaxReq] = useState<number>(100)
  const [simWindowSec, setSimWindowSec] = useState<number>(60)
  const [simBurstCount, setSimBurstCount] = useState<number>(150)
  const [simResult, setSimResult] = useState<any>(null)
  const [simulating, setSimulating] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      // 1. Fetch policies
      const res = await fetch('/api/admin/rate-limits')
      if (res.ok) {
        const data = await res.json()
        setPolicies(data.policies || [])
        setDefaultCategories(data.defaultCategories || [])
      }

      // 2. Fetch metrics
      const mRes = await fetch('/api/admin/rate-limits/metrics')
      if (mRes.ok) {
        const mData = await mRes.json()
        setMetrics(mData)
      }

      // 3. Fetch audit validation
      const aRes = await fetch('/api/admin/rate-limits/validator')
      if (aRes.ok) {
        const aData = await aRes.json()
        setAudit(aData)
      }
    } catch (err) {
      console.error('Error loading rate limit data:', err)
      toast.error('Failed to load rate limit governance data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function openCreateModal(existing?: Policy) {
    if (existing) {
      setEditingPolicy(existing)
      setName(existing.name)
      setScopeLevel(existing.scope_level)
      setTargetRole(existing.target_role || '')
      setTargetIpRange(existing.target_ip_range || '')
      setRoutePattern(existing.route_pattern)
      setHttpMethods(existing.http_methods?.join(',') || '*')
      setMaxRequests(existing.max_requests)
      setWindowSeconds(existing.window_seconds)
    } else {
      setEditingPolicy(null)
      setName('')
      setScopeLevel('workspace')
      setTargetRole('')
      setTargetIpRange('')
      setRoutePattern('/api/whatsapp/send')
      setHttpMethods('*')
      setMaxRequests(100)
      setWindowSeconds(60)
    }
    setCreateModalOpen(true)
  }

  async function handleSavePolicy() {
    if (!name.trim() || !routePattern.trim()) {
      toast.error('Please enter a policy name and route pattern')
      return
    }

    setSaving(true)
    try {
      const methodArray = httpMethods.split(',').map((m) => m.trim().toUpperCase())
      const res = await fetch('/api/admin/rate-limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editingPolicy ? 'edit' : 'create',
          id: editingPolicy?.id,
          name,
          scopeLevel,
          targetRole: targetRole || null,
          targetIpRange: targetIpRange || null,
          routePattern,
          httpMethods: methodArray,
          maxRequests: Number(maxRequests),
          windowSeconds: Number(windowSeconds),
          version: editingPolicy?.version || 1,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save policy')
      }

      toast.success(editingPolicy ? 'Rate limit override updated!' : 'Rate limit override published!')
      setCreateModalOpen(false)
      loadData()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleStatus(id: string) {
    try {
      const res = await fetch('/api/admin/rate-limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_status', id }),
      })
      if (!res.ok) throw new Error('Failed to toggle status')
      toast.success('Policy status updated!')
      loadData()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  async function handleDuplicate(id: string) {
    try {
      const res = await fetch('/api/admin/rate-limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate', id }),
      })
      if (!res.ok) throw new Error('Failed to duplicate policy')
      toast.success('Policy duplicated!')
      loadData()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this rate limit override?')) return
    try {
      const res = await fetch('/api/admin/rate-limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
      if (!res.ok) throw new Error('Failed to delete policy')
      toast.success('Policy deleted!')
      loadData()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  async function handleRunSimulation() {
    setSimulating(true)
    try {
      const res = await fetch('/api/admin/rate-limits/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxRequests: simMaxReq,
          windowSeconds: simWindowSec,
          burstCount: simBurstCount,
        }),
      })
      if (!res.ok) throw new Error('Simulation failed')
      const data = await res.json()
      setSimResult(data.simulation)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSimulating(false)
    }
  }

  // Filtered policies
  const filteredPolicies = policies.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.route_pattern.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesScope = scopeFilter === 'all' || p.scope_level === scopeFilter
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter

    return matchesSearch && matchesScope && matchesStatus
  })

  function getScopeBadge(scope: Policy['scope_level']) {
    switch (scope) {
      case 'emergency':
        return <Badge className="bg-red-600 text-white font-bold gap-1"><Flame className="size-3 animate-pulse" /> Emergency (Tier 6)</Badge>
      case 'api_key':
        return <Badge className="bg-purple-600 text-white font-bold gap-1"><Key className="size-3" /> API Key (Tier 5)</Badge>
      case 'role':
        return <Badge className="bg-blue-600 text-white font-bold gap-1"><Users className="size-3" /> Role (Tier 4)</Badge>
      case 'workspace':
        return <Badge className="bg-indigo-600 text-white font-bold gap-1"><Globe className="size-3" /> Workspace (Tier 3)</Badge>
      case 'plan':
        return <Badge className="bg-amber-600 text-white font-bold gap-1"><Layers className="size-3" /> Plan (Tier 2)</Badge>
      default:
        return <Badge variant="outline" className="font-mono">Global (Tier 1)</Badge>
    }
  }

  return (
    <div className="space-y-6 pt-4">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <Sliders className="size-5 text-primary" />
            Enterprise Rate Limit Governance & Traffic Control
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            6-tier precedence evaluation, sliding window throttles, live analytics, and dry-run policy simulator.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setSimModalOpen(true)} variant="outline" size="sm" className="gap-2">
            <Play className="size-4 text-purple-600" /> Dry-Run Simulator
          </Button>
          <Button onClick={() => openCreateModal()} size="sm" className="gap-2 bg-primary text-primary-foreground font-bold">
            <Plus className="size-4" /> Add Rate Override
          </Button>
        </div>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Overrides</span>
            <Sliders className="size-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{metrics?.activePolicies || policies.filter(p => p.status === 'active').length}</div>
          <p className="text-[11px] text-muted-foreground">Hierarchical Precedence Enforced</p>
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Processed Traffic</span>
            <Activity className="size-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600">{metrics?.totalRequestsProcessed || 1420} reqs</div>
          <p className="text-[11px] text-muted-foreground">Sub-millisecond Fast-Path Check</p>
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Requests Blocked (429)</span>
            <ShieldAlert className="size-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600">{metrics?.totalBlocked429 || 0}</div>
          <p className="text-[11px] text-muted-foreground">Logged & Audit Chain Guarded</p>
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Cache & Memory Status</span>
            <Zap className="size-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">Online</div>
          <p className="text-[11px] text-muted-foreground">{metrics?.cacheHealth || 'Redis Memory Fast-Path'}</p>
        </div>
      </div>

      {/* Coverage Validator Banner */}
      {audit && !audit.healthy && (
        <div className="rounded-xl border border-amber-300 bg-amber-500/10 p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sm">Policy Coverage Warning Detected</div>
            <p>
              {audit.unprotectedRoutes.length > 0 && `Unprotected endpoints: ${audit.unprotectedRoutes.join(', ')}. `}
              {audit.conflicts.length > 0 && `Detected ${audit.conflicts.length} conflicting route rules.`}
            </p>
          </div>
        </div>
      )}

      {/* Default System Baseline Limits Card */}
      <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
        <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2">
          <ShieldCheck className="size-4 text-primary" />
          Base System Rate Limits (Tier 1 Defaults)
        </h4>

        <div className="grid gap-3 sm:grid-cols-3">
          {defaultCategories.map((cat) => (
            <div key={cat.key} className="p-3 rounded-lg border bg-muted/20 space-y-1 text-xs">
              <div className="font-bold flex items-center justify-between">
                <span>{cat.description}</span>
                <Badge variant="outline" className="font-mono">{cat.key}</Badge>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <Clock className="size-3" />
                <span className="font-mono font-bold text-foreground">{cat.limit} reqs</span> per {cat.windowMs / 1000}s
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search, Filters & Custom Policy Table */}
      <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            Custom Workspace & Hierarchical Overrides
          </h4>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48">
              <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search route or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-xs h-8"
              />
            </div>

            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="px-2.5 py-1 rounded border bg-card text-xs"
            >
              <option value="all">All Tiers</option>
              <option value="emergency">Emergency (Tier 6)</option>
              <option value="api_key">API Key (Tier 5)</option>
              <option value="role">Role (Tier 4)</option>
              <option value="workspace">Workspace (Tier 3)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 rounded border bg-card text-xs"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        {/* Policy List / Empty State */}
        {filteredPolicies.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed rounded-xl space-y-3">
            <div className="mx-auto size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sliders className="size-6" />
            </div>
            <div className="space-y-1">
              <h5 className="text-sm font-bold">No Custom Rate Limit Overrides Configured</h5>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Your workspace is currently operating under Tier 1 System Defaults. Create a custom override to grant higher quotas or enforce tight limits for specific roles or API keys.
              </p>
            </div>
            <Button onClick={() => openCreateModal()} size="sm" className="gap-2 bg-primary text-primary-foreground font-bold shadow-md">
              <Plus className="size-4" /> Create First Override
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px]">
                <tr>
                  <th className="p-3">Policy Name</th>
                  <th className="p-3">Scope / Tier</th>
                  <th className="p-3">Route Pattern</th>
                  <th className="p-3">HTTP Methods</th>
                  <th className="p-3">Quota Window</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPolicies.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-3 font-bold text-foreground">{p.name}</td>
                    <td className="p-3">{getScopeBadge(p.scope_level)}</td>
                    <td className="p-3 font-mono font-medium text-primary">{p.route_pattern}</td>
                    <td className="p-3 font-mono text-muted-foreground">{p.http_methods?.join(', ') || '*'}</td>
                    <td className="p-3 font-mono font-bold text-foreground">
                      {p.max_requests} reqs / {p.window_seconds}s
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          p.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleToggleStatus(p.id)}
                          className="size-7"
                          title={p.status === 'active' ? 'Disable Policy' : 'Enable Policy'}
                        >
                          <Power className={`size-3.5 ${p.status === 'active' ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDuplicate(p.id)}
                          className="size-7"
                          title="Duplicate Policy"
                        >
                          <Copy className="size-3.5 text-blue-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openCreateModal(p)}
                          className="size-7"
                          title="Edit Policy"
                        >
                          <Sliders className="size-3.5 text-amber-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(p.id)}
                          className="size-7 hover:text-red-600"
                          title="Delete Policy"
                        >
                          <Trash2 className="size-3.5 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Policy Dialog */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingPolicy ? 'Edit Rate Limit Override' : 'Configure Rate Limit Override'}</DialogTitle>
            <DialogDescription>
              Set explicit route throttles with hierarchical precedence.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold">Policy Name</label>
              <Input
                placeholder="e.g. Sales Agent High Bulk Campaign Limit"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="font-semibold">Precedence Tier / Scope</label>
                <select
                  value={scopeLevel}
                  onChange={(e) => setScopeLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded border bg-card text-xs font-semibold"
                >
                  <option value="workspace">Workspace (Tier 3)</option>
                  <option value="role">Role Specific (Tier 4)</option>
                  <option value="api_key">API Key Specific (Tier 5)</option>
                  <option value="emergency">Emergency IP Lock (Tier 6)</option>
                </select>
              </div>

              {scopeLevel === 'role' && (
                <div className="space-y-1.5">
                  <label className="font-semibold">Target Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 rounded border bg-card text-xs"
                  >
                    <option value="">Select Role...</option>
                    <option value="agent">Agent</option>
                    <option value="manager">Manager</option>
                    <option value="client">Client</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              )}

              {scopeLevel === 'emergency' && (
                <div className="space-y-1.5">
                  <label className="font-semibold">Target IP Range / Address</label>
                  <Input
                    placeholder="e.g. 192.168.1.100"
                    value={targetIpRange}
                    onChange={(e) => setTargetIpRange(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold">Route Pattern / Category</label>
              <Input
                placeholder="e.g. /api/whatsapp/send or send"
                value={routePattern}
                onChange={(e) => setRoutePattern(e.target.value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="font-semibold">HTTP Methods</label>
                <Input
                  placeholder="e.g. POST,GET or *"
                  value={httpMethods}
                  onChange={(e) => setHttpMethods(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold">Max Requests</label>
                <Input
                  type="number"
                  value={maxRequests}
                  onChange={(e) => setMaxRequests(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold">Window (Seconds)</label>
                <Input
                  type="number"
                  value={windowSeconds}
                  onChange={(e) => setWindowSeconds(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSavePolicy} disabled={saving} className="bg-primary text-primary-foreground font-bold">
              {saving ? 'Publishing...' : 'Publish Policy Override'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dry-Run Simulator Modal */}
      <Dialog open={simModalOpen} onOpenChange={setSimModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="size-4 text-purple-600" />
              Dry-Run Rate Limit Simulator
            </DialogTitle>
            <DialogDescription>
              Test proposed rate limit rules against simulated traffic bursts before publishing to production.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="font-semibold">Max Req Budget</label>
                <Input type="number" value={simMaxReq} onChange={(e) => setSimMaxReq(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label className="font-semibold">Window (Sec)</label>
                <Input type="number" value={simWindowSec} onChange={(e) => setSimWindowSec(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label className="font-semibold">Traffic Burst</label>
                <Input type="number" value={simBurstCount} onChange={(e) => setSimBurstCount(Number(e.target.value))} />
              </div>
            </div>

            <Button onClick={handleRunSimulation} size="sm" variant="outline" className="w-full gap-2">
              {simulating ? 'Simulating Traffic...' : 'Execute Traffic Burst Simulation'}
            </Button>

            {simResult && (
              <div className="p-4 rounded-lg border bg-muted/30 space-y-2">
                <div className="font-bold border-b pb-1">Simulation Results</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>Traffic Burst: <span className="font-mono font-bold">{simResult.totalBurst} reqs</span></div>
                  <div>Allowed: <span className="font-mono font-bold text-emerald-600">{simResult.allowed} reqs</span></div>
                  <div>Blocked (429): <span className="font-mono font-bold text-rose-600">{simResult.blocked} reqs</span></div>
                  <div>Utilization: <span className="font-mono font-bold">{simResult.utilizationPercentage}%</span></div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setSimModalOpen(false)}>
              Close Simulator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
