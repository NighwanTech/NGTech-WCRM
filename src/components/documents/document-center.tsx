"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Folder, Search, FileText, Download } from "lucide-react"

/**
 * PRD v14.0 Module 7 — Document Center
 * Manage proposals, quotes, invoices, agreements, NDAs, POs, GST, PAN with AI Search.
 */
export function DocumentCenter() {
  const docs = [
    { name: "Patna_Complex_Proposal_v3.pdf", category: "PROPOSAL", date: "Today" },
    { name: "Apollo_Clinic_Quotation_QT991.pdf", category: "QUOTATION", date: "Yesterday" },
    { name: "Company_GST_Registration.pdf", category: "LEGAL", date: "2026-01-15" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Document Intelligence & Vault
            </CardTitle>
            <CardDescription className="text-[10px]">
              AI natural language search across proposals, quotations, invoices & contracts
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {docs.length} Vault Files
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {docs.map(d => (
          <div key={d.name} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="font-bold text-foreground text-xs">{d.name}</span>
              <p className="text-[10px] text-muted-foreground">Category: {d.category} • Uploaded: {d.date}</p>
            </div>
            <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
              PDF
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
