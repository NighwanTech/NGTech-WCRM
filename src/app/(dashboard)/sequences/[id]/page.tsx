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
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const [seqRes, stepsRes, enrollmentsRes, tplRes] = await Promise.all([
        supabase.from('sequences').select('*').eq('id', sequenceId).single(),
        supabase.from('sequence_steps').select('*').eq('sequence_id', sequenceId).order('position', { ascending: true }),
        supabase.from('sequence_enrollments').select('*, contact:contacts(name, phone)').eq('sequence_id', sequenceId).order('created_at', { ascending: false }),
        supabase.from('whatsapp_templates').select('name, language, status').eq('status', 'APPROVED'),
      ])

      if (seqRes.error) {
        toast.error('Sequence not found')
        router.push('/sequences')
        return
      }

      setSequence(seqRes.data)
      setSteps(stepsRes.data || [])
      setEnrollments(enrollmentsRes.data || [])
      setTemplates(tplRes.data || [])
      setLoading(false)
    }
    load()
  }, [sequenceId, router])

  async function handleSave() {
    setSaving(true)
    
    // 1. Update Sequence
    const { error: seqErr } = await supabase
      .from('sequences')
      .update({
        name: sequence.name,
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
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
          Save Sequence
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <Tabs defaultValue="builder" className="max-w-4xl mx-auto">
          <TabsList className="mb-6">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="enrollments">Enrolled Contacts ({enrollments.length})</TabsTrigger>
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
                    <SelectTrigger><SelectValue /></SelectTrigger>
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

          <TabsContent value="enrollments">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Current Step</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Run</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        <Users className="size-8 mx-auto mb-2 opacity-20" />
                        No contacts enrolled yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    enrollments.map(e => (
                      <TableRow key={e.id}>
                        <TableCell>
                          <div className="font-medium">{e.contact?.name || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">{e.contact?.phone}</div>
                        </TableCell>
                        <TableCell>Step {e.current_step}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            e.status === 'active' && "bg-blue-500/10 text-blue-500",
                            e.status === 'completed' && "bg-emerald-500/10 text-emerald-500",
                            e.status === 'cancelled_by_reply' && "bg-yellow-500/10 text-yellow-500",
                            e.status === 'failed' && "bg-red-500/10 text-red-500",
                          )}>
                            {e.status.replace(/_/g, ' ')}
                          </span>
                          {e.error_message && (
                            <p className="text-xs text-red-500 mt-1 max-w-[200px] truncate" title={e.error_message}>
                              {e.error_message}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {e.status === 'active' ? new Date(e.next_run_at).toLocaleString() : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
