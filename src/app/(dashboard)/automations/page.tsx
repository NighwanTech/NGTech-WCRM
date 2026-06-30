"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Zap,
  Plus,
  MoreVertical,
  Copy,
  Pencil,
  Trash2,
  FileText,
  MessageCircle,
  Clock,
  Users,
  PhoneCall,
  Loader2,
  Bot,
  Save,
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { useCan } from "@/hooks/use-can"
import type { Automation } from "@/types"
import { Button } from "@/components/ui/button"
import { GatedButton } from "@/components/ui/gated-button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AUTOMATION_TEMPLATES, type TemplateSlug } from "@/lib/automations/templates"
import { triggerMeta, formatRelative } from "@/lib/automations/trigger-meta"
import { cn } from "@/lib/utils"

const TEMPLATE_ORDER: TemplateSlug[] = [
  "welcome_message",
  "out_of_office",
  "lead_qualifier",
  "follow_up_reminder",
]

const TEMPLATE_ICON: Record<TemplateSlug, typeof Zap> = {
  welcome_message: MessageCircle,
  out_of_office: Clock,
  lead_qualifier: Users,
  follow_up_reminder: PhoneCall,
}

export default function AutomationsPage() {
  const router = useRouter()
  const canCreate = useCan("send-messages")
  const [automations, setAutomations] = useState<Automation[] | null>(null)
  const [config, setConfig] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Automation | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    try {
      const supabase = createClient()
      const [autoRes, configRes] = await Promise.all([
        supabase
          .from("automations")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("whatsapp_config")
          .select("*")
          .single()
      ]);
      
      if (autoRes.error) throw autoRes.error;
      setAutomations((autoRes.data ?? []) as Automation[]);
      
      if (!configRes.error && configRes.data) {
        setConfig(configRes.data);
      } else if (configRes.error && configRes.error.code !== 'PGRST116') {
        console.error("Failed to load whatsapp_config", configRes.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load automations")
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleActive(a: Automation, next: boolean) {
    // Optimistic flip so the switch feels instant.
    setAutomations((prev) =>
      prev?.map((x) => (x.id === a.id ? { ...x, is_active: next } : x)) ?? prev,
    )
    const res = await fetch(`/api/automations/${a.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ is_active: next }),
    })
    if (!res.ok) {
      // Roll back on error.
      setAutomations((prev) =>
        prev?.map((x) => (x.id === a.id ? { ...x, is_active: !next } : x)) ?? prev,
      )
      const body = await res.json().catch(() => ({}))
      toast.error(body?.error ?? "Failed to update")
      return
    }
    toast.success(next ? "Automation activated" : "Automation paused")
  }

  async function duplicate(a: Automation) {
    const res = await fetch(`/api/automations/${a.id}/duplicate`, { method: "POST" })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      toast.error(body?.error ?? "Failed to duplicate")
      return
    }
    toast.success("Automation duplicated")
    load()
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    const res = await fetch(`/api/automations/${pendingDelete.id}`, { method: "DELETE" })
    setDeleting(false)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      toast.error(body?.error ?? "Failed to delete")
      return
    }
    toast.success("Automation deleted")
    setPendingDelete(null)
    load()
  }

  async function startFromTemplate(slug: TemplateSlug) {
    router.push(`/automations/new?template=${slug}`)
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <p className="text-sm text-red-400">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  if (automations === null) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  const showTemplates = automations.length < 3

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Automations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build workflows that react to WhatsApp® events automatically.
          </p>
        </div>
        <GatedButton
          canAct={canCreate}
          gateReason="create automations"
          onClick={() => router.push("/automations/new")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Automation
        </GatedButton>
      </div>

      <GlobalAIBotCard config={config} onSaved={load} />

      {showTemplates && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Quick-start templates</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {TEMPLATE_ORDER.map((slug) => {
              const t = AUTOMATION_TEMPLATES[slug]
              const Icon = TEMPLATE_ICON[slug]
              return (
                <button
                  key={slug}
                  onClick={() => startFromTemplate(slug)}
                  className="group flex flex-col items-start rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50 hover:bg-card/80"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {automations.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">No automations yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Pick a template above or create one from scratch.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {automations.map((a) => (
            <AutomationCard
              key={a.id}
              automation={a}
              onToggle={(next) => toggleActive(a, next)}
              onEdit={() => router.push(`/automations/${a.id}/edit`)}
              onDuplicate={() => duplicate(a)}
              onLogs={() => router.push(`/automations/${a.id}/logs`)}
              onDelete={() => setPendingDelete(a)}
            />
          ))}
        </ul>
      )}

      <Dialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete automation</DialogTitle>
            <DialogDescription>
              This permanently removes{" "}
              <span className="text-foreground">{pendingDelete?.name}</span> and its execution
              history. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setPendingDelete(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AutomationCard({
  automation,
  onToggle,
  onEdit,
  onDuplicate,
  onLogs,
  onDelete,
}: {
  automation: Automation
  onToggle: (next: boolean) => void
  onEdit: () => void
  onDuplicate: () => void
  onLogs: () => void
  onDelete: () => void
}) {
  const meta = triggerMeta(automation.trigger_type)
  return (
    <li className="rounded-xl border border-border bg-card transition-colors hover:border-border">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
        <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10"
            aria-hidden
          >
            <Zap className="h-5 w-5 text-primary" />
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="min-w-0 flex-1 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold text-foreground">
                {automation.name}
              </span>
              {automation.is_active && (
                <span className="relative flex h-2 w-2 flex-shrink-0" aria-label="active">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
              )}
            </div>
            {automation.description && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{automation.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                  meta.pillClass,
                )}
              >
                {meta.label}
              </span>
              <span className="tabular-nums">
                {automation.execution_count} run{automation.execution_count === 1 ? "" : "s"}
              </span>
              <span aria-hidden>·</span>
              <span>last {formatRelative(automation.last_executed_at)}</span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto border-t border-border/50 sm:border-none pt-3 sm:pt-0 w-full sm:w-auto justify-between sm:justify-start">
          <Switch
            checked={automation.is_active}
            onCheckedChange={(v) => onToggle(!!v)}
            aria-label={automation.is_active ? "Deactivate" : "Activate"}
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Open menu"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[popup-open]:bg-muted"
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogs}>
                <FileText className="h-4 w-4" />
                View Logs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </li>
  )
}

function GlobalAIBotCard({ config, onSaved }: { config: any, onSaved: () => void }) {
  const [enabled, setEnabled] = useState(config?.ai_auto_reply_enabled ?? false);
  const [prompt, setPrompt] = useState(config?.ai_auto_reply_prompt ?? 'You are a helpful customer support assistant for this business.');
  const [kb, setKb] = useState(config?.ai_knowledge_base ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEnabled(config?.ai_auto_reply_enabled ?? false);
    setPrompt(config?.ai_auto_reply_prompt ?? 'You are a helpful customer support assistant for this business.');
    setKb(config?.ai_knowledge_base ?? '');
  }, [config]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch('/api/whatsapp/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ai_auto_reply_enabled: enabled,
        ai_auto_reply_prompt: prompt,
        ai_knowledge_base: kb
      })
    });
    setSaving(false);
    if (!res.ok) {
      toast.error('Failed to save AI Bot settings');
      return;
    }
    toast.success('AI Bot settings saved');
    onSaved();
  }

  if (!config) return null; // Hide if they haven't set up WhatsApp

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 mb-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Bot className="h-5 w-5 text-emerald-500" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Global AI Auto-Responder</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-1">
            Automatically reply to all inbound messages using Google Gemini.
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-2 justify-between sm:justify-start">
          <Label className="sm:hidden text-foreground">Enable Bot</Label>
          <div className="flex items-center gap-2">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            <Label className="hidden sm:inline">Active</Label>
          </div>
        </div>
      </div>

      {enabled && (
        <div className="mt-6 space-y-5 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <Label className="text-foreground">System Prompt</Label>
            <textarea 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. You are a friendly customer service agent..."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Knowledge Base</Label>
            <textarea 
              value={kb}
              onChange={e => setKb(e.target.value)}
              placeholder="Paste FAQs, menus, or pricing here..."
              className="flex min-h-[150px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">Gemini will use this information to accurately answer customer questions.</p>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving} className="gap-2 w-full sm:w-auto">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save AI Settings
            </Button>
          </div>
        </div>
      )}
      {!enabled && (
        <div className="mt-4 flex justify-end">
           <Button onClick={handleSave} variant="secondary" disabled={saving} size="sm" className="w-full sm:w-auto">
             {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save as Disabled'}
           </Button>
        </div>
      )}
    </div>
  )
}

