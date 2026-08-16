"use client"

import { MetaAdsHeader } from "@/components/meta-ads/meta-ads-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Sparkles, LayoutList, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ReviewIndexPage() {
  return (
    <div className="w-full max-w-full space-y-6">
      <MetaAdsHeader
        title="Strategy Review"
        description="Review and approve AI-generated campaign strategies before publishing."
        icon={FileText}
        breadcrumbs={[{ label: "Strategy Review" }]}
      />

      <Card className="border bg-card shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-20 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>

          <div className="text-center space-y-2 max-w-md">
            <h2 className="text-xl font-bold text-foreground">No Strategy Selected</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Select a campaign strategy from Audience Studio or create a new one with the AI Wizard to review it here.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/meta-ads/create">
              <Button variant="default" className="gap-2 text-xs font-bold h-9">
                <Sparkles className="w-3.5 h-3.5" />
                Create with AI Wizard
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <Link href="/meta-ads">
              <Button variant="outline" className="gap-2 text-xs font-bold h-9">
                <LayoutList className="w-3.5 h-3.5" />
                View Campaign Drafts
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
