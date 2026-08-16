'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Eye,
  Shield,
  User,
  Layers,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Command,
  Plus,
  Key,
  Globe,
  Sliders,
} from 'lucide-react'
import { toast } from 'sonner'
import { ENTERPRISE_WORKSPACES, WorkspaceId, ROLE_PERMISSION_MAP } from '@/lib/security/permissions'
import { useSimulation } from './simulation-provider'

interface PermissionSimulatorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialRole?: string
}

const SAMPLE_USERS = [
  { id: 'user_1', name: 'Rahul Sharma', email: 'rahul.sharma@enterprise.local', defaultRole: 'manager' },
  { id: 'user_2', name: 'Sunil Kumar', email: 'sunil.kumar@enterprise.local', defaultRole: 'agent' },
  { id: 'user_3', name: 'Priya Singh', email: 'priya.singh@enterprise.local', defaultRole: 'agent' },
  { id: 'user_4', name: 'Sandeep Kumar', email: 'sandeep@nighwantech.com', defaultRole: 'owner' },
  { id: 'user_5', name: 'Patna Real Estate Client', email: 'director@patnarealestate.com', defaultRole: 'client' },
]

export function PermissionSimulatorModal({
  open,
  onOpenChange,
  initialRole = 'agent',
}: PermissionSimulatorModalProps) {
  const { startSimulation } = useSimulation()
  const [selectedRole, setSelectedRole] = useState<string>(initialRole)
  const [selectedUserId, setSelectedUserId] = useState<string>('user_2')
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceId>('sales')

  const selectedUser = SAMPLE_USERS.find((u) => u.id === selectedUserId) || SAMPLE_USERS[1]
  const currentWorkspaceDef = ENTERPRISE_WORKSPACES.find((w) => w.id === selectedWorkspace) || ENTERPRISE_WORKSPACES[4]

  const activeRolePerms = ROLE_PERMISSION_MAP[selectedRole] || new Set()
  const isFullAdmin = selectedRole === 'owner' || (selectedRole === 'admin' && activeRolePerms.has('all'))

  // Calculate workspace visibility
  const allWorkspaceActions = currentWorkspaceDef.features.flatMap((f) => f.actions)
  const grantedActions = allWorkspaceActions.filter((a) => isFullAdmin || activeRolePerms.has(a.key))
  const restrictedActions = allWorkspaceActions.filter((a) => !isFullAdmin && !activeRolePerms.has(a.key))

  // Calculate Quick Create options visible
  const quickCreateOptions = [
    { title: 'New Meta Ad Campaign', req: 'marketing:campaign_create' },
    { title: 'New Commercial Deal', req: 'deals:manage' },
    { title: 'New Proposal & SOW', req: 'proposals:manage' },
    { title: 'New 18% GST Quotation', req: 'quotations:manage' },
    { title: 'New GST Invoice', req: 'finance:invoice_create' },
    { title: 'New Workflow Automation', req: 'automation:flows_edit' },
    { title: 'Invite Platform User', req: 'team:manage' },
  ]

  const visibleQuickCreates = quickCreateOptions.filter((q) => isFullAdmin || activeRolePerms.has(q.req))
  const hiddenQuickCreates = quickCreateOptions.filter((q) => !isFullAdmin && !activeRolePerms.has(q.req))

  const handleLaunchLiveSimulation = () => {
    startSimulation(selectedRole, selectedUser.email)
    onOpenChange(false)
    toast.success(`Launched Live Simulation mode as ${selectedRole.toUpperCase()} (${selectedUser.name})!`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden font-sans border shadow-2xl rounded-2xl">
        <DialogHeader className="p-4 border-b bg-muted/20 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
                Enterprise Permission Simulator & Scope Inspector
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Simulate exact UI visibility, buttons, quick create options, and API endpoints for any role or user.
              </DialogDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 text-amber-500 uppercase">
            Azure AD / Salesforce Architecture
          </Badge>
        </DialogHeader>

        {/* Top Control Bar: Select Role, User, and Target Workspace */}
        <div className="p-4 bg-muted/40 border-b grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-foreground flex items-center gap-1">
              <Shield className="w-3 h-3 text-primary" /> Simulate Role
            </label>
            <Select value={selectedRole} onValueChange={(val) => val && setSelectedRole(val)}>
              <SelectTrigger className="h-8 text-xs bg-background">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner (Full Superadmin)</SelectItem>
                <SelectItem value="admin">Admin (Workspace Admin)</SelectItem>
                <SelectItem value="manager">Sales / Ops Manager</SelectItem>
                <SelectItem value="agent">Support / Sales Agent</SelectItem>
                <SelectItem value="client">Client Portal (External)</SelectItem>
                <SelectItem value="viewer">Viewer (Read-Only)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-foreground flex items-center gap-1">
              <User className="w-3 h-3 text-primary" /> Target User
            </label>
            <Select value={selectedUserId} onValueChange={(val) => val && setSelectedUserId(val)}>
              <SelectTrigger className="h-8 text-xs bg-background">
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                {SAMPLE_USERS.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name} ({u.defaultRole})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-foreground flex items-center gap-1">
              <Layers className="w-3 h-3 text-primary" /> Target Workspace
            </label>
            <Select value={selectedWorkspace} onValueChange={(val) => val && setSelectedWorkspace(val as WorkspaceId)}>
              <SelectTrigger className="h-8 text-xs bg-background">
                <SelectValue placeholder="Select Workspace" />
              </SelectTrigger>
              <SelectContent>
                {ENTERPRISE_WORKSPACES.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Interactive Simulation Inspection Body */}
        <div className="p-4 space-y-4 max-h-[460px] overflow-y-auto font-mono text-xs">
          {/* Summary Status Header */}
          <div className="p-3 rounded-xl border bg-card flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="font-bold text-foreground text-xs">
                Simulating: <strong className="text-primary">{selectedUser.name}</strong> as <Badge className="uppercase text-[9px] py-0 px-1">{selectedRole}</Badge>
              </span>
              <p className="text-[11px] text-muted-foreground font-sans">
                Inspecting active scope for workspace: <strong>{currentWorkspaceDef.name}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white text-[10px]">
                {grantedActions.length} Actions Active
              </Badge>
              <Badge variant="outline" className="border-destructive/40 text-destructive text-[10px]">
                {restrictedActions.length} Actions Restricted
              </Badge>
            </div>
          </div>

          {/* Grid of Simulation Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Panel 1: Visible Actions & Buttons */}
            <div className="p-3 rounded-xl border bg-emerald-500/5 border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs pb-1 border-b border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Visible Menu CTAs & Allowed Actions ({grantedActions.length})</span>
              </div>
              <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
                {grantedActions.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground italic">No actions permitted in this workspace.</p>
                ) : (
                  grantedActions.map((a) => (
                    <div key={a.key} className="flex items-center justify-between text-[11px] bg-background/80 p-1.5 rounded-lg border">
                      <span className="text-foreground truncate">{a.label}</span>
                      <code className="text-[9px] text-emerald-600 font-mono shrink-0 ml-1">ALLOWED</code>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Panel 2: Hidden / Restricted Actions */}
            <div className="p-3 rounded-xl border bg-destructive/5 border-destructive/20 space-y-2">
              <div className="flex items-center gap-1.5 text-destructive font-bold text-xs pb-1 border-b border-destructive/20">
                <XCircle className="w-3.5 h-3.5" />
                <span>Hidden Buttons & Restricted Operations ({restrictedActions.length})</span>
              </div>
              <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
                {restrictedActions.length === 0 ? (
                  <p className="text-[10px] text-emerald-600 font-sans font-semibold">User has unrestricted full access to this workspace.</p>
                ) : (
                  restrictedActions.map((a) => (
                    <div key={a.key} className="flex items-center justify-between text-[11px] bg-background/80 p-1.5 rounded-lg border">
                      <span className="text-muted-foreground truncate">{a.label}</span>
                      {a.isProtected ? (
                        <Badge variant="outline" className="text-[8px] border-amber-500/40 text-amber-600 shrink-0 ml-1">
                          🔒 PROTECTED
                        </Badge>
                      ) : (
                        <code className="text-[9px] text-destructive font-mono shrink-0 ml-1">HIDDEN</code>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Panel 3: Quick Create & Command Palette Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border bg-card space-y-2">
              <div className="flex items-center gap-1.5 text-primary font-bold text-xs pb-1 border-b">
                <Plus className="w-3.5 h-3.5" />
                <span>Universal "+ Create" Options for this Role</span>
              </div>
              <div className="space-y-1 text-[11px]">
                {visibleQuickCreates.map((qc) => (
                  <div key={qc.title} className="flex items-center justify-between py-0.5">
                    <span className="text-foreground">{qc.title}</span>
                    <Badge variant="outline" className="text-[8px] text-emerald-600 border-emerald-500/30">Visible in Menu</Badge>
                  </div>
                ))}
                {hiddenQuickCreates.map((qc) => (
                  <div key={qc.title} className="flex items-center justify-between py-0.5 opacity-50">
                    <span className="text-muted-foreground line-through">{qc.title}</span>
                    <Badge variant="outline" className="text-[8px] text-destructive border-destructive/30">Filtered Out</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-card space-y-2">
              <div className="flex items-center gap-1.5 text-primary font-bold text-xs pb-1 border-b">
                <Command className="w-3.5 h-3.5" />
                <span>Data Scoping & API Token Policy</span>
              </div>
              <div className="space-y-1.5 text-[11px] font-sans">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground font-mono">Data Visibility:</span>
                  <span className="font-bold text-foreground font-mono">
                    {selectedRole === 'owner' || selectedRole === 'admin' ? 'ALL_WORKSPACE_DATA (FULL)' : selectedRole === 'manager' ? 'DEPARTMENT_TEAM_ONLY' : 'ASSIGNED_LEADS_OWN_CHATS'}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground font-mono">API Key Issuance:</span>
                  <span className="font-bold text-foreground font-mono">
                    {isFullAdmin ? 'PERMITTED (ADMIN-TIER)' : 'RESTRICTED (403 FORBIDDEN)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-mono">Client Data Export:</span>
                  <span className="font-bold text-foreground font-mono">
                    {isFullAdmin ? 'ALLOW (GDPR ARCHIVE)' : 'BLOCKED (SECURITY GUARD)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-3 border-t bg-muted/20 flex flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-muted-foreground font-mono">
            Simulate live in the actual browser session with top amber banner.
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleLaunchLiveSimulation}
              className="h-8 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 gap-1.5 shadow-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" /> Launch Live Session Simulation
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
