"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Sparkles, FileText, Check, Trash2 } from "lucide-react"
import { toast } from "sonner"

export interface KnowledgeDocumentItem {
  id: string
  title: string
  documentType: string
  contentText: string
  createdAt: string
}

/**
 * CTO Refinement #12 — Ad Account Knowledge Base Manager
 * Dedicated knowledge manager per Ad Account storing Products, Pricing, FAQs, Brand Voice & Sales Docs.
 */
export function AdAccountKnowledgeManager() {
  const [documents, setDocuments] = useState<KnowledgeDocumentItem[]>([
    {
      id: "doc_1",
      title: "Patna Real Estate Pricing & Offers 2026",
      documentType: "PRICING",
      contentText: "Verified residential plots starting at ₹25 Lakhs in Patna NCR. 10% instant booking discount.",
      createdAt: "Today at 10:00"
    },
    {
      id: "doc_2",
      title: "Healthcare Doctor Consultation FAQs",
      documentType: "FAQ",
      contentText: "Verified medical specialists available for instant WhatsApp consultation 9 AM - 8 PM daily.",
      createdAt: "Yesterday"
    }
  ])

  const [newTitle, setNewTitle] = useState("")
  const [newType, setNewType] = useState("PRODUCT_SPEC")
  const [newContent, setNewContent] = useState("")

  const handleAddDocument = () => {
    if (!newTitle || !newContent) {
      toast.error("Please provide both document title and content text.")
      return
    }

    const doc: KnowledgeDocumentItem = {
      id: `doc_${Date.now()}`,
      title: newTitle,
      documentType: newType,
      contentText: newContent,
      createdAt: "Just now"
    }

    setDocuments([doc, ...documents])
    setNewTitle("")
    setNewContent("")
    toast.success(`Knowledge Document "${doc.title}" added to Ad Account AI Brain!`)
  }

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Ad Account Knowledge Base Manager
            </CardTitle>
            <CardDescription className="text-[10px]">
              AI context brain storing products, pricing, FAQs, and brand guidelines
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {documents.length} Knowledge Docs Active
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Document Creation Form */}
        <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2.5">
          <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-primary" /> Add New Knowledge Base Document
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Document Title (e.g. Festival Offer Details)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="h-8 px-3 rounded-lg border bg-background text-xs"
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="h-8 px-2 rounded-lg border bg-background text-xs"
            >
              <option value="PRODUCT_SPEC">Product Specification</option>
              <option value="PRICING">Pricing & Discount Rules</option>
              <option value="FAQ">Frequently Asked Questions</option>
              <option value="BRAND_VOICE">Brand Voice & Guidelines</option>
            </select>
          </div>

          <textarea
            placeholder="Enter knowledge content text used by AI for automated customer replies & campaign generation..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full h-20 p-2.5 rounded-lg border bg-background text-xs resize-none"
          />

          <Button size="sm" onClick={handleAddDocument} className="h-8 font-bold text-xs bg-primary text-primary-foreground gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Save Knowledge Document
          </Button>
        </div>

        {/* Existing Documents List */}
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground truncate">{doc.title}</span>
                  <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
                    {doc.documentType}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{doc.contentText}</p>
                <span className="text-[9px] font-mono text-muted-foreground">{doc.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
