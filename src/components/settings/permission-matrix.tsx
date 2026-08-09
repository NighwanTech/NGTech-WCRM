'use client'

import { useState, useEffect } from 'react'
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sliders,
  MessageSquare,
  Building,
  Download,
  Upload,
  Eye,
  Sparkles,
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
import {
  ROLE_PERMISSION_MAP,
  PERMISSION_DEPENDENCIES,
  ROLE_TEMPLATES,
  Permission,
  DataScope,
} from '@/lib/security/permissions'
import { useSimulation } from '@/components/security/simulation-provider'

interface CustomRole {
  id: string
  name: string
  description?: string
  data_scope?: DataScope
  is_system: boolean
}

interface PermissionCategory {
  name: string
  icon: any
  items: { key: Permission; label: string; protected?: boolean }[]
}

const CATEGORIES: PermissionCategory[] = [
  {
    name: '🔒 Security & Governance',
    icon: ShieldCheck,
    items: [
      { key: 'security:read', label: 'View Security Center Overview' },
      { key: 'audit:read', label: 'Read Cryptographic SHA-256 Audit Logs' },
      { key: 'sessions:read', label: 'View Active Sessions Roster' },
      { key: 'sessions:manage', label: 'Remote Revoke Active Sessions', protected: true },
      { key: 'api_keys:manage', label: 'Create, View & Revoke API Keys', protected: true },
      { key: 'rbac:manage', label: 'Manage Roles & Permission Matrix', protected: true },
      { key: 'rate_limits:manage', label: 'Configure Rate Limit Overrides', protected: true },
      { key: 'compliance:read', label: 'Export GDPR Data Archives', protected: true },
      { key: 'webhooks:read', label: 'View Webhook Monitor & Queue DLQ' },
      { key: 'system_health:read', label: 'Access System Health Diagnostic Endpoint' },
    ],
  },
  {
    name: '👥 CRM & Contacts',
    icon: Building,
    items: [
      { key: 'contacts:read', label: 'View Contacts & Company Lists' },
      { key: 'contacts:create', label: 'Create & Edit Contact Records' },
      { key: 'contacts:delete_any', label: 'Hard Delete Contact Records', protected: true },
    ],
  },
  {
    name: '💬 Messaging & Drip Campaigns',
    icon: MessageSquare,
    items: [
      { key: 'messages:read', label: 'Read Shared Inbox Conversations' },
      { key: 'messages:send', label: 'Send Outbound Messages & Replies' },
      { key: 'broadcasts:launch', label: 'Launch Bulk WhatsApp Campaigns' },
      { key: 'sequences:manage', label: 'Build & Trigger Automated Sequences' },
    ],
  },
  {
    name: '⚙️ Workspace Administration',
    icon: Sliders,
    items: [
      { key: 'team:manage', label: 'Invite & Manage Team Members', protected: true },
      { key: 'settings:write', label: 'Edit WhatsApp & Account Settings', protected: true },
      { key: 'billing:manage', label: 'Manage Subscription & Invoices', protected: true },
    ],
  },
]

