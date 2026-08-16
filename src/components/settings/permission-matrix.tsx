'use client'

import { useState, useMemo, useEffect } from 'react'
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
  Search,
  Copy,
  RotateCcw,
  Layers,
  Briefcase,
  DollarSign,
  Bot,
  FileText,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Shield,
  HelpCircle,
  GitCompare,
  Clock,
  Key,
  ShieldX,
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight,
  Flame,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  ENTERPRISE_WORKSPACES,
  ALL_ACTION_KEYS,
  ROLE_PERMISSION_MAP,
  REUSABLE_PERMISSION_TEMPLATES,
  DEFAULT_ORG_POLICIES,
  OrgSecurityPolicy,
  PermissionLevel,
  DataScope,
  WorkspacePermissionGroup,
  FeatureDefinition,
  ActionDefinition,
  getInheritedPermissions,
  compareRoles,
  getSensitivePermissionReport,
} from '@/lib/security/permissions'
import { PermissionSimulatorModal } from '@/components/security/permission-simulator-modal'

export function PermissionMatrix() {
  const [selectedRole, setSelectedRole] = useState<string>('admin')
  const [selectedScope, setSelectedScope] = useState<DataScope>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [rolePermissions, setRolePermissions] = useState<Set<string>>(new Set())
  const [featureLevels, setFeatureLevels] = useState<Record<string, PermissionLevel>>({})
  const [orgPolicies, setOrgPolicies] = useState<OrgSecurityPolicy[]>(DEFAULT_ORG_POLICIES)

  // Workspace Accordion open states
  const [openWorkspaces, setOpenWorkspaces] = useState<Record<string, boolean>>({
    marketing: true,
    crm: true,
    sales: true,
    finance: true,
    ai: true,
  })

  // Modals
  const [simulatorOpen, setSimulatorOpen] = useState(false)
  const [templateOpen, setTemplateOpen] = useState(false)
  const [compareModalOpen, setCompareModalOpen] = useState(false)
  const [tempAccessModalOpen, setTempAccessModalOpen] = useState(false)
  const [sensitiveReportOpen, setSensitiveReportOpen] = useState(false)
  const [orgPolicyModalOpen, setOrgPolicyModalOpen] = useState(false)

  // Compare role state
  const [compareRoleA, setCompareRoleA] = useState('manager')
  const [compareRoleB, setCompareRoleB] = useState('agent')

  // Temporary Access state
  const [tempUser, setTempUser] = useState('Sunil Kumar (Agent)')
  const [tempPermission, setTempPermission] = useState('marketing:campaign_publish')
  const [tempDuration, setTempDuration] = useState('24')

  // Protected Action Confirmation Modal
  const [protectedConfirmAction, setProtectedConfirmAction] = useState<ActionDefinition | null>(null)

  // Load permissions when role changes
  useEffect(() => {
    const baseSet = ROLE_PERMISSION_MAP[selectedRole] || new Set()
    const isOwner = selectedRole === 'owner'

    if (isOwner) {
      setRolePermissions(new Set(['all', ...ALL_ACTION_KEYS]))
    } else {
      setRolePermissions(new Set(Array.from(baseSet)))
    }
  }, [selectedRole])

  // Toggle individual action permission
  const handleToggleAction = (action: ActionDefinition) => {
    if (selectedRole === 'owner') {
      toast.info('Owner role maintains unrestricted full access.')
      return
    }

    const isCurrentlyEnabled = rolePermissions.has('all') || rolePermissions.has(action.key)

    // If enabling a protected action, prompt confirmation
    if (!isCurrentlyEnabled && action.isProtected) {
      setProtectedConfirmAction(action)
      return
    }

    applyActionToggle(action.key, !isCurrentlyEnabled)
  }

  const applyActionToggle = (key: string, enable: boolean) => {
    const next = new Set(rolePermissions)
    if (enable) {
      next.add(key)
      toast.success(`Granted: ${key}`)
    } else {
      next.delete(key)
      next.delete('all')
      toast.info(`Revoked: ${key}`)
    }
    setRolePermissions(next)
  }

  // Handle 4-tier Feature Level change (None, Read, Write, Admin) with automatic cascading
  const handleSetFeatureLevel = (feature: FeatureDefinition, level: PermissionLevel) => {
    if (selectedRole === 'owner') {
      toast.info('Owner role cannot be restricted.')
      return
    }

    setFeatureLevels((prev) => ({ ...prev, [feature.id]: level }))

    const inheritedKeys = getInheritedPermissions(level, feature)
    const next = new Set(rolePermissions)

    // Remove all existing actions for this feature first
    feature.actions.forEach((a) => next.delete(a.key))

    // Add inherited keys
    inheritedKeys.forEach((k) => next.add(k))
    next.delete('all')

    setRolePermissions(next)
    toast.success(`Set ${feature.name} to ${level.toUpperCase()} access (${inheritedKeys.length} actions granted).`)
  }

  // Bulk Actions
  const handleSelectAll = () => {
    setRolePermissions(new Set(['all', ...ALL_ACTION_KEYS]))
    toast.success('Granted all permissions across all 11 workspaces.')
  }

  const handleClearAll = () => {
    if (selectedRole === 'owner') {
      toast.error('Cannot clear permissions for Owner role.')
      return
    }
    setRolePermissions(new Set())
    setFeatureLevels({})
    toast.info('Revoked all permissions.')
  }

  const handleSetReadOnlyAll = () => {
    const readOnlyKeys = ALL_ACTION_KEYS.filter((k) => k.includes('view') || k.includes('read'))
    setRolePermissions(new Set(readOnlyKeys))
    toast.success(`Applied READ-ONLY access (${readOnlyKeys.length} permissions active).`)
  }

  const handleGrantAdminAll = () => {
    setRolePermissions(new Set(['all', ...ALL_ACTION_KEYS]))
    toast.success('Granted full administrative rights across all features.')
  }

  const handleApplyTemplate = (tmpl: any) => {
    setRolePermissions(new Set(tmpl.permissions))
    setSelectedScope(tmpl.defaultScope)
    setTemplateOpen(false)
    toast.success(`Applied template "${tmpl.name}" with ${tmpl.permissions.length} preset permissions!`)
  }

  const handleGrantTemporaryAccess = () => {
    setTempAccessModalOpen(false)
    toast.success(`Temporary grant of "${tempPermission}" active for ${tempUser} (${tempDuration} hours). Auto-revoke scheduled.`)
  }

  const handleToggleOrgPolicy = (id: string) => {
    setOrgPolicies(orgPolicies.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)))
    toast.success('Organization security policy updated.')
  }

  const handleExportJson = () => {
    const data = {
      role: selectedRole,
      data_scope: selectedScope,
      permissions: Array.from(rolePermissions),
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wacrm_role_${selectedRole}_permissions.json`
    a.click()
    toast.success('Role permissions exported as JSON!')
  }

  // Filtered Workspaces by Search Query
  const filteredWorkspaces = useMemo(() => {
    if (!searchQuery.trim()) return ENTERPRISE_WORKSPACES

    const q = searchQuery.toLowerCase()
    return ENTERPRISE_WORKSPACES.map((w) => {
      const matchingFeatures = w.features.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.actions.some((a) => a.label.toLowerCase().includes(q) || a.key.toLowerCase().includes(q))
      )
      return {
        ...w,
        features: matchingFeatures,
      }
    }).filter((w) => w.features.length > 0 || w.name.toLowerCase().includes(q))
  }, [searchQuery])

  // Calculate Summary Statistics across all workspaces
  const workspaceStats = useMemo(() => {
    return ENTERPRISE_WORKSPACES.map((w) => {
      const totalInWs = w.features.flatMap((f) => f.actions).length
      const activeInWs = w.features
        .flatMap((f) => f.actions)
        .filter((a) => rolePermissions.has('all') || rolePermissions.has(a.key)).length
      return {
        id: w.id,
        name: w.name,
        total: totalInWs,
        active: activeInWs,
      }
    })
  }, [rolePermissions])

  const totalActivePerms = rolePermissions.has('all')
    ? ALL_ACTION_KEYS.length
    : Array.from(rolePermissions).filter((k) => k !== 'all').length

  // Role comparison computation
  const roleComparison = useMemo(() => {
    return compareRoles(compareRoleA, compareRoleB)
  }, [compareRoleA, compareRoleB])

  const sensitiveReport = useMemo(() => {
    return getSensitivePermissionReport()
  }, [])

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Header & Role Selector Bar */}
      <div className="p-4 rounded-xl border bg-card/60 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Enterprise PBAC & Security Policy Console
              </h3>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                Salesforce / Azure AD Standard
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Workspace Access → Feature Level (None/Read/Write/Admin) → Action Permissions & API Middleware Mapping.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => setSimulatorOpen(true)}
              className="h-8 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 gap-1.5 shadow-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" /> Simulate Experience
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCompareModalOpen(true)}
              className="h-8 text-xs gap-1 cursor-pointer"
            >
              <GitCompare className="w-3.5 h-3.5 text-primary" /> Compare Roles
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTempAccessModalOpen(true)}
              className="h-8 text-xs gap-1 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Temporary JIT Access
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSensitiveReportOpen(true)}
              className="h-8 text-xs gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-destructive" /> Protected Report
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOrgPolicyModalOpen(true)}
              className="h-8 text-xs gap-1 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-primary" /> Org Policies
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTemplateOpen(true)}
              className="h-8 text-xs gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Templates
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportJson}
              className="h-8 text-xs gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export JSON
            </Button>
          </div>
        </div>

        {/* Role Switcher & Data Scope */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Target Role:</span>
            {['admin', 'manager', 'agent', 'client', 'viewer'].map((r) => (
              <Button
                key={r}
                size="sm"
                variant={selectedRole === r ? 'default' : 'outline'}
                onClick={() => setSelectedRole(r)}
                className={`h-7 text-xs uppercase font-mono font-bold ${
                  selectedRole === r ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'
                }`}
              >
                {r}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Data Visibility Scope:</span>
            <Select value={selectedScope} onValueChange={(val) => val && setSelectedScope(val as DataScope)}>
              <SelectTrigger className="h-7 text-xs w-52 bg-background font-mono">
                <SelectValue placeholder="Scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ALL WORKSPACE DATA (FULL)</SelectItem>
                <SelectItem value="department">DEPARTMENT ONLY</SelectItem>
                <SelectItem value="team">TEAM / BRANCH ONLY</SelectItem>
                <SelectItem value="assigned">ASSIGNED LEADS & CHATS</SelectItem>
                <SelectItem value="own">OWN RECORDS ONLY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 2. Bulk Action Toolbar & Real-time Permission Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          <Input
            placeholder="Search permissions & API endpoints (e.g. campaign, invoice, prompt, ai, delete, pipeline)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-background rounded-xl"
          />
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <Button size="sm" variant="outline" onClick={handleSelectAll} className="h-8 text-[11px] gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Select All
          </Button>
          <Button size="sm" variant="outline" onClick={handleSetReadOnlyAll} className="h-8 text-[11px] gap-1">
            <Eye className="w-3 h-3 text-blue-500" /> Read Only
          </Button>
          <Button size="sm" variant="outline" onClick={handleGrantAdminAll} className="h-8 text-[11px] gap-1">
            <ShieldCheck className="w-3 h-3 text-primary" /> Grant Admin
          </Button>
          <Button size="sm" variant="ghost" onClick={handleClearAll} className="h-8 text-[11px] text-destructive hover:bg-destructive/10">
            Clear All
          </Button>
        </div>
      </div>

      {/* 3. 11 Workspaces Accordion & 4-Tier Feature Matrix */}
      <div className="space-y-3">
        {filteredWorkspaces.map((ws) => {
          const isOpen = openWorkspaces[ws.id] ?? false
          const stat = workspaceStats.find((s) => s.id === ws.id)

          return (
            <div key={ws.id} className="border rounded-xl bg-card overflow-hidden shadow-2xs">
              {/* Workspace Accordion Header */}
              <div
                onClick={() => setOpenWorkspaces((prev) => ({ ...prev, [ws.id]: !isOpen }))}
                className="p-3.5 bg-muted/20 hover:bg-muted/30 transition-all flex items-center justify-between cursor-pointer border-b"
              >
                <div className="flex items-center gap-2.5">
                  <div className="text-primary font-bold">{isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                      {ws.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground">{ws.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {stat ? `${stat.active} / ${stat.total}` : '0'} Active
                  </Badge>
                </div>
              </div>

              {/* Workspace Features & Actions Body */}
              {isOpen && (
                <div className="p-4 space-y-4 divide-y divide-border/60">
                  {ws.features.map((feat) => {
                    const currentLevel = featureLevels[feat.id] || 'admin'

                    return (
                      <div key={feat.id} className="pt-3.5 first:pt-0 space-y-3">
                        {/* Feature Level Bar: None / Read / Write / Admin */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-foreground">{feat.name}</span>
                            <p className="text-[11px] text-muted-foreground">{feat.description}</p>
                          </div>

                          {/* 4-Tier Permission Radio Level */}
                          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border shrink-0 text-[10px] font-mono">
                            {(['none', 'read', 'write', 'admin'] as PermissionLevel[]).map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => handleSetFeatureLevel(feat, lvl)}
                                className={`px-2.5 py-1 rounded-md transition-all uppercase font-bold cursor-pointer ${
                                  currentLevel === lvl
                                    ? lvl === 'admin'
                                      ? 'bg-primary text-primary-foreground shadow-xs'
                                      : lvl === 'write'
                                      ? 'bg-emerald-600 text-white'
                                      : lvl === 'read'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-muted text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Granular Action Checkbox Grid with API Route Badges */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {feat.actions.map((act) => {
                            const isChecked = rolePermissions.has('all') || rolePermissions.has(act.key)

                            return (
                              <div
                                key={act.key}
                                onClick={() => handleToggleAction(act)}
                                className={`p-2.5 rounded-lg border transition-all flex items-start gap-2.5 cursor-pointer select-none ${
                                  isChecked
                                    ? 'bg-primary/5 border-primary/40 text-foreground'
                                    : 'bg-muted/10 border-border/60 text-muted-foreground hover:bg-muted/20'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                    isChecked
                                      ? 'bg-primary border-primary text-primary-foreground'
                                      : 'border-muted-foreground/40 bg-background'
                                  }`}
                                >
                                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </div>

                                <div className="space-y-1 min-w-0 w-full">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span className="font-semibold text-xs truncate">{act.label}</span>
                                    {act.isProtected && (
                                      <Badge variant="outline" className="text-[8px] py-0 px-1 border-amber-500/40 text-amber-600 font-mono shrink-0">
                                        🔒 PROTECTED
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between text-[9px] text-muted-foreground font-mono">
                                    <code className="truncate max-w-[140px]">{act.key}</code>
                                    {act.apiEndpoint && (
                                      <span className="text-[8px] bg-muted px-1.5 py-0.5 rounded border">
                                        {act.apiEndpoint.method} {act.apiEndpoint.path}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 4. Enterprise Permission Summary & Workspace Breakdown Roster */}
      <div className="p-4 rounded-xl border bg-card shadow-xs space-y-3 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase text-foreground">
              Active Role Permission Breakdown ({selectedRole.toUpperCase()})
            </span>
          </div>
          <Badge className="bg-primary text-primary-foreground font-bold text-xs">
            {totalActivePerms} / {ALL_ACTION_KEYS.length} Total Permissions
          </Badge>
        </div>

        {/* 11 Workspaces Progress Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-[11px]">
          {workspaceStats.map((st) => (
            <div key={st.id} className="p-2 rounded-lg border bg-muted/20 space-y-1">
              <span className="text-[10px] text-muted-foreground font-bold truncate block">{st.name}</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">
                  {st.active} / {st.total}
                </span>
                <span className="text-[9px] text-primary">
                  {Math.round((st.active / (st.total || 1)) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compare Roles Modal */}
      <Dialog open={compareModalOpen} onOpenChange={setCompareModalOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden font-sans border shadow-xl">
          <DialogHeader className="p-4 border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-primary" />
              <DialogTitle className="text-sm font-bold">Side-by-Side Role Comparator</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Compare capability differences between two roles across all 11 workspaces.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-4 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Role A:</label>
                <Select value={compareRoleA} onValueChange={(val) => val && setCompareRoleA(val)}>
                  <SelectTrigger className="h-8 text-xs font-bold uppercase"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['owner', 'admin', 'manager', 'agent', 'client', 'viewer'].map((r) => (
                      <SelectItem key={r} value={r}>{r.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground">Role B:</label>
                <Select value={compareRoleB} onValueChange={(val) => val && setCompareRoleB(val)}>
                  <SelectTrigger className="h-8 text-xs font-bold uppercase"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['owner', 'admin', 'manager', 'agent', 'client', 'viewer'].map((r) => (
                      <SelectItem key={r} value={r}>{r.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border text-xs">
              <span>Overall Delta:</span>
              <span className="font-bold text-primary">
                {compareRoleA.toUpperCase()} has {roleComparison.totalA} perms ({roleComparison.totalDiff > 0 ? `+${roleComparison.totalDiff}` : roleComparison.totalDiff} compared to {compareRoleB.toUpperCase()})
              </span>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {roleComparison.breakdown.map((row) => (
                <div key={row.workspaceId} className="flex items-center justify-between p-2 rounded-md border text-[11px]">
                  <span className="font-semibold text-foreground">{row.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{row.countA} vs {row.countB}</span>
                    <Badge variant="outline" className={`font-mono text-[9px] ${row.diff > 0 ? 'text-emerald-600 border-emerald-500/30' : row.diff < 0 ? 'text-destructive border-destructive/30' : 'text-muted-foreground'}`}>
                      {row.diffFormatted}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Temporary JIT Access Modal */}
      <Dialog open={tempAccessModalOpen} onOpenChange={setTempAccessModalOpen}>
        <DialogContent className="max-w-md p-0 gap-0 overflow-hidden font-sans border shadow-xl">
          <DialogHeader className="p-4 border-b bg-amber-500/10">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <DialogTitle className="text-sm font-bold">Grant Temporary Time-Bound Permission</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-amber-700 dark:text-amber-400">
              Grant elevated privileges for a limited time window with automatic expiration.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-3.5 text-xs font-sans">
            <div className="space-y-1">
              <label className="font-semibold">Target User</label>
              <Input value={tempUser} onChange={(e) => setTempUser(e.target.value)} className="h-8 text-xs" />
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Permission to Elevate</label>
              <Select value={tempPermission} onValueChange={(val) => val && setTempPermission(val)}>
                <SelectTrigger className="h-8 text-xs font-mono"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing:campaign_publish">marketing:campaign_publish (Publish Live Ads)</SelectItem>
                  <SelectItem value="finance:invoice_create">finance:invoice_create (Generate GST Invoices)</SelectItem>
                  <SelectItem value="deals:close_won">deals:close_won (Close Won High-Value Deals)</SelectItem>
                  <SelectItem value="ai:prompt_edit">ai:prompt_edit (Modify System Prompts)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Auto-Revoke Duration</label>
              <Select value={tempDuration} onValueChange={(val) => val && setTempDuration(val)}>
                <SelectTrigger className="h-8 text-xs font-mono"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Hour (Quick Escalation)</SelectItem>
                  <SelectItem value="24">24 Hours (Standard Shift)</SelectItem>
                  <SelectItem value="72">3 Days (Weekend Coverage)</SelectItem>
                  <SelectItem value="168">7 Days (Audit Window)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="p-3 border-t bg-muted/20 flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setTempAccessModalOpen(false)} className="h-8 text-xs">Cancel</Button>
            <Button size="sm" onClick={handleGrantTemporaryAccess} className="h-8 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 gap-1">
              <Clock className="w-3.5 h-3.5" /> Grant & Start Timer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sensitive Permission Audit Report Modal */}
      <Dialog open={sensitiveReportOpen} onOpenChange={setSensitiveReportOpen}>
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden font-sans border shadow-xl">
          <DialogHeader className="p-4 border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-destructive" />
              <DialogTitle className="text-sm font-bold">Protected Sensitive Action Audit Report</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Surfaces high-risk capabilities (deletion, publishing, API secrets) across roles.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-3 font-mono text-xs">
            {sensitiveReport.map((row) => (
              <div key={row.role} className="p-3 rounded-lg border bg-muted/20 flex items-center justify-between">
                <div>
                  <span className="font-bold uppercase text-foreground text-xs">{row.role}</span>
                  <p className="text-[10px] text-muted-foreground font-sans">
                    {row.protectedCount === 0 ? 'Zero dangerous operations permitted' : `${row.protectedCount} of ${row.totalProtected} protected actions`}
                  </p>
                </div>
                <Badge className={row.protectedCount > 5 ? 'bg-destructive text-white' : row.protectedCount > 0 ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'}>
                  {row.protectedCount} Protected
                </Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Organization Security Policy Control Modal */}
      <Dialog open={orgPolicyModalOpen} onOpenChange={setOrgPolicyModalOpen}>
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden font-sans border shadow-xl">
          <DialogHeader className="p-4 border-b bg-muted/20">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              <DialogTitle className="text-sm font-bold">Organization-Wide Security Policy Layer</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Top-level security policies that override role permissions for statutory compliance.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-3 text-xs">
            {orgPolicies.map((pol) => (
              <div key={pol.id} className="p-3 rounded-xl border bg-card flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground text-xs">{pol.title}</span>
                  <p className="text-[11px] text-muted-foreground">{pol.description}</p>
                </div>
                <Button
                  size="sm"
                  variant={pol.enabled ? 'default' : 'outline'}
                  onClick={() => handleToggleOrgPolicy(pol.id)}
                  className={`h-7 text-xs font-mono ${pol.enabled ? 'bg-emerald-600 text-white' : 'text-muted-foreground'}`}
                >
                  {pol.enabled ? 'ENFORCED' : 'DISABLED'}
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Templates Modal */}
      <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden font-sans">
          <DialogHeader className="p-4 border-b bg-muted/20">
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> 8 Standard Reusable Permission Templates
            </DialogTitle>
            <DialogDescription className="text-xs">
              Select an industry template to apply preset permissions & scopes (Sales, Marketing, Finance, Support).
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
            {REUSABLE_PERMISSION_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleApplyTemplate(tmpl)}
                className="p-3 rounded-xl border hover:border-primary/50 hover:bg-muted/30 transition-all space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground">{tmpl.name}</span>
                  <Badge variant="outline" className="text-[9px] uppercase font-mono">{tmpl.defaultScope}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{tmpl.description}</p>
                <div className="text-[10px] text-primary font-mono font-semibold pt-1 border-t">
                  {tmpl.permissions.length} Pre-configured Permissions →
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Permission Simulator Modal */}
      <PermissionSimulatorModal
        open={simulatorOpen}
        onOpenChange={setSimulatorOpen}
        initialRole={selectedRole}
      />
    </div>
  )
}
