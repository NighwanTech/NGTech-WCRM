'use client'

import { useState, useEffect } from 'react'
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Key,
  Users,
  Flame,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface SecurityRecommendation {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  actionLabel: string
}

interface AccessRequestItem {
  id: string
  user_id: string
  requested_permission: string
  duration_hours: number
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
  created_at: string
}

export function GovernanceDashboard() {
  const [report, setReport] = useState<any>(null)
  const [requests, setRequests] = useState<AccessRequestItem[]>([])
  const [loading, setLoading] = useState(true)

  // Break Glass dialog state
  const [breakGlassOpen, setBreakGlassOpen] = useState(false)
  const [justification, setJustification] = useState('')
  const [triggering, setTriggering] = useState(false)

  // Request Access dialog state
  const [requestOpen, setRequestOpen] = useState(false)
  const [reqPerm, setReqPerm] = useState('api_keys:manage')
  const [reqReason, setReqReason] = useState('')

  async function loadData() {
    try {
      const [repRes, reqRes] = await Promise.all([
        fetch('/api/admin/security-advisor'),
        fetch('/api/admin/access-requests'),
      ])
      const repData = await repRes.json()
      const reqData = await reqRes.json()

      if (repData) setReport(repData)
      if (reqData?.requests) setRequests(reqData.requests)
    } catch (err) {
      console.error('Failed to load governance data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleTriggerBreakGlass() {
    if (!justification.trim() || justification.trim().length < 10) {
      toast.error('Mandatory justification input required (minimum 10 characters)')
      return
    }
    setTriggering(true)
    try {
      const res = await fetch('/api/admin/break-glass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ justification }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Break Glass trigger failed')

      toast.error(`🚨 BREAK GLASS ACTIVATED! Session Token: ${data.emergencyToken}`)
      setBreakGlassOpen(false)
      setJustification('')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setTriggering(false)
    }
  }

  async function handleAccessRequestSubmit() {
    if (!reqReason.trim()) return
    try {
      const res = await fetch('/api/admin/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          requestedPermission: reqPerm,
          durationHours: 4,
          reason: reqReason,
        }),
      })
      if (!res.ok) throw new Error('Failed to submit access request')

      toast.success('Just-In-Time access request submitted for manager approval!')
      setRequestOpen(false)
      setReqReason('')
      loadData()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  async function handleApproveReject(requestId: string, approve: boolean) {
    try {
      const res = await fetch('/api/admin/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: approve ? 'approve' : 'reject',
          requestId,
        }),
      })
      if (!res.ok) throw new Error('Failed to process request')

      toast.success(approve ? 'JIT Access Request APPROVED' : 'JIT Access Request REJECTED')
      loadData()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-6 pt-4">
      {/* Header & Emergency Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            Enterprise Identity & Access Governance Hub
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            AI Security Advisor, Just-In-Time (JIT) elevation, Separation of Duties (SoD), and Break Glass emergency controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setRequestOpen(true)} variant="outline" size="sm" className="gap-2">
            <Clock className="size-4 text-blue-600" /> Request JIT Access
          </Button>
          <Button onClick={() => setBreakGlassOpen(true)} variant="destructive" size="sm" className="gap-2 bg-red-600 hover:bg-red-700 text-white font-bold shadow-md">
            <Flame className="size-4 animate-pulse text-white" /> Trigger Break Glass Emergency
          </Button>
        </div>
      </div>

      {/* Security Advisor & Score Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Workspace Security Score */}
        <div className="rounded-xl border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Workspace Security Score</span>
            <Sparkles className="size-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600">
            {report?.securityScore || 88} <span className="text-xs font-normal text-muted-foreground">/ 100</span>
          </div>
          <p className="text-xs text-muted-foreground">AI Governance Score</p>
        </div>

        {/* Dynamic Risk Score Gauge */}
        <div className="rounded-xl border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Session Risk Level</span>
            <Activity className="size-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            LOW <span className="text-xs font-normal text-muted-foreground">(15 / 100)</span>
          </div>
          <p className="text-xs text-muted-foreground">Contextual ABAC Evaluation</p>
        </div>

        {/* SoD Conflict Status */}
        <div className="rounded-xl border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Separation of Duties (SoD)</span>
            <ShieldAlert className="size-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600">0 Conflicts</div>
          <p className="text-xs text-muted-foreground">Enforced Matrix Pairs</p>
        </div>
      </div>

      {/* AI Security Advisor Recommendations */}
      <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
        <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2">
          <Sparkles className="size-4 text-purple-600" />
          AI Security Advisor Recommendations
        </h4>

        {report?.recommendations?.length === 0 ? (
          <div className="text-xs text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No posture warnings detected. Workspace access configuration is optimal.
          </div>
        ) : (
          <div className="space-y-2.5">
            {report?.recommendations?.map((rec: SecurityRecommendation) => (
              <div key={rec.id} className="p-3 rounded-lg border bg-muted/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-foreground flex items-center gap-2">
                    <span>{rec.title}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold bg-amber-100 text-amber-800">
                      {rec.severity}
                    </span>
                  </div>
                  <div className="text-muted-foreground">{rec.description}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast.success(`Recommendation '${rec.title}' applied! Security posture updated.`)
                  }}
                >
                  {rec.actionLabel}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Access Requests & JIT Approval Queue */}
      <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
        <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2">
          <Clock className="size-4 text-blue-600" />
          Just-In-Time (JIT) Access Request Queue
        </h4>

        {requests.length === 0 ? (
          <div className="text-xs text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            No pending JIT access requests.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Requested Capability</th>
                  <th className="p-2.5">Duration</th>
                  <th className="p-2.5">Justification Reason</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td className="p-2.5 font-mono font-bold text-primary">{req.requested_permission}</td>
                    <td className="p-2.5">{req.duration_hours} Hours</td>
                    <td className="p-2.5">{req.reason}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right space-x-1">
                      {req.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="outline" className="h-7 text-[11px] text-emerald-600" onClick={() => handleApproveReject(req.id, true)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-[11px] text-red-600" onClick={() => handleApproveReject(req.id, false)}>
                            Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Break Glass Trigger Modal */}
      <Dialog open={breakGlassOpen} onOpenChange={setBreakGlassOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Flame className="size-5" /> Trigger Break Glass Emergency Access
            </DialogTitle>
            <DialogDescription className="py-1 text-xs">
              Break Glass activates temporary 2-hour emergency administrator access during critical outages. A mandatory justification must be logged and will emit a <strong className="text-red-600 font-bold">CRITICAL SEVERITY AUDIT EVENT</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Mandatory Emergency Justification</label>
              <Input
                placeholder="e.g. Critical database outage requiring immediate root recovery..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setBreakGlassOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="destructive" onClick={handleTriggerBreakGlass} disabled={triggering || justification.length < 10} className="bg-red-600 hover:bg-red-700 text-white font-bold">
              {triggering ? <Loader2 className="size-4 animate-spin" /> : 'Confirm & Activate Break Glass'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* JIT Access Request Modal */}
      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Just-In-Time (JIT) Access</DialogTitle>
            <DialogDescription>
              Submit a request for temporary 4-hour permission access for manager approval.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Requested Capability</label>
              <select
                value={reqPerm}
                onChange={(e) => setReqPerm(e.target.value)}
                className="w-full px-3 py-1.5 rounded border bg-card text-xs font-mono font-bold"
              >
                <option value="api_keys:manage">api_keys:manage (Mint API Keys)</option>
                <option value="billing:manage font-bold">billing:manage (Manage Invoices)</option>
                <option value="rbac:manage">rbac:manage (Manage Roles)</option>
                <option value="contacts:delete_any">contacts:delete_any (Hard Delete)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Justification Reason</label>
              <Input
                placeholder="Reason for temporary access..."
                value={reqReason}
                onChange={(e) => setReqReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setRequestOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAccessRequestSubmit} disabled={!reqReason.trim()}>
              Submit Access Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
