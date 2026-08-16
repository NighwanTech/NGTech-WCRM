'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Sparkles, AlertTriangle, ShieldCheck, DollarSign, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Meta Ads OS Enterprise Plan (12 Months)', price: 1800000 },
  { id: 'p2', name: 'WhatsApp Business API Onboarding & Verification', price: 75000 },
  { id: 'p3', name: 'AI Voice Calling Setup (10,000 Minutes)', price: 250000 },
  { id: 'p4', name: 'Custom CRM Pipeline & Automation Integration', price: 150000 }
]

export function QuotationForm({ initialContactId, initialDealId, onSave, onSendWhatsApp }: QuotationFormProps) {
  const [priceBook, setPriceBook] = useState('Enterprise 2026 Pricebook')
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

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: 'Custom Service Line Item',
        quantity: 1,
        unitPrice: 50000,
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

  const selectPresetProduct = (id: string, product: typeof DEFAULT_PRODUCTS[0]) => {
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

  const marginWarning = averageDiscount > 20
  const aiRecommendation = subtotal > 1000000 
    ? 'High-value quote detected. AI recommends offering a 5% prepay discount for instant closing.' 
    : 'Standard enterprise margin profile active.'

  const handleSubmit = (action: 'save' | 'whatsapp') => {
    const quotePayload = {
      customerName,
      customerPhone,
      priceBook,
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
    <div className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Price Book
          </label>
          <select 
            value={priceBook}
            onChange={(e) => setPriceBook(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
          >
            <option value="Enterprise 2026 Pricebook">Enterprise 2026 Pricebook</option>
            <option value="SME / Starter Pack">SME / Starter Pack</option>
            <option value="Partner Wholesale Book">Partner Wholesale Book</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Customer / Company Name
          </label>
          <Input 
            placeholder="e.g. Germopick Healthcare" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            WhatsApp Phone Number
          </label>
          <Input 
            placeholder="e.g. +91 9876543210" 
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* AI Margin Guard & Recommendation Banner */}
      <div className="rounded-lg border bg-card p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-500">
            <Sparkles className="w-4 h-4" />
            AI Recommendation Engine & Margin Guard
          </div>
          {marginWarning ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">
              <AlertTriangle className="w-3.5 h-3.5" /> High Discount Warning (&gt;20%)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3.5 h-3.5" /> Margin Guard Healthy
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{aiRecommendation}</p>
      </div>

      {/* Line Items Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/50 px-4 py-2 text-xs font-semibold text-muted-foreground grid grid-cols-12 gap-2">
          <div className="col-span-5">PRODUCT / SERVICE LINE ITEM</div>
          <div className="col-span-2 text-center">QTY</div>
          <div className="col-span-2 text-right">UNIT PRICE (₹)</div>
          <div className="col-span-2 text-right">SUBTOTAL (₹)</div>
          <div className="col-span-1 text-center">ACTION</div>
        </div>

        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="p-4 grid grid-cols-12 gap-2 items-center text-xs">
              <div className="col-span-5 space-y-1">
                <Input 
                  value={item.name} 
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  className="h-8 text-xs font-medium"
                />
                <div className="flex gap-1 overflow-x-auto pt-1">
                  {DEFAULT_PRODUCTS.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => selectPresetProduct(item.id, prod)}
                      className="text-[10px] text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-1.5 py-0.5 rounded whitespace-nowrap"
                    >
                      + {prod.name.slice(0, 20)}...
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-2 flex justify-center">
                <Input 
                  type="number"
                  min="1"
                  value={item.quantity} 
                  onChange={(e) => updateItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-8 w-16 text-center text-xs"
                />
              </div>

              <div className="col-span-2 text-right">
                <Input 
                  type="number"
                  value={item.unitPrice} 
                  onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="h-8 text-right text-xs"
                />
              </div>

              <div className="col-span-2 text-right font-semibold text-sm">
                ₹{calculateItemSubtotal(item).toLocaleString('en-IN')}
              </div>

              <div className="col-span-1 flex justify-center">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-muted/20 border-t flex justify-between items-center">
          <Button size="sm" variant="outline" onClick={addItem} className="text-xs gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Line Item
          </Button>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calculator className="w-3.5 h-3.5" /> Auto GST (18%) Enabled
          </div>
        </div>
      </div>

      {/* Commercial Summary Cards */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-2 max-w-sm ml-auto text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>GST (18% Tax)</span>
          <span>+₹{gstAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold text-base text-foreground">
          <span>Total Payable</span>
          <span className="text-emerald-500">₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={() => handleSubmit('save')}>
          Save Draft Quote
        </Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={() => handleSubmit('whatsapp')}>
          <DollarSign className="w-4 h-4" /> Send Quote via WhatsApp
        </Button>
      </div>
    </div>
  )
}
