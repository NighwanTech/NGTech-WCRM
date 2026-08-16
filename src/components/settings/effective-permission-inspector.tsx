'use client'

import { useState } from 'react'
import {
  ShieldCheck,
  UserCheck,
  Lock,
  CheckCircle2,
  Clock,
  Activity,
  Key,
  Layers,
  Sparkles,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ROLE_PERMISSION_MAP,
  AccountRole,
  ALL_ACTION_KEYS,
  DEFAULT_ORG_POLICIES,
} from '@/lib/security/permissions'

interface UserItem {
  id: string
  name: string
  email: string
  role: string
  templateName: string
  scope: string
  overridesCount: number
}

const SAMPLE_TEAM_INSPECTOR: UserItem[] = [
  { id: 'u1', name: 'Rahul Sharma', email: 'rahul.sharma@nighwantech.com', role: 'manager', templateName: 'Sales Manager Template', scope: 'DEPARTMENT_ONLY', overridesCount: 8 },
  { id: 'u2', name: 'Sunil Kumar', email: 'sunil.kumar@wacrm.com', role: 'agent', templateName: 'Sales Executive Template', scope: 'ASSIGNED_LEADS_ONLY', overridesCount: 3 },
  { id: 'u3', name: 'Priya Singh', email: 'priya.singh@wacrm.com', role: 'agent', templateName: 'Sales Executive Template', scope: 'ASSIGNED_LEADS_ONLY', overridesCount: 2 },
  { id: 'u4', name: 'Sandeep Kumar', email: 'sandeep@nighwantech.com', role: 'owner', templateName: 'Super Admin Bypass', scope: 'ALL_WORKSPACE_DATA (FULL)', overridesCount: 0 },
]

export function EffectivePermissionInspector() {
  const [selectedUserId, setSelectedUserId] = useState<string>('u1')

  const selectedUser = SAMPLE_TEAM_INSPECTOR.find((u) => u.id === selectedUserId) || SAMPLE_TEAM_INSPECTOR[0]
  const isOwner = selectedUser.role === 'owner'
  const baseSet = ROLE_PERMISSION_MAP[selectedUser.role] || new Set()

  const inheritedCount = isOwner ? ALL_ACTION_KEYS.length : baseSet.size
  const overridesCount = selectedUser.overridesCount
  const blockedByOrgPolicyCount = isOwner ? 0 : DEFAULT_ORG_POLICIES.filter((p) => p.enabled).reduce((acc, p) => acc + p.blockedActionKeys.length, 0)
  const finalEffectiveCount = isOwner ? ALL_ACTION_KEYS.length : Math.max(0, inheritedCount + overridesCount - blockedByOrgPolicyCount)

  const activePermissionsList = Array.from(baseSet)

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Effective Permission & Data Scope Inspector
            </h3>
            <p className="text-xs text-muted-foreground">
              Evaluates multi-tier policy resolution: Base Role + Template + Individual Overrides − Org Policy Blocks.
            </p>
          </div>
        </div>

        {/* User Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground shrink-0">Inspect User:</span>
          <Select value={selectedUserId} onValueChange={(val) => val && setSelectedUserId(val)}>
            <SelectTrigger className="h-8 text-xs w-56 font-mono bg-background">
              <SelectValue placeholder="Select Team Member" />
            </SelectTrigger>
            <SelectContent>
              {SAMPLE_TEAM_INSPECTOR.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{u.name}</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 uppercase">{u.role}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 4-Metric Tier Computation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        {/* Metric 1: Inherited */}
        <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">1. Inherited (Base)</span>
          <div className="text-xl font-extrabold text-foreground">{inheritedCount}</div>
          <p className="text-[10px] text-muted-foreground font-sans">Via role: <strong className="uppercase">{selectedUser.role}</strong></p>
        </div>

        {/* Metric 2: Overrides */}
        <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">2. Template Overrides</span>
          <div className="text-xl font-extrabold text-emerald-600">+{overridesCount}</div>
          <p className="text-[10px] text-muted-foreground font-sans truncate">{selectedUser.templateName}</p>
        </div>

        {/* Metric 3: Blocked by Org */}
        <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">3. Blocked by Org Policy</span>
          <div className="text-xl font-extrabold text-destructive">-{blockedByOrgPolicyCount}</div>
          <p className="text-[10px] text-muted-foreground font-sans">Strict security caps</p>
        </div>

        {/* Metric 4: Final Effective */}
        <div className="p-3 rounded-xl border bg-primary/10 border-primary/30 space-y-1">
          <span className="text-[10px] text-primary uppercase font-bold">4. Final Effective</span>
          <div className="text-xl font-extrabold text-primary">{finalEffectiveCount}</div>
          <p className="text-[10px] text-primary/80 font-sans">Action Capabilities</p>
        </div>
      </div>

      {/* User Scope Banner */}
      <div className="p-3 rounded-xl border bg-muted/30 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>
            User: <strong>{selectedUser.name}</strong> ({selectedUser.email})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Enforced Data Visibility:</span>
          <Badge className="bg-emerald-600 text-white font-mono text-[10px]">
            {selectedUser.scope}
          </Badge>
        </div>
      </div>

      {/* Active Capabilities Sample Grid */}
      <div className="space-y-2 pt-1 font-mono">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">
            Active Effective Capability Chips
          </span>
          <span className="text-[10px] text-muted-foreground">Showing key active grants</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1">
          {activePermissionsList.slice(0, 30).map((perm) => (
            <span
              key={perm}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-primary/10 text-primary border border-primary/20"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {perm}
            </span>
          ))}
          {activePermissionsList.length > 30 && (
            <span className="text-[10px] text-muted-foreground self-center px-1">
              +{activePermissionsList.length - 30} more capabilities active
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
