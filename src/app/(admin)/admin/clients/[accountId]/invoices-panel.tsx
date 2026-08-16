'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Receipt, Plus, Edit2, Trash2, Send, CheckCircle2, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Invoice {
  id: string
  amount: number
  status: 'unpaid' | 'paid' | 'overdue'
  issue_date: string
  due_date: string | null
  notes: string | null
}

export function AdminInvoicesPanel({ accountId, clientName, clientPhone }: { accountId: string; clientName?: string; clientPhone?: string }) {
  const supabase = createClient()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  // Form state
  const [amount, setAmount] = useState<number | string>('')
  const [status, setStatus] = useState<Invoice['status']>('unpaid')
  const [issueDate, setIssueDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchInvoices()
  }, [accountId])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const { data, error: fetchErr } = await supabase
        .from('invoices')
        .select('*')
        .eq('account_id', accountId)
        .order('issue_date', { ascending: false })

      if (fetchErr) throw fetchErr
      setInvoices(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const numAmount = Number(amount) || 0
      const payload = {
        account_id: accountId,
        amount: numAmount,
        status,
        issue_date: issueDate || new Date().toISOString().split('T')[0],
        due_date: dueDate || null,
        notes: notes || null,
        updated_at: new Date().toISOString()
      }

      if (isEditing) {
        const { error: updateErr } = await supabase
          .from('invoices')
          .update(payload)
          .eq('id', isEditing)
        if (updateErr) throw updateErr
        toast.success('Invoice updated successfully!')
      } else {
        const { error: insertErr } = await supabase
          .from('invoices')
          .insert(payload)
        if (insertErr) throw insertErr
        toast.success('New invoice created for client!')
      }

      // Sync to unified localStorage Finance ledger
      try {
        const existing = JSON.parse(localStorage.getItem('aiwcrm_finance_invoices_v1') || '[]')
        const gst = Math.round(numAmount * 0.18)
        const newEntry = {
          id: `sub-inv-${Date.now()}`,
          invoiceNumber: notes || `INV-SUB-2026-${Math.floor(100 + Math.random() * 900)}`,
          clientName: clientName || 'Client Account',
          clientPhone: clientPhone || '',
          subtotal: numAmount,
          gstAmount: gst,
          grandTotal: numAmount + gst,
          issueDate: issueDate || new Date().toISOString(),
          dueDate: dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          status: status === 'paid' ? 'Paid' : 'Draft',
          sourceQuoteId: 'Subscription Billing'
        }
        localStorage.setItem('aiwcrm_finance_invoices_v1', JSON.stringify([newEntry, ...existing]))
      } catch {}
      
      resetForm()
      await fetchInvoices()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return
    try {
      const { error: delErr } = await supabase.from('invoices').delete().eq('id', id)
      if (delErr) throw delErr
      toast.success('Invoice deleted.')
      await fetchInvoices()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleSendWhatsApp = (inv: Invoice) => {
    const cleanPhone = (clientPhone || '').replace(/\D/g, '')
    const gst = Math.round(inv.amount * 0.18)
    const grandTotal = inv.amount + gst
    const msg = [
      `*AIWCRM SUBSCRIPTION BILLING INVOICE*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📄 *Ref:* ${inv.notes || 'Platform Subscription'}`,
      `👤 *Client:* ${clientName || 'Valued Account'}`,
      `📅 *Issue Date:* ${new Date(inv.issue_date).toLocaleDateString('en-IN')}`,
      inv.due_date ? `⏳ *Due Date:* ${new Date(inv.due_date).toLocaleDateString('en-IN')}` : ``,
      ``,
      `💵 *Base Subscription:* ₹${inv.amount.toLocaleString('en-IN')}`,
      `🏷️ *GST (18% Tax):* +₹${gst.toLocaleString('en-IN')}`,
      `💰 *Total Amount Due:* ₹${grandTotal.toLocaleString('en-IN')}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Status: *${inv.status.toUpperCase()}*`,
      `Please remit payment to keep your AIWCRM WhatsApp & Voice AI active.`
    ].filter(Boolean).join('\n')

    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`

    window.open(waUrl, '_blank')
    toast.success('Subscription invoice opened in WhatsApp!')
  }

  const resetForm = () => {
    setIsEditing(null)
    setIsCreating(false)
    setAmount('')
    setStatus('unpaid')
    setIssueDate(new Date().toISOString().split('T')[0])
    setDueDate('')
    setNotes('')
  }

  const openEdit = (inv: Invoice) => {
    setIsEditing(inv.id)
    setIsCreating(false)
    setAmount(inv.amount)
    setStatus(inv.status)
    setIssueDate(inv.issue_date)
    setDueDate(inv.due_date || '')
    setNotes(inv.notes || '')
  }

  if (loading) return <div className="p-6 text-xs text-muted-foreground">Loading subscription invoices...</div>
  if (error) return <div className="p-6 text-xs text-destructive">{error}</div>

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs text-xs">
      <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
        <div>
          <h2 className="text-sm font-bold text-foreground">Subscription Invoices ({invoices.length})</h2>
          <p className="text-[11px] text-muted-foreground">Client billing history, manual invoice creation & GST compliance</p>
        </div>
        {!isCreating && !isEditing && (
          <Button
            size="sm"
            onClick={() => { resetForm(); setIsCreating(true) }}
            className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> New Invoice
          </Button>
        )}
      </div>

      {(isCreating || isEditing) && (
        <div className="border-b border-border bg-muted/10 p-6 space-y-4">
          <h3 className="text-sm font-bold text-foreground">{isEditing ? 'Edit Subscription Invoice' : 'New Subscription Invoice'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Amount (₹ INR)</label>
              <input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="e.g. 50000"
                className="w-full rounded-xl border bg-card px-3 py-1.5 text-xs font-mono" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value as any)} 
                className="w-full rounded-xl border bg-card px-3 py-1.5 text-xs font-medium"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Issue Date</label>
              <input 
                type="date" 
                value={issueDate} 
                onChange={e => setIssueDate(e.target.value)} 
                className="w-full rounded-xl border bg-card px-3 py-1.5 text-xs" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Due Date (Optional)</label>
              <input 
                type="date" 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)} 
                className="w-full rounded-xl border bg-card px-3 py-1.5 text-xs" 
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Notes / Invoice Ref #</label>
              <input 
                type="text" 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                placeholder="e.g. INV-SUB-2026-001 (Annual Pro Plan)" 
                className="w-full rounded-xl border bg-card px-3 py-1.5 text-xs" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="ghost" onClick={resetForm} className="text-xs rounded-xl">Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="text-xs font-bold bg-primary text-primary-foreground rounded-xl shadow-xs">
              {saving ? 'Saving...' : 'Save Invoice'}
            </Button>
          </div>
        </div>
      )}

      <div className="divide-y divide-border">
        {invoices.length === 0 && !isCreating && !isEditing ? (
          <div className="px-6 py-12 text-center text-xs text-muted-foreground">
            <Receipt className="mx-auto mb-2 h-6 w-6 opacity-30" />
            No subscription invoices recorded for this client account yet.
          </div>
        ) : (
          invoices.map((inv) => (
            <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 transition-colors hover:bg-muted/10 gap-3">
              <div className="flex gap-4">
                <div className="space-y-1 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">₹{Number(inv.amount).toLocaleString('en-IN')}</span>
                    <Badge variant="outline" className={`text-[9px] font-bold ${
                      inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' :
                      inv.status === 'overdue' ? 'bg-destructive/10 text-destructive border-destructive/30' :
                      'bg-amber-500/10 text-amber-600 border-amber-500/30'
                    }`}>
                      {inv.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs font-sans text-muted-foreground">{inv.notes || 'Subscription Billing'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 font-sans">
                <div className="text-right space-y-0.5">
                  <p className="text-[11px] text-muted-foreground">Issued: {new Date(inv.issue_date).toLocaleDateString('en-IN')}</p>
                  {inv.due_date && <p className="text-[11px] text-muted-foreground">Due: {new Date(inv.due_date).toLocaleDateString('en-IN')}</p>}
                </div>
                <div className="flex items-center gap-1 border-l pl-3">
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSendWhatsApp(inv)} 
                    className="h-7 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/10 gap-1 rounded-lg"
                    title="Send via WhatsApp"
                  >
                    <Send className="h-3 w-3" /> WhatsApp
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(inv)} 
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground rounded-lg" 
                    title="Edit"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(inv.id)} 
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10" 
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