export function PermissionMatrix() {
  const { startSimulation } = useSimulation()
  const [selectedRole, setSelectedRole] = useState<string>('admin')
  const [selectedScope, setSelectedScope] = useState<DataScope>('all')
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([])
  const [rolePermissions, setRolePermissions] = useState<Set<string>>(new Set())

  // Modal dialog states
  const [createOpen, setCreateOpen] = useState(false)
  const [templateOpen, setTemplateOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDesc, setNewRoleDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const [protectedConfirmKey, setProtectedConfirmKey] = useState<Permission | null>(null)

  async function loadRoles() {
    try {
      const res = await fetch('/api/admin/roles')
      const data = await res.json()
      if (data?.customRoles) {
        setCustomRoles(data.customRoles)
      }
    } catch (err) {
      console.error('Failed to load custom roles:', err)
    }
  }

  useEffect(() => {
    loadRoles()
  }, [])

  useEffect(() => {
    const systemSet = ROLE_PERMISSION_MAP[selectedRole]
    if (systemSet) {
      setRolePermissions(new Set(Array.from(systemSet)))
    } else {
      setRolePermissions(new Set())
    }
  }, [selectedRole])

  async function handleCreateRole() {
    if (!newRoleName.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoleName, description: newRoleDesc }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create role')

      toast.success(`Custom role '${newRoleName}' created successfully!`)
      setCreateOpen(false)
      setNewRoleName('')
      setNewRoleDesc('')
      await loadRoles()
      setSelectedRole(newRoleName)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setCreating(false)
    }
  }

  async function handleApplyTemplate(templateName: string) {
    const tmpl = ROLE_TEMPLATES.find((t) => t.name === templateName)
    if (!tmpl) return

    setCreating(true)
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tmpl.name, description: tmpl.description }),
      })
      const data = await res.json()
      if (!res.ok && data.error && !data.error.includes('already exists')) {
        throw new Error(data.error)
      }

      // Populate template permissions
      for (const perm of tmpl.permissions) {
        await fetch('/api/admin/permissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roleName: tmpl.name, permission: perm, enabled: true }),
        })
      }

      toast.success(`Role template '${tmpl.name}' applied successfully!`)
      setTemplateOpen(false)
      await loadRoles()
      setSelectedRole(tmpl.name)
      setSelectedScope(tmpl.defaultScope)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setCreating(false)
    }
  }

  async function handleExportRoles() {
    try {
      const res = await fetch('/api/admin/roles/export')
      const bundle = await res.json()

      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `aiwcrm_roles_export_${Date.now()}.json`
      a.click()
      toast.success('Custom roles JSON bundle exported!')
    } catch (err) {
      toast.error('Failed to export roles bundle')
    }
  }

  async function togglePermission(permissionKey: Permission, enabled: boolean) {
    const nextSet = new Set(rolePermissions)
    if (enabled) {
      nextSet.add(permissionKey)
      const parent = PERMISSION_DEPENDENCIES[permissionKey]
      if (parent) nextSet.add(parent)
    } else {
      nextSet.delete(permissionKey)
    }
    setRolePermissions(nextSet)

    try {
      const res = await fetch('/api/admin/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleName: selectedRole, permission: permissionKey, enabled }),
      })
      if (!res.ok) throw new Error('Failed to update permission')

      toast.success(enabled ? `Granted '${permissionKey}'` : `Revoked '${permissionKey}'`)
    } catch (err: any) {
      toast.error(err.message)
      loadRoles()
    }
  }

  function handleCheckboxClick(key: Permission, isProtected: boolean | undefined) {
    const isCurrentlyChecked = rolePermissions.has('all') || rolePermissions.has(key)
    const nextEnabled = !isCurrentlyChecked

    if (nextEnabled && isProtected) {
      setProtectedConfirmKey(key)
    } else {
      togglePermission(key, nextEnabled)
    }
  }

  return (
    <div className="space-y-6 pt-4">
      {/* Header & Role Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            Interactive Checkbox Permission Matrix UI
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure fine-grained permissions, pre-built role templates, and data-level visibility scopes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => startSimulation(selectedRole)} variant="outline" size="sm" className="gap-2 text-amber-600 border-amber-300 bg-amber-50">
            <Eye className="size-4" /> Simulate Experience
          </Button>
          <Button onClick={() => setTemplateOpen(true)} variant="outline" size="sm" className="gap-2">
            <Sparkles className="size-4 text-purple-600" /> Apply Role Template
          </Button>
          <Button onClick={handleExportRoles} variant="outline" size="sm" className="gap-2">
            <Download className="size-4" /> Export JSON
          </Button>
          <Button onClick={() => setCreateOpen(true)} variant="default" size="sm" className="gap-2">
            <Plus className="size-4" /> Create Custom Role
          </Button>
        </div>
      </div>

      {/* Role & Data Scope Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/40 p-3 rounded-xl border">
        <div className="flex flex-wrap gap-2">
          {['admin', 'manager', 'agent', 'client', 'viewer'].map((sysRole) => (
            <button
              key={sysRole}
              type="button"
              onClick={() => setSelectedRole(sysRole)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                selectedRole === sysRole
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card text-muted-foreground hover:bg-muted border-border'
              }`}
            >
              {sysRole}
            </button>
          ))}

          {customRoles.map((cRole) => (
            <button
              key={cRole.id}
              type="button"
              onClick={() => setSelectedRole(cRole.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all border flex items-center gap-1.5 ${
                selectedRole === cRole.name
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
              }`}
            >
              <span>{cRole.name}</span>
              <span className="text-[9px] bg-purple-200 text-purple-800 px-1 py-0.2 rounded uppercase">Custom</span>
            </button>
          ))}
        </div>

        {/* Data Scope Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-muted-foreground">Data Visibility Scope:</span>
          <select
            value={selectedScope}
            onChange={(e) => setSelectedScope(e.target.value as DataScope)}
            className="px-2 py-1 rounded border bg-card text-xs font-mono font-semibold"
          >
            <option value="all">ALL WORKSPACE DATA (FULL)</option>
            <option value="region">REGION ONLY</option>
            <option value="branch">BRANCH / CITY ONLY</option>
            <option value="department">DEPARTMENT ONLY</option>
            <option value="team">TEAM ONLY</option>
            <option value="assigned">ASSIGNED RECORDS ONLY</option>
            <option value="own">OWN RECORDS ONLY</option>
          </select>
        </div>
      </div>

      {/* Category Grouped Checkbox Matrix */}
      <div className="space-y-6">
        {CATEGORIES.map((category) => {
          const CategoryIcon = category.icon
          return (
            <div key={category.name} className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
              <h4 className="text-sm font-bold flex items-center gap-2 text-foreground border-b pb-2">
                <CategoryIcon className="size-4 text-primary" />
                {category.name}
              </h4>

              <div className="grid gap-3 sm:grid-cols-2">
                {category.items.map((item) => {
                  const isChecked = rolePermissions.has('all') || rolePermissions.has(item.key)

                  return (
                    <label
                      key={item.key}
                      className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isChecked ? 'bg-primary/5 border-primary/30' : 'bg-muted/20 border-border hover:bg-muted/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxClick(item.key, item.protected)}
                        className="size-4 mt-0.5 rounded border-border text-primary focus:ring-primary"
                      />
                      <div className="space-y-0.5">
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <span>{item.label}</span>
                          {item.protected && (
                            <span className="text-[9px] font-mono uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300">
                              Protected
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground">{item.key}</div>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Custom Role Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Custom Workspace Role</DialogTitle>
            <DialogDescription>
              Create a custom role (e.g., &quot;Support Lead&quot;, &quot;Sales Manager&quot;).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Role Name</label>
              <Input
                placeholder="e.g. Sales Manager"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Description (Optional)</label>
              <Input
                placeholder="Role responsibility overview..."
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateRole} disabled={creating || !newRoleName.trim()}>
              {creating ? <Loader2 className="size-4 animate-spin" /> : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Role Template Dialog */}
      <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-purple-600" /> Apply Pre-Built Role Template
            </DialogTitle>
            <DialogDescription>
              Accelerate workspace setup with 7 standardized enterprise role templates.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-[350px] overflow-y-auto py-2">
            {ROLE_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.name}
                className="p-3 border rounded-lg hover:border-purple-300 hover:bg-purple-50/50 transition-colors flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>{tmpl.name}</span>
                    <span className="text-[9px] font-mono bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded uppercase">
                      Scope: {tmpl.defaultScope}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{tmpl.description}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleApplyTemplate(tmpl.name)} disabled={creating}>
                  Apply Template
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setTemplateOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Protected Permission Confirmation Modal */}
      <Dialog open={!!protectedConfirmKey} onOpenChange={() => setProtectedConfirmKey(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="size-5" /> Confirm High-Risk Permission Grant
            </DialogTitle>
            <DialogDescription className="py-2 text-xs leading-relaxed">
              You are about to grant the protected permission <span className="font-mono font-bold text-foreground">{protectedConfirmKey}</span> to role <span className="font-bold text-foreground">{selectedRole}</span>. This grants elevated access to sensitive workspace controls.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setProtectedConfirmKey(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
              onClick={() => {
                if (protectedConfirmKey) {
                  togglePermission(protectedConfirmKey, true)
                  setProtectedConfirmKey(null)
                }
              }}
            >
              Confirm & Grant Permission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
