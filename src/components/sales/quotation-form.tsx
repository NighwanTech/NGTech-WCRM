'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Sparkles, AlertTriangle, ShieldCheck, DollarSign, Calculator, Settings, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  PriceBook, 
  PriceBookProduct, 
  PriceBookManagerModal, 
  getStoredPriceBooks, 
  DEFAULT_PRICE_BOOKS 
} from './pricebook-manager'

export interface QuoteLineItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  discountPercent: number
}

interface QuotationFormProps {
  initialContactId?: string
  initialDealId?: string
  onSave?: (quoteData: any) => void
  onSendWhatsApp?: (quoteData: any) => void
}

export function QuotationForm({ initialContactId, initialDealId, onSave, onSendWhatsApp }: QuotationFormProps) {
  const [priceBooks, setPriceBooks] = useState<PriceBook[]>(DEFAULT_PRICE_BOOKS)
  const [selectedBookId, setSelectedBookId] = useState<string>(DEFAULT_PRICE_BOOKS[0].id)
  const [isManagerOpen, setIsManagerOpen] = useState(false)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [items, setItems] = useState<QuoteLineItem[]>([
    {
      id: '1',
      name: 'Meta Ads OS Enterprise Plan (12 Months)',
      quantity: 1,
      unitPrice: 1800000,
      discountPercent: 0
    }
  ])

  useEffect(() => {
    const loaded = getStoredPriceBooks()
    setPriceBooks(loaded)
    if (!loaded.find(b => b.id === selectedBookId)) {
      setSelectedBookId(loaded[0]?.id || DEFAULT_PRICE_BOOKS[0].id)
    }
  }, [isManagerOpen, selectedBookId])

  const activeBook = priceBooks.find(b => b.id === selectedBookId) || priceBooks[0] || DEFAULT_PRICE_BOOKS[0]

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: activeBook.products[0]?.name || 'Custom Service Line Item',
        quantity: 1,
        unitPrice: activeBook.products[0]?.price || 50000,
        discountPercent: 0
      }
    ])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id: string, field: keyof QuoteLineItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const selectPresetProduct = (id: string, product: PriceBookProduct) => {
    setItems(items.map(item => item.id === id ? { ...item, name: product.name, unitPrice: product.price } : item))
  }

  // Calculations
  const calculateItemSubtotal = (item: QuoteLineItem) => {
    const raw = item.quantity * item.unitPrice
    const discount = (raw * item.discountPercent) / 100
    return raw - discount
  }

  const subtotal = items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0)
  const gstAmount = Math.round(subtotal * 0.18)
  const grandTotal = subtotal + gstAmount

  // AI Recommendation & Margin Guard Logic
  const averageDiscount = items.length > 0 
    ? items.reduce((sum, item) => sum + item.discountPercent, 0) / items.length 
    : 0

  const discountCap = activeBook?.discountCapPercent || 20
  const marginWarning = averageDiscount > discountCap
  const aiRecommendation = subtotal > 1000000 
    ? 'High-value quote detected. AI recommends offering a 5% prepay discount for instant closing.' 
    : `Standard margin profile active for ${activeBook.name} (Max authorized discount: ${discountCap}%).`

  const handleSubmit = (action: 'save' | 'whatsapp') => {
    const quotePayload = {
      customerName,
      customerPhone,
      priceBook: activeBook.name,
      items,
      subtotal,
      gstAmount,
      grandTotal,
      status: action === 'whatsapp' ? 'Sent' : 'Draft',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }

    if (action === 'save' && onSave) onSave(quotePayload)
    if (action === 'whatsapp' && onSendWhatsApp) onSendWhatsApp(quotePayload)
  }

  return (
    <div className="space-y-6 text-xs">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Price Book Rate Card
            </label>
            <button
              type="button"
              onClick={() => setIsManagerOpen(true)}
              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Settings className="w-3 h-3" /> Manage Books
            </button>
          </div>
          <select 
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs font-semibold"
          >
            {priceBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.products.length} items)
              </option>
            ))}
          </select>
          <p className="text-[10px] text-muted-foreground mt-1 truncate">{activeBook.description}</p>
        </div>

        <div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
            Customer / Company Name
          </label>
          <Input 
            placeholder="e.g. Acme Tech Solutions" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="h-9 text-xs rounded-xl"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
            WhatsApp Phone Number
          </label>
          <Input 
            placeholder="e.g. +91 9876543210" 
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="h-9 text-xs rounded-xl font-mono"
          />
        </div>
      </div>

      {/* AI Margin Guard & Recommendation Banner */}
      <div className="rounded-2xl border bg-card p-4 space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <Sparkles className="w-4 h-4" />
            AI Recommendation Engine & Margin Guard ({activeBook.name})
          </div>
          {marginWarning ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" /> High Discount Warning (&gt;{discountCap}%)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> Margin Guard Healthy
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">{aiRecommendation}</p>
      </div>

      {/* Line Items Table */}
      <div className="border rounded-2xl overflow-hidden shadow-xs bg-card">
        <div className="bg-muted/40 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground grid grid-cols-12 gap-2 border-b">
          <div className="col-span-5">PRODUCT / SERVICE LINE ITEM</div>
          <div className="col-span-2 text-center">QTY</div>
          <div className="col-span-2 text-right">UNIT PRICE (₹)</div>
          <div className="col-span-2 text-right">SUBTOTAL (₹)</div>
          <div className="col-span-1 text-center">ACTION</div>
        </div>

        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="p-4 grid grid-cols-12 gap-2 items-center text-xs hover:bg-muted/10 transition-colors">
              <div className="col-span-5 space-y-1.5">
                <Input 
                  value={item.name} 
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  className="h-8 text-xs font-medium"
                />
                {/* Dynamic Preset Chips from Selected Price Book */}
                {activeBook.products && activeBook.products.length > 0 && (
                  <div className="flex gap-1 overflow-x-auto pt-0.5 pb-0.5">
                    {activeBook.products.map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => selectPresetProduct(item.id, prod)}
                        className="text-[9px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                        title={`Select ${prod.name} (₹${prod.price.toLocaleString()})`}
                      >
                        + {prod.name.slice(0, 24)}... (₹{prod.price.toLocaleString()})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-2 flex justify-center">
                <Input 
                  type="number"
                  min="1"
                  value={item.quantity} 
                  onChange={(e) => updateItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-8 w-16 text-center text-xs font-mono"
                />
              </div>

              <div className="col-span-2 text-right">
                <Input 
                  type="number"
                  value={item.unitPrice} 
                  onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="h-8 text-right text-xs font-mono"
                />
              </div>

              <div className="col-span-2 text-right font-mono font-bold text-foreground">
                ₹{calculateItemSubtotal(item).toLocaleString('en-IN')}
              </div>

              <div className="col-span-1 text-center">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => removeItem(item.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-muted/20 border-t flex justify-between items-center">
          <Button size="sm" variant="outline" onClick={addItem} className="text-xs font-bold gap-1 text-primary cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add Line Item
          </Button>
          <span className="text-[10px] text-muted-foreground font-mono">
            Auto GST (18%) Enabled
          </span>
        </div>
      </div>

      {/* Financial Summary & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 p-5 rounded-2xl border bg-card shadow-xs">
        <div className="space-y-1 text-xs max-w-sm">
          <span className="font-bold text-foreground">Commercial Quote Terms</span>
          <p className="text-[11px] text-muted-foreground">
            Quotations valid for 30 days. All deliveries include GST tax breakdown and instant client WhatsApp notifications.
          </p>
        </div>

        <div className="w-full sm:w-72 space-y-2 font-mono text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>GST (18% Tax)</span>
            <span className="text-emerald-600 font-bold">+₹{gstAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-foreground border-t pt-2">
            <span>Total Payable</span>
            <span className="text-emerald-600">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleSubmit('save')}
              className="w-1/2 text-xs font-semibold"
            >
              Save Draft Quote
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleSubmit('whatsapp')}
              className="w-1/2 text-xs font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white gap-1.5 shadow-xs"
            >
              $ Send via WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Dynamic Price Book Manager Modal */}
      <PriceBookManagerModal
        open={isManagerOpen}
        onOpenChange={setIsManagerOpen}
        onSelectPriceBook={(book) => setSelectedBookId(book.id)}
      />
    </div>
  )
}
