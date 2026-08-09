"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Loader2,
  ChevronLeft,
  Save,
  Plus,
  Trash2,
  Clock,
  MessageSquare,
  Users,
  Search,
  Tag,
  CheckSquare,
  Square,
  Filter,
  Power,
  Play,
  PauseCircle,
  PlayCircle,
  UserMinus,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Eye,
  TrendingUp,
  CheckCheck,
  Activity,
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SequenceBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const sequenceId = resolvedParams.id
  const router = useRouter()
  const supabase = createClient()

  const [sequence, setSequence] = useState<any>(null)
  const [steps, setSteps] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [enrollOpen, setEnrollOpen] = useState(false)
  const [enrollMode, setEnrollMode] = useState<'search' | 'tag'>('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])
  const [selectedTableEnrollmentIds, setSelectedTableEnrollmentIds] = useState<string[]>([])
  const [auditEnrollment, setAuditEnrollment] = useState<any | null>(null)
  const [enrolling, setEnrolling] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: userRes } = await supabase.auth.getUser()
      if (!userRes?.user) {
        window.location.href = '/login'
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('account_id')
        .eq('user_id', userRes.user.id)
        .single()

      if (!profile?.account_id) {
        toast.error('Workspace account not found')
        router.push('/sequences')
        return
      }

      const accountId = profile.account_id

      const [seqRes, stepsRes, enrollmentsRes, tplRes, msgTplRes, contactsRes] = await Promise.all([
        supabase.from('sequences').select('*').eq('id', sequenceId).eq('account_id', accountId).single(),
        supabase.from('sequence_steps').select('*').eq('sequence_id', sequenceId).order('position', { ascending: true }),
        supabase.from('sequence_enrollments').select('*, contact:contacts(name, phone)').eq('sequence_id', sequenceId).order('created_at', { ascending: false }),
        supabase.from('whatsapp_templates').select('name, language, status').eq('account_id', accountId).or('status.eq.APPROVED,status.eq.approved'),
        supabase.from('message_templates').select('name, language, status').eq('account_id', accountId).or('status.eq.APPROVED,status.eq.approved'),
        supabase.from('contacts').select('id, name, phone, email').eq('account_id', accountId).order('created_at', { ascending: false }).limit(200),
      ])

      if (seqRes.error || !seqRes.data) {
        toast.error('Unauthorized access: Sequence not found in your workspace')
        router.push('/sequences')
        return
      }

      const combinedTemplates = [...(tplRes.data || []), ...(msgTplRes.data || [])]
      const uniqueTemplates = Array.from(new Map(combinedTemplates.map(t => [t.name, t])).values())

      setSequence(seqRes.data)
      setSteps(stepsRes.data || [])
      setEnrollments(enrollmentsRes.data || [])
      setContacts(contactsRes.data || [])
      setTemplates(uniqueTemplates)
      setLoading(false)
    }

    if (sequenceId) load()
  }, [sequenceId, router, supabase])

  // Helper to extract normalized array of tags from contact object
  const getContactTags = (c: any): string[] => {
    if (!c || !c.tags) return []
    if (Array.isArray(c.tags)) return c.tags
    if (typeof c.tags === 'string') {
      try {
        const parsed = JSON.parse(c.tags)
        if (Array.isArray(parsed)) return parsed
      } catch (e) {}
      return c.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    }
    return []
  }

  // Extract all unique tags across contacts
  const allTags = Array.from(
    new Set(contacts.flatMap(c => getContactTags(c)))
  )

  // Filter contacts by search query
  const filteredContacts = contacts.filter(c => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true
    const nameMatch = c.name?.toLowerCase().includes(query)
    const phoneMatch = c.phone?.includes(query)
    const emailMatch = c.email?.toLowerCase().includes(query)
    const tagMatch = getContactTags(c).some((t: string) => t.toLowerCase().includes(query))
    return nameMatch || phoneMatch || emailMatch || tagMatch
  })

  // Contacts matching any of the selected tags
  const taggedContacts = selectedTags.length > 0
    ? contacts.filter(c => getContactTags(c).some((t: string) => selectedTags.includes(t)))
    : []

  async function handleBulkEnroll() {
    let targetIds: string[] = []

    if (enrollMode === 'search') {
      targetIds = selectedContactIds
    } else {
      targetIds = taggedContacts.map(c => c.id)
    }

    if (targetIds.length === 0) {
      toast.error('Please select at least one contact or tag.')
      return
    }

    setEnrolling(true)

    const selectedContactsList = contacts.filter(c => targetIds.includes(c.id))

    try {
      const res = await fetch('/api/sequences/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sequenceId,
          contactIds: targetIds,
          contactsData: selectedContactsList,
        }),
      })

      const json = await res.json()
      setEnrolling(false)

      if (!res.ok || json.error) {
        toast.error(`Enrollment error: ${json.error || 'Failed to enroll contacts'}`)
        return
      }

      toast.success(`Successfully enrolled ${targetIds.length} contact(s) into sequence!`)

      // Refresh enrollments list
      const { data: updatedEnrollments } = await supabase
        .from('sequence_enrollments')
        .select('*, contact:contacts(name, phone)')
        .eq('sequence_id', sequenceId)
        .order('created_at', { ascending: false })

      if (updatedEnrollments) setEnrollments(updatedEnrollments)

      setEnrollOpen(false)
      setSelectedContactIds([])
      setSelectedTags([])
    } catch (err: any) {
      setEnrolling(false)
      toast.error(`Enrollment error: ${err.message || 'Network error'}`)
    }
  }

  async function toggleSequenceActive() {
    if (!sequence) return
    const nextState = !sequence.is_active
    setSequence({ ...sequence, is_active: nextState })
    const { error } = await supabase.from('sequences').update({ is_active: nextState }).eq('id', sequenceId)
    if (error) {
      toast.error('Failed to update sequence status')
      setSequence({ ...sequence, is_active: !nextState })
      return
    }
    toast.success(nextState ? 'Sequence Activated' : 'Sequence Deactivated / Paused')
  }

  async function handleEnrollmentStatus(ids: string[], newStatus: string) {
    if (ids.length === 0) return
    const { error } = await supabase
      .from('sequence_enrollments')
      .update({ status: newStatus })
      .in('id', ids)

    if (error) {
      toast.error(`Failed to update status: ${error.message}`)
      return
    }

    toast.success(`Updated ${ids.length} enrollment(s) to ${newStatus}`)
    setEnrollments(prev => prev.map(e => ids.includes(e.id) ? { ...e, status: newStatus } : e))
    setSelectedTableEnrollmentIds([])
  }

  async function handleUnenroll(ids: string[]) {
    if (ids.length === 0) return
    const { error } = await supabase
      .from('sequence_enrollments')
      .delete()
      .in('id', ids)

    if (error) {
      toast.error(`Failed to unenroll: ${error.message}`)
      return
    }

    toast.success(`Unenrolled ${ids.length} contact(s)`)
    setEnrollments(prev => prev.filter(e => !ids.includes(e.id)))
    setSelectedTableEnrollmentIds([])
  }

  async function handleSave() {
    setSaving(true)
    
    // 1. Update Sequence
    const { error: seqErr } = await supabase
      .from('sequences')
      .update({
        name: sequence.name,
        is_active: sequence.is_active ?? true,
        timezone: sequence.timezone,
        send_window_start: sequence.send_window_start || null,
        send_window_end: sequence.send_window_end || null,
      })
      .eq('id', sequenceId)

    if (seqErr) {
      toast.error('Failed to save sequence details')
      setSaving(false)
      return
    }

    // 2. Update Steps
    // For simplicity, delete all steps and recreate them
    await supabase.from('sequence_steps').delete().eq('sequence_id', sequenceId)
    
    if (steps.length > 0) {
      const stepsToInsert = steps.map((s, idx) => ({
        sequence_id: sequenceId,
        position: idx + 1,
        delay_days: s.delay_days || 0,
        delay_hours: s.delay_hours || 0,
        delay_minutes: s.delay_minutes || 0,
        template_name: s.template_name,
        template_language: s.template_language || 'en_US'
      }))

      const { error: stepsErr } = await supabase.from('sequence_steps').insert(stepsToInsert)
      if (stepsErr) {
        toast.error('Failed to save steps')
        setSaving(false)
        return
      }
    }

    toast.success('Sequence saved successfully')
    setSaving(false)
  }

  function addStep() {
    setSteps([...steps, { delay_days: 1, delay_hours: 0, delay_minutes: 0, template_name: '' }])
  }

  function removeStep(index: number) {
    setSteps(steps.filter((_, i) => i !== index))
  }

  function updateStep(index: number, field: string, value: any) {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    if (field === 'template_name') {
      const tpl = templates.find(t => t.name === value)
      if (tpl) newSteps[index].template_language = tpl.language
    }
    setSteps(newSteps)
  }

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon-sm" onClick={() => router.push('/sequences')}>
            <ChevronLeft className="size-4" />
          </Button>
          <div className="font-semibold text-foreground">{sequence?.name || 'Sequence Builder'}</div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSequenceActive}
            className={cn(
              "gap-2 font-medium border text-xs transition-all",
              sequence?.is_active !== false
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20"
            )}
          >
            <Power className="size-3.5" />
            {sequence?.is_active !== false ? 'Sequence Active' : 'Deactivated / Paused'}
          </Button>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
            Save Sequence
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Sequence KPI Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border bg-card p-4 space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                <span>Total Enrolled</span>
                <Users className="size-4 text-primary" />
              </div>
              <div className="text-2xl font-extrabold text-foreground">{enrollments.length}</div>
              <p className="text-[11px] text-muted-foreground">Total contacts assigned</p>
            </div>

            <div className="rounded-xl border bg-card p-4 space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                <span>Active Drip</span>
                <Activity className="size-4 text-emerald-500 animate-pulse" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-600">
                {enrollments.filter(e => e.status === 'active').length}
              </div>
              <p className="text-[11px] text-emerald-600/80 font-medium">Currently running</p>
            </div>

            <div className="rounded-xl border bg-card p-4 space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                <span>Completed</span>
                <CheckCircle2 className="size-4 text-blue-500" />
              </div>
              <div className="text-2xl font-extrabold text-blue-600">
                {enrollments.filter(e => e.status === 'completed').length}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {enrollments.length > 0 ? Math.round((enrollments.filter(e => e.status === 'completed').length / enrollments.length) * 100) : 0}% finish rate
              </p>
            </div>

            <div className="rounded-xl border bg-card p-4 space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                <span>Deactivated / Paused</span>
                <PauseCircle className="size-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-amber-600">
                {enrollments.filter(e => e.status === 'cancelled_by_reply' || e.status === 'failed').length}
              </div>
              <p className="text-[11px] text-muted-foreground">Opted out or paused</p>
            </div>
          </div>

          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="builder">Builder ({steps.length} Steps)</TabsTrigger>
              <TabsTrigger value="enrollments">Enrolled Contacts ({enrollments.length})</TabsTrigger>
              <TabsTrigger value="history">Delivery History ({enrollments.length})</TabsTrigger>
            </TabsList>

          <TabsContent value="builder" className="space-y-8">
            {/* Sequence Settings */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-medium">Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Sequence Name</Label>
                  <Input 
                    value={sequence?.name || ''} 
                    onChange={e => setSequence({...sequence, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={sequence?.timezone || 'UTC'} onValueChange={v => setSequence({...sequence, timezone: v})}>
                    <SelectTrigger><SelectValue placeholder="Select timezone..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Send Window Start</Label>
                  <Input 
                    type="time" 
                    value={sequence?.send_window_start || ''} 
                    onChange={e => setSequence({...sequence, send_window_start: e.target.value})} 
                  />
                  <p className="text-xs text-muted-foreground">Leave empty for 24/7 sending</p>
                </div>
                <div className="space-y-2">
                  <Label>Send Window End</Label>
                  <Input 
                    type="time" 
                    value={sequence?.send_window_end || ''} 
                    onChange={e => setSequence({...sequence, send_window_end: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            {/* Sequence Steps */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Clock className="size-4" /> Steps
              </h3>
              
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 relative">
                  {/* Timeline line */}
                  {index !== steps.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-[-16px] w-px bg-border z-0" />
                  )}
                  
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-muted z-10 text-muted-foreground font-medium">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 rounded-xl border border-border bg-card p-4 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Step {index + 1}</h4>
                      <Button variant="ghost" size="icon-sm" className="text-destructive hover:bg-destructive/10" onClick={() => removeStep(index)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Wait before sending</Label>
                        <div className="flex gap-2">
                          <Input 
                            type="number" 
                            min="0" 
                            className="w-20" 
                            value={step.delay_days} 
                            onChange={e => updateStep(index, 'delay_days', parseInt(e.target.value) || 0)} 
                          />
                          <span className="flex items-center text-sm text-muted-foreground">Days</span>
                          
                          <Input 
                            type="number" 
                            min="0" 
                            max="23"
                            className="w-20" 
                            value={step.delay_hours} 
                            onChange={e => updateStep(index, 'delay_hours', parseInt(e.target.value) || 0)} 
                          />
                          <span className="flex items-center text-sm text-muted-foreground">Hrs</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Template to Send</Label>
                        <Select value={step.template_name || ''} onValueChange={v => updateStep(index, 'template_name', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template..." />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map(t => (
                              <SelectItem key={t.name} value={t.name}>{t.name} ({t.language})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full border-dashed py-8 text-muted-foreground hover:bg-muted" onClick={addStep}>
                <Plus className="size-4 mr-2" />
                Add Step
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Manage and track active contact drip sequences.</p>
              <div className="flex gap-2">
                {selectedTableEnrollmentIds.length > 0 && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEnrollmentStatus(selectedTableEnrollmentIds, 'cancelled_by_reply')}
                      className="gap-1.5 text-xs text-amber-600 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10"
                    >
                      <PauseCircle className="size-3.5" /> Deactivate ({selectedTableEnrollmentIds.length})
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEnrollmentStatus(selectedTableEnrollmentIds, 'active')}
                      className="gap-1.5 text-xs text-emerald-600 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
                    >
                      <PlayCircle className="size-3.5" /> Activate ({selectedTableEnrollmentIds.length})
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleUnenroll(selectedTableEnrollmentIds)}
                      className="gap-1.5 text-xs"
                    >
                      <Trash2 className="size-3.5" /> Unenroll ({selectedTableEnrollmentIds.length})
                    </Button>
                  </>
                )}
                <Button size="sm" onClick={() => setEnrollOpen(true)} className="gap-2">
                  <Plus className="size-4" /> Enroll Contact
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        checked={enrollments.length > 0 && selectedTableEnrollmentIds.length === enrollments.length}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedTableEnrollmentIds(enrollments.map(e => e.id))
                          } else {
                            setSelectedTableEnrollmentIds([])
                          }
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary size-4 cursor-pointer"
                      />
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Current Step</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        <Users className="size-8 mx-auto mb-2 opacity-20" />
                        No contacts enrolled yet. Click "Enroll Contact" above to add someone.
                      </TableCell>
                    </TableRow>
                  ) : (
                    enrollments.map(e => {
                      const isRowSelected = selectedTableEnrollmentIds.includes(e.id)
                      return (
                        <TableRow key={e.id} className={cn(isRowSelected && "bg-primary/5")}>
                          <TableCell className="w-10">
                            <input
                              type="checkbox"
                              checked={isRowSelected}
                              onChange={evt => {
                                if (evt.target.checked) {
                                  setSelectedTableEnrollmentIds(prev => [...prev, e.id])
                                } else {
                                  setSelectedTableEnrollmentIds(prev => prev.filter(id => id !== e.id))
                                }
                              }}
                              className="rounded border-gray-300 text-primary focus:ring-primary size-4 cursor-pointer"
                            />
                          </TableCell>
                          <TableCell className="cursor-pointer hover:bg-muted/50" onClick={() => setAuditEnrollment(e)}>
                            <div className="font-semibold text-primary hover:underline flex items-center gap-1.5">
                              {e.contact?.name || 'Unknown Contact'}
                              <Eye className="size-3 text-muted-foreground opacity-60" />
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">{e.contact?.phone}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs font-semibold">
                              Step {e.current_step}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                              e.status === 'active' && "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
                              e.status === 'completed' && "bg-blue-500/10 text-blue-600 border border-blue-500/20",
                              e.status === 'cancelled_by_reply' && "bg-amber-500/10 text-amber-600 border border-amber-500/20",
                              e.status === 'failed' && "bg-red-500/10 text-red-600 border border-red-500/20",
                            )}>
                              {e.status === 'cancelled_by_reply' ? 'Deactivated' : e.status.replace(/_/g, ' ')}
                            </span>
                            {e.error_message && (
                              <p className="text-xs text-red-500 mt-1 max-w-[200px] truncate" title={e.error_message}>
                                {e.error_message}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono">
                            {e.status === 'active' ? new Date(e.next_run_at).toLocaleString() : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setAuditEnrollment(e)}
                                title="View Deep-Dive Contact Audit"
                                className="h-8 px-2 text-xs text-primary gap-1"
                              >
                                <Eye className="size-3.5" /> Audit
                              </Button>
                              {e.status === 'active' ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEnrollmentStatus([e.id], 'cancelled_by_reply')}
                                  title="Deactivate / Pause Contact"
                                  className="h-8 px-2 text-amber-600 hover:bg-amber-500/10 text-xs gap-1"
                                >
                                  <PauseCircle className="size-3.5" /> Deactivate
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEnrollmentStatus([e.id], 'active')}
                                  title="Re-activate Sequence"
                                  className="h-8 px-2 text-emerald-600 hover:bg-emerald-500/10 text-xs gap-1"
                                >
                                  <PlayCircle className="size-3.5" /> Activate
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleUnenroll([e.id])}
                                title="Unenroll Contact"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* TAB 3: MESSAGE DELIVERY LOGS HISTORY */}
          <TabsContent value="history" className="space-y-4">
            <div className="p-4 rounded-xl border bg-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Sequence Message Delivery Timeline</h4>
                  <p className="text-xs text-muted-foreground">Click any contact to view their full step-by-step audit log.</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {enrollments.length} Total Enrolled
                </Badge>
              </div>

              <div className="divide-y border rounded-xl bg-background overflow-hidden">
                {enrollments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">
                    No message history available yet.
                  </div>
                ) : (
                  enrollments.map(e => (
                    <div
                      key={e.id}
                      onClick={() => setAuditEnrollment(e)}
                      className="p-4 flex items-center justify-between hover:bg-muted/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "size-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                          e.status === 'completed' && "bg-emerald-500/10 text-emerald-600",
                          e.status === 'active' && "bg-blue-500/10 text-blue-600",
                          e.status === 'cancelled_by_reply' && "bg-amber-500/10 text-amber-600",
                          e.status === 'failed' && "bg-red-500/10 text-red-600"
                        )}>
                          Step {e.current_step}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                            {e.contact?.name || 'Contact'} ({e.contact?.phone})
                            <Eye className="size-3 text-muted-foreground" />
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Enrolled on {new Date(e.created_at || Date.now()).toLocaleDateString()} • Status: <span className="font-medium text-foreground">{e.status}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div>
                          <span className={cn(
                            "inline-flex items-center gap-1 text-xs font-medium rounded-md px-2 py-1",
                            e.status === 'completed' && "bg-emerald-500/10 text-emerald-600",
                            e.status === 'active' && "bg-blue-500/10 text-blue-600",
                            e.status === 'cancelled_by_reply' && "bg-amber-500/10 text-amber-600"
                          )}>
                            {e.status === 'completed' ? '✓ Delivered & Completed' : e.status === 'active' ? '⏳ Scheduled' : '⏸️ Deactivated'}
                          </span>
                          <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                            Last Updated: {new Date(e.updated_at || Date.now()).toLocaleTimeString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs gap-1">
                          <Eye className="size-3.5" /> View Audit
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Enterprise Enroll Contact & Segment Dialog */}
      <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Users className="size-5 text-primary" />
              Enroll Contacts into Sequence
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Enrollment Mode Tabs */}
            <div className="flex rounded-lg bg-muted p-1 gap-1">
              <button
                type="button"
                onClick={() => setEnrollMode('search')}
                className={cn(
                  "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5",
                  enrollMode === 'search' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Search className="size-3.5" /> Search & Select ({selectedContactIds.length})
              </button>
              <button
                type="button"
                onClick={() => setEnrollMode('tag')}
                className={cn(
                  "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5",
                  enrollMode === 'tag' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Tag className="size-3.5" /> Bulk Enroll by Tag
              </button>
            </div>

            {/* MODE 1: SEARCH & MULTI-SELECT */}
            {enrollMode === 'search' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, phone, email, or tag..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>

                <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
                  <span>{filteredContacts.length} contacts found</span>
                  {filteredContacts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedContactIds.length === filteredContacts.length) {
                          setSelectedContactIds([])
                        } else {
                          setSelectedContactIds(filteredContacts.map(c => c.id))
                        }
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      {selectedContactIds.length === filteredContacts.length ? "Deselect All" : "Select All Filtered"}
                    </button>
                  )}
                </div>

                <div className="max-h-[260px] overflow-y-auto border rounded-xl divide-y bg-card">
                  {filteredContacts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      No matching contacts found.
                    </div>
                  ) : (
                    filteredContacts.map(c => {
                      const isSelected = selectedContactIds.includes(c.id)
                      const tagsList = getContactTags(c)
                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedContactIds(prev => prev.filter(id => id !== c.id))
                            } else {
                              setSelectedContactIds(prev => [...prev, c.id])
                            }
                          }}
                          className={cn(
                            "p-3 flex items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors",
                            isSelected && "bg-primary/5"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {isSelected ? (
                              <CheckSquare className="size-4 text-primary shrink-0" />
                            ) : (
                              <Square className="size-4 text-muted-foreground shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-foreground truncate">{c.name || 'Unnamed Contact'}</p>
                              <p className="text-xs text-muted-foreground font-mono">{c.phone || c.email || 'No phone'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            {tagsList.map((t: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0 bg-muted">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}

            {/* MODE 2: MULTI-TAG SELECTION */}
            {enrollMode === 'tag' && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Select one or multiple contact tags to enroll all matching contacts:</p>
                <div className="max-h-[220px] overflow-y-auto border rounded-xl divide-y bg-card">
                  {allTags.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      No tags found in contacts.
                    </div>
                  ) : (
                    allTags.map(tag => {
                      const isTagSelected = selectedTags.includes(tag)
                      const count = contacts.filter(c => getContactTags(c).includes(tag)).length
                      return (
                        <div
                          key={tag}
                          onClick={() => {
                            if (isTagSelected) {
                              setSelectedTags(prev => prev.filter(t => t !== tag))
                            } else {
                              setSelectedTags(prev => [...prev, tag])
                            }
                          }}
                          className={cn(
                            "p-3 flex items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors",
                            isTagSelected && "bg-primary/5 font-semibold"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {isTagSelected ? (
                              <CheckSquare className="size-4 text-primary shrink-0" />
                            ) : (
                              <Square className="size-4 text-muted-foreground shrink-0" />
                            )}
                            <span className="text-sm font-medium text-foreground">🏷️ {tag}</span>
                          </div>
                          <Badge variant="outline" className="text-xs font-mono">
                            {count} contact(s)
                          </Badge>
                        </div>
                      )
                    })
                  )}
                </div>

                {selectedTags.length > 0 && (
                  <div className="p-3 rounded-xl border bg-primary/5 border-primary/20 text-xs space-y-1">
                    <p className="font-semibold text-primary">Tag Segment Summary</p>
                    <p className="text-muted-foreground">
                      Selected <strong className="text-foreground">{selectedTags.length} tag(s)</strong> matching <strong className="text-foreground">{taggedContacts.length} unique contacts</strong>.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-xs text-muted-foreground font-medium">
                {enrollMode === 'search'
                  ? `${selectedContactIds.length} contact(s) selected`
                  : `${taggedContacts.length} contact(s) matching selected tags`}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEnrollOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleBulkEnroll}
                  disabled={
                    enrolling ||
                    (enrollMode === 'search' && selectedContactIds.length === 0) ||
                    (enrollMode === 'tag' && selectedTags.length === 0)
                  }
                  className="gap-2"
                >
                  {enrolling && <Loader2 className="size-4 animate-spin" />}
                  {enrollMode === 'search'
                    ? `Enroll ${selectedContactIds.length || ''} Selected`
                    : `Enroll ${taggedContacts.length || ''} Tagged`}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Deep-Dive Audit & Execution Modal */}
      <Dialog open={auditEnrollment !== null} onOpenChange={(open) => !open && setAuditEnrollment(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Eye className="size-5 text-primary" />
              Contact Audit & Drip History
            </DialogTitle>
          </DialogHeader>

          {auditEnrollment && (
            <div className="space-y-6 py-2">
              {/* Contact Profile Header */}
              <div className="p-4 rounded-xl border bg-muted/40 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-foreground">{auditEnrollment.contact?.name || 'Contact'}</h4>
                  <p className="text-xs text-muted-foreground font-mono">{auditEnrollment.contact?.phone || 'No phone'}</p>
                  {auditEnrollment.contact?.email && (
                    <p className="text-xs text-muted-foreground">{auditEnrollment.contact.email}</p>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                    auditEnrollment.status === 'active' && "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
                    auditEnrollment.status === 'completed' && "bg-blue-500/10 text-blue-600 border border-blue-500/20",
                    auditEnrollment.status === 'cancelled_by_reply' && "bg-amber-500/10 text-amber-600 border border-amber-500/20",
                    auditEnrollment.status === 'failed' && "bg-red-500/10 text-red-600 border border-red-500/20"
                  )}>
                    {auditEnrollment.status === 'cancelled_by_reply' ? 'Deactivated' : auditEnrollment.status}
                  </span>
                  <p className="text-[11px] text-muted-foreground">Current: Step {auditEnrollment.current_step}</p>
                </div>
              </div>

              {/* Step Sequence Execution Progress Bar */}
              <div className="space-y-3">
                <h5 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Activity className="size-3.5 text-primary" /> Step Execution Progression
                </h5>

                <div className="space-y-3">
                  {steps.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No sequence steps defined yet.</p>
                  ) : (
                    steps.map((st, idx) => {
                      const stepNum = idx + 1
                      const isPast = stepNum < auditEnrollment.current_step
                      const isCurrent = stepNum === auditEnrollment.current_step
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "p-3 rounded-xl border flex items-center justify-between text-xs transition-all",
                            isCurrent && "border-primary bg-primary/5 shadow-xs",
                            isPast && "border-emerald-500/30 bg-emerald-500/5",
                            !isCurrent && !isPast && "opacity-60 bg-card"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "size-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0",
                              isPast && "bg-emerald-500 text-white",
                              isCurrent && "bg-primary text-white",
                              !isCurrent && !isPast && "bg-muted text-muted-foreground"
                            )}>
                              {isPast ? "✓" : stepNum}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Step {stepNum}: {st.template_name || 'Template'}</p>
                              <p className="text-[11px] text-muted-foreground">
                                Delay: {st.delay_days}d {st.delay_hours}h • {st.template_language || 'en'}
                              </p>
                            </div>
                          </div>

                          <div className="text-right font-mono text-[11px]">
                            {isPast && <span className="text-emerald-600 font-semibold">✓ Completed</span>}
                            {isCurrent && (
                              <span className="text-primary font-semibold">
                                ⏳ {auditEnrollment.status === 'active' ? `Next: ${new Date(auditEnrollment.next_run_at).toLocaleTimeString()}` : 'Paused'}
                              </span>
                            )}
                            {!isPast && !isCurrent && <span className="text-muted-foreground">Upcoming</span>}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    handleUnenroll([auditEnrollment.id])
                    setAuditEnrollment(null)
                  }}
                  className="gap-1.5 text-xs"
                >
                  <Trash2 className="size-3.5" /> Unenroll Contact
                </Button>

                <div className="flex gap-2">
                  {auditEnrollment.status === 'active' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleEnrollmentStatus([auditEnrollment.id], 'cancelled_by_reply')
                        setAuditEnrollment(null)
                      }}
                      className="gap-1.5 text-xs text-amber-600 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10"
                    >
                      <PauseCircle className="size-3.5" /> Deactivate Contact
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleEnrollmentStatus([auditEnrollment.id], 'active')
                        setAuditEnrollment(null)
                      }}
                      className="gap-1.5 text-xs text-emerald-600 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
                    >
                      <PlayCircle className="size-3.5" /> Re-Activate Sequence
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setAuditEnrollment(null)}>
                    Close Audit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}
