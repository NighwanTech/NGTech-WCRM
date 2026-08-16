'use client'

import React, { useState, useEffect } from 'react'
import { 
  BookOpen, Plus, Trash2, Edit2, Check, X, Sparkles, 
  DollarSign, ShieldCheck, Tag, Layers, CheckCircle2,
  Package, ArrowRight, Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export interface PriceBookProduct {
  id: string
  name: string
  price: number
  category?: string
}

export interface PriceBook {
  id: string
  name: string
  description: string
  discountCapPercent: number
  products: PriceBookProduct[]
}

export const DEFAULT_PRICE_BOOKS: PriceBook[] = [
  {
    id: 'pb-enterprise',
    name: 'Enterprise 2026 Pricebook',
    description: 'Standard rate card for enterprise accounts with dedicated SLA and custom integrations',
    discountCapPercent: 15,
    products: [
      { id: 'p1', name: 'Meta Ads OS Enterprise Plan (12 Months)', price: 1800000, category: 'Software' },
      { id: 'p2', name: 'WhatsApp Business API Onboarding & Verification', price: 75000, category: 'Setup' },
      { id: 'p3', name: 'AI Voice Calling Setup (10,000 Minutes)', price: 250000, category: 'AI Services' },
      { id: 'p4', name: 'Custom CRM Pipeline & Automation Integration', price: 150000, category: 'Implementation' }
    ]
  },
  {
    id: 'pb-sme',
    name: 'SME / Starter Pack',
    description: 'Packaged affordable pricing for small businesses and growing teams',
    discountCapPercent: 10,
    products: [
      { id: 'p5', name: 'AIWCRM Starter Annual License', price: 29999, category: 'Software' },
      { id: 'p6', name: 'WhatsApp Cloud API Embedded Setup', price: 9999, category: 'Setup' },
      { id: 'p7', name: 'Custom WhatsApp Chatbot Flow Builder', price: 14999, category: 'Implementation' }
    ]
  },
  {
    id: 'pb-wholesale',
    name: 'Partner Wholesale Book',
    description: 'Volume discount rate card for certified marketing agencies and resellers',
    discountCapPercent: 25,
    products: [
      { id: 'p8', name: 'Agency Reseller Multi-Tenant Node (5 Clients)', price: 120000, category: 'Agency' },
      { id: 'p9', name: 'Wholesale WhatsApp CAPI Pipeline Setup', price: 45000, category: 'Implementation' },
      { id: 'p10', name: 'AI Voice Agent Sub-Account License', price: 60000, category: 'AI Services' }
    ]
  }
]

const STORAGE_KEY = 'aiwcrm_dynamic_pricebooks'

export function getStoredPriceBooks(): PriceBook[] {
  if (typeof window === 'undefined') return DEFAULT_PRICE_BOOKS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return DEFAULT_PRICE_BOOKS
}

export function saveStoredPriceBooks(books: PriceBook[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  } catch {}
}

export function PriceBookManagerModal({
  open,
  onOpenChange,
  onSelectPriceBook
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectPriceBook?: (book: PriceBook) => void
}) {
  const [books, setBooks] = useState<PriceBook[]>(DEFAULT_PRICE_BOOKS)
  const [selectedBookId, setSelectedBookId] = useState<string>(DEFAULT_PRICE_BOOKS[0].id)
  const [isCreatingBook, setIsCreatingBook] = useState(false)

  // New Book Form
  const [newBookName, setNewBookName] = useState('')
  const [newBookDesc, setNewBookDesc] = useState('')
  const [newDiscountCap, setNewDiscountCap] = useState('20')

  // New Product Form for Selected Book
  const [newProductName, setNewProductName] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')

  useEffect(() => {
    if (open) {
      const loaded = getStoredPriceBooks()
      setBooks(loaded)
      if (!loaded.find(b => b.id === selectedBookId)) {
        setSelectedBookId(loaded[0]?.id || DEFAULT_PRICE_BOOKS[0].id)
      }
    }
  }, [open, selectedBookId])

  const selectedBook = books.find(b => b.id === selectedBookId) || books[0]

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBookName.trim()) return

    const newBook: PriceBook = {
      id: `pb-${Date.now()}`,
      name: newBookName.trim(),
      description: newBookDesc.trim() || 'Custom catalog for commercial proposals & quotations',
      discountCapPercent: Number(newDiscountCap) || 20,
      products: []
    }

    const updated = [...books, newBook]
    setBooks(updated)
    saveStoredPriceBooks(updated)
    setSelectedBookId(newBook.id)
    setIsCreatingBook(false)
    setNewBookName('')
    setNewBookDesc('')
    toast.success(`Price Book "${newBook.name}" created!`)
  }

  const handleDeleteBook = (id: string) => {
    if (books.length <= 1) {
      toast.error('You must keep at least one Price Book.')
      return
    }
    const updated = books.filter(b => b.id !== id)
    setBooks(updated)
    saveStoredPriceBooks(updated)
    setSelectedBookId(updated[0].id)
    toast.success('Price Book removed.')
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProductName.trim() || !newProductPrice.trim() || !selectedBook) return

    const newProd: PriceBookProduct = {
      id: `prod-${Date.now()}`,
      name: newProductName.trim(),
      price: Number(newProductPrice) || 0
    }

    const updated = books.map(b => {
      if (b.id === selectedBook.id) {
        return { ...b, products: [...b.products, newProd] }
      }
      return b
    })

    setBooks(updated)
    saveStoredPriceBooks(updated)
    setNewProductName('')
    setNewProductPrice('')
    toast.success(`Added "${newProd.name}" (₹${newProd.price.toLocaleString()})`)
  }

  const handleDeleteProduct = (productId: string) => {
    if (!selectedBook) return
    const updated = books.map(b => {
      if (b.id === selectedBook.id) {
        return { ...b, products: b.products.filter(p => p.id !== productId) }
      }
      return b
    })
    setBooks(updated)
    saveStoredPriceBooks(updated)
    toast.success('Item removed from Price Book.')
  }

  const handleUseBook = (book: PriceBook) => {
    if (onSelectPriceBook) onSelectPriceBook(book)
    onOpenChange(false)
    toast.success(`Active Rate Card set to: ${book.name}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[960px] md:max-w-[1000px] w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden font-sans border shadow-2xl rounded-3xl bg-card">
        {/* Header (Fixed) */}
        <DialogHeader className="p-4 sm:p-5 border-b bg-muted/20 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-xs shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Price Book & Rate Card Catalog
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Manage commercial rate cards, standardized product items, and automated AI discount margin guards
              </DialogDescription>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setIsCreatingBook(!isCreatingBook)}
            className="h-8 text-xs font-bold bg-primary text-primary-foreground gap-1.5 cursor-pointer shadow-xs rounded-xl mr-6"
          >
            <Plus className="w-4 h-4" /> New Price Book
          </Button>
        </DialogHeader>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 space-y-5 text-xs overflow-y-auto flex-1 max-h-[calc(90vh-140px)] custom-scrollbar pr-3">
          {/* Create New Book Form Drawer */}
          {isCreatingBook && (
            <form onSubmit={handleCreateBook} className="p-5 rounded-2xl border bg-primary/5 border-primary/20 space-y-4 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-primary/10">
                <span className="font-bold text-xs text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Create New Price Book Catalog
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">Custom Commercial Tier</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                <div className="sm:col-span-8 space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Price Book Title <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="e.g. Healthcare & Clinic Rate Card 2026"
                    value={newBookName}
                    onChange={(e) => setNewBookName(e.target.value)}
                    className="h-9 text-xs bg-background rounded-xl"
                    required
                  />
                </div>
                <div className="sm:col-span-4 space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Max Discount Guard (%)</Label>
                  <Input
                    type="number"
                    value={newDiscountCap}
                    onChange={(e) => setNewDiscountCap(e.target.value)}
                    className="h-9 text-xs bg-background font-mono rounded-xl"
                    min="1"
                    max="50"
                  />
                </div>
                <div className="sm:col-span-12 space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Description / Notes</Label>
                  <Input
                    placeholder="e.g. Standard rate card for private hospitals, diagnostic centers, and clinics"
                    value={newBookDesc}
                    onChange={(e) => setNewBookDesc(e.target.value)}
                    className="h-9 text-xs bg-background rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" size="sm" variant="ghost" onClick={() => setIsCreatingBook(false)} className="h-8 text-xs rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="h-8 text-xs font-bold bg-primary text-primary-foreground gap-1.5 rounded-xl shadow-xs">
                  <Check className="w-3.5 h-3.5" /> Save Rate Card
                </Button>
              </div>
            </form>
          )}

          {/* 2-Column Responsive Workspace */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Rail: Price Books List */}
            <div className="md:col-span-4 space-y-2.5">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Rate Cards ({books.length})
                </span>
                <span className="text-[10px] text-muted-foreground">Select to view items</span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                {books.map((book) => {
                  const isSelected = book.id === selectedBookId
                  return (
                    <div
                      key={book.id}
                      onClick={() => setSelectedBookId(book.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'bg-primary/10 border-primary shadow-xs ring-1 ring-primary/30 font-semibold'
                          : 'bg-card hover:bg-muted/30 border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-foreground truncate">{book.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          {isSelected && (
                            <Badge className="text-[9px] font-mono font-bold bg-primary text-primary-foreground">
                              ACTIVE
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteBook(book.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            title="Delete Book"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-[11px] text-muted-foreground font-normal line-clamp-2">
                        {book.description}
                      </p>

                      <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-muted-foreground">
                        <span className="bg-muted px-2 py-0.5 rounded-md font-bold">{book.products.length} Products</span>
                        <span>•</span>
                        <span>Max Discount: <strong className="text-primary">{book.discountCapPercent}%</strong></span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Products in Selected Book */}
            <div className="md:col-span-8 space-y-4 border rounded-2xl p-4 bg-muted/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
                <div>
                  <h4 className="font-bold text-sm text-foreground">{selectedBook?.name}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{selectedBook?.products.length || 0} configured service items</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUseBook(selectedBook)}
                  className="h-8 text-xs font-bold text-primary border-primary/30 hover:bg-primary/10 gap-1.5 rounded-xl cursor-pointer self-start sm:self-auto"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Use in Quotation
                </Button>
              </div>

              {/* Add Product Form */}
              <form onSubmit={handleAddProduct} className="p-3 rounded-xl bg-card border shadow-2xs space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-primary" /> Add Item to {selectedBook?.name}
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Product / Service name (e.g. WhatsApp Bot Setup)..."
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="h-8 text-xs flex-1 bg-background rounded-lg"
                    required
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="₹ Price"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="h-8 text-xs w-28 bg-background font-mono rounded-lg"
                      required
                    />
                    <Button type="submit" size="sm" className="h-8 text-xs font-bold bg-primary text-primary-foreground gap-1 shrink-0 rounded-lg shadow-xs">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </Button>
                  </div>
                </div>
              </form>

              {/* Product Items Table */}
              <div className="border rounded-xl overflow-hidden bg-card shadow-2xs max-h-[220px] overflow-y-auto custom-scrollbar">
                {selectedBook?.products && selectedBook.products.length > 0 ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-muted/40 text-[10px] uppercase font-bold text-muted-foreground border-b">
                      <tr>
                        <th className="p-2.5">ITEM NAME</th>
                        <th className="p-2.5 text-right font-mono">UNIT PRICE (₹)</th>
                        <th className="p-2.5 text-center w-12">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-mono">
                      {selectedBook.products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-2.5 font-sans font-medium text-foreground text-xs">{prod.name}</td>
                          <td className="p-2.5 text-right font-bold text-emerald-600">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2.5 text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
                    <Package className="w-6 h-6 text-muted-foreground mx-auto opacity-50" />
                    <p className="font-semibold text-foreground">No products in this rate card</p>
                    <p className="text-[11px]">Use the input above to add items and pricing.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/20 flex flex-row justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Rate cards automatically enforce authorized discounts & 18% GST calculation</span>
          </div>
          <Button 
            size="sm" 
            onClick={() => onOpenChange(false)} 
            className="h-8 px-5 text-xs font-bold rounded-xl cursor-pointer bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
