"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Folder, Search, FileText, Download } from "lucide-react"

/**
 * PRD v14.0 Module 7 — Document Center
 * Manage proposals, quotes, invoices, agreements, NDAs, POs, GST, PAN with AI Search.
 */
export function DocumentCenter({ docs = [] }: { docs?: any[] }) {
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
          {docs.length} VAULT FILES
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5 font-mono">
        {docs.length > 0 ? (
          docs.map(d => (
            <div key={d.name} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <span className="font-bold text-foreground text-xs">{d.name}</span>
                <p className="text-[10px] text-muted-foreground">Category: {d.category} • Uploaded: {d.date}</p>
              </div>
              <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
                PDF
              </Badge>
            </div>
          ))
        ) : (
          <div className="py-6 px-4 text-center border rounded-xl bg-muted/10 space-y-1.5">
            <Folder className="w-5 h-5 text-muted-foreground mx-auto opacity-60" />
            <p className="font-bold text-foreground text-xs">Document Vault is Empty</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Generated proposals, contracts, invoices, and legal documents will be indexed here automatically with AI search.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
