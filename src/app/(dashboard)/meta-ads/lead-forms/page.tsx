"use client"

import { LeadFormMapper } from "@/components/meta-ads/lead-form-mapper"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LeadFormsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/meta-ads">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Facebook Lead Form Mapping</h1>
          <p className="text-muted-foreground text-sm">
            Automatically assign incoming Facebook & Instagram lead forms to your CRM Pipelines and auto-reply flows.
          </p>
        </div>
      </div>

      <LeadFormMapper />
    </div>
  )
}
