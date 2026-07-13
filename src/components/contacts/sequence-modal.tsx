"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, Route } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SequenceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contactId: string
  accountId: string
  onSuccess?: () => void
}

export function SequenceModal({
  open,
  onOpenChange,
  contactId,
  accountId,
  onSuccess,
}: SequenceModalProps) {
  const [sequences, setSequences] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      loadSequences()
    }
  }, [open, accountId])

  async function loadSequences() {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('sequences')
      .select('id, name')
      .eq('account_id', accountId)
      .eq('is_active', true)
      .order('name')
    
    setLoading(false)
    if (error) {
      toast.error('Failed to load sequences')
      return
    }
    setSequences(data || [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSequenceId) return

    setSaving(true)
    const supabase = createClient()
    
    const { error } = await supabase
      .from('sequence_enrollments')
      .insert({
        sequence_id: selectedSequenceId,
        contact_id: contactId,
        status: 'active'
      })

    setSaving(false)
    if (error) {
      if (error.code === '23505') {
        toast.error('Contact is already enrolled in this sequence')
      } else {
        toast.error('Failed to enroll contact')
      }
      return
    }

    toast.success('Contact enrolled successfully')
    onOpenChange(false)
    if (onSuccess) onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Route className="size-5 text-purple-500" />
              Enroll in Sequence
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            {loading ? (
              <div className="flex justify-center"><Loader2 className="size-6 animate-spin text-primary" /></div>
            ) : sequences.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                No active sequences found. Create one first.
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="sequence">Select Sequence</Label>
                <Select value={selectedSequenceId} onValueChange={(value) => setSelectedSequenceId(value ?? '')} required>
                  <SelectTrigger id="sequence">
                    <SelectValue placeholder="Choose a sequence..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sequences.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedSequenceId || saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enroll Contact
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
