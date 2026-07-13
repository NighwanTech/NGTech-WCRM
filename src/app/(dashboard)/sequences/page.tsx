"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
  Loader2,
  Route,
  Activity,
  Calendar,
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { useCan } from "@/hooks/use-can"
import { Button } from "@/components/ui/button"
import { GatedButton } from "@/components/ui/gated-button"
import { Switch } from "@/components/ui/switch"
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
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export default function SequencesPage() {
  const router = useRouter()
  const canCreate = useCan("send-messages") // Same permission as automations/broadcasts
  const [sequences, setSequences] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<any | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [creating, setCreating] = useState(false)

  async function load() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("sequences")
        .select("*, enrollments:sequence_enrollments(count)")
        .order("created_at", { ascending: false })

      if (error) throw error
      setSequences(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sequences")
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function createSequence() {
    setCreating(true)
    const supabase = createClient()
    const { data: user } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('account_id').eq('user_id', user.user?.id).single()
    
    if (!profile) return

    const { data, error } = await supabase
      .from('sequences')
      .insert({
        account_id: profile.account_id,
        user_id: user.user?.id,
        name: 'New Sequence',
        is_active: false,
      })
      .select()
      .single()

    setCreating(false)

    if (error) {
      toast.error('Failed to create sequence')
    } else if (data) {
      router.push(`/sequences/${data.id}`)
    }
  }

  async function toggleActive(s: any, next: boolean) {
    const supabase = createClient()
    if (next) {
      const { count, error: stepsError } = await supabase
        .from('sequence_steps')
        .select('*', { count: 'exact', head: true })
        .eq('sequence_id', s.id)
        .not('template_name', 'is', null)
      if (stepsError || !count) {
        toast.error('Add at least one template step before activating this sequence')
        return
      }
    }
    setSequences((prev) =>
      prev?.map((x) => (x.id === s.id ? { ...x, is_active: next } : x)) ?? prev,
    )
    const { error } = await supabase.from('sequences').update({ is_active: next }).eq('id', s.id)
    if (error) {
      setSequences((prev) =>
        prev?.map((x) => (x.id === s.id ? { ...x, is_active: !next } : x)) ?? prev,
      )
      toast.error("Failed to update status")
      return
    }
    toast.success(next ? "Sequence activated" : "Sequence paused")
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('sequences').delete().eq('id', pendingDelete.id)
    setDeleting(false)
    if (error) {
      toast.error("Failed to delete sequence")
      return
    }
    toast.success("Sequence deleted")
    setPendingDelete(null)
    load()
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 p-8">
        <p className="text-sm text-red-400">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  if (sequences === null) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-8 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sequences</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build automated drip campaigns to nurture your contacts.
          </p>
        </div>
        <GatedButton
          canAct={canCreate}
          gateReason="create sequences"
          onClick={createSequence}
          disabled={creating}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create Sequence
        </GatedButton>
      </div>

      {sequences.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Route className="h-6 w-6 text-primary" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">No sequences yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create a drip campaign to automate your messaging.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sequences.map((s) => (
            <li key={s.id} className="rounded-xl border border-border bg-card transition-colors hover:border-border">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10"
                    aria-hidden
                  >
                    <Route className="h-5 w-5 text-primary" />
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push(`/sequences/${s.id}`)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {s.name}
                      </span>
                      {s.is_active && (
                        <span className="relative flex h-2 w-2 flex-shrink-0" aria-label="active">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {s.enrollments?.[0]?.count || 0} enrolled
                      </span>
                      <span aria-hidden>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        Created {format(new Date(s.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto border-t border-border/50 sm:border-none pt-3 sm:pt-0 w-full sm:w-auto justify-between sm:justify-start">
                  <Switch
                    checked={s.is_active}
                    onCheckedChange={(v) => toggleActive(s, !!v)}
                    aria-label={s.is_active ? "Deactivate" : "Activate"}
                  />

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label="Open menu"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[popup-open]:bg-muted"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/sequences/${s.id}`)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => setPendingDelete(s)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sequence</DialogTitle>
            <DialogDescription>
              This permanently removes{" "}
              <span className="text-foreground">{pendingDelete?.name}</span> and unenrolls all active contacts. This cannot be undone.
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
