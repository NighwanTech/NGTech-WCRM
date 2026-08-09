'use client'

import { useState } from 'react'
import { ShieldCheck, UserCheck, Lock, CheckCircle2, Clock, Activity, Key } from 'lucide-react'
import { ROLE_PERMISSION_MAP, AccountRole } from '@/lib/security/permissions'

interface EffectivePermissionInspectorProps {
  userEmail?: string
  role?: AccountRole
}

export function EffectivePermissionInspector({
  userEmail = 'sandeep@nighwantech.com',
  role = 'owner',
}: EffectivePermissionInspectorProps) {
  const permissionsSet = ROLE_PERMISSION_MAP[role] || new Set()
  const permissionsList = Array.from(permissionsSet)

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            Effective Permission Inspector
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Surfaces active base role permissions, user overrides, temporary access, and data visibility scope.
          </p>
        </div>
        <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
          Active User: {userEmail}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-3 border rounded-lg bg-muted/30 space-y-1">
          <div className="text-xs font-medium text-muted-foreground">Assigned Role</div>
          <div className="text-sm font-bold uppercase text-primary">{role}</div>
        </div>
        <div className="p-3 border rounded-lg bg-muted/30 space-y-1">
          <div className="text-xs font-medium text-muted-foreground">Data Visibility Scope</div>
          <div className="text-sm font-bold uppercase text-emerald-600">All Workspace Data (Full)</div>
        </div>
        <div className="p-3 border rounded-lg bg-muted/30 space-y-1">
          <div className="text-xs font-medium text-muted-foreground">Total Active Capabilities</div>
          <div className="text-sm font-bold text-blue-600">{permissionsList.includes('all' as any) ? 'Unlimited (All)' : permissionsList.length}</div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Capabilities Breakdown</h4>
        <div className="flex flex-wrap gap-1.5">
          {permissionsList.map((perm) => (
            <span
              key={perm}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/20"
            >
              <CheckCircle2 className="size-3 text-emerald-500" />
              {perm}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
