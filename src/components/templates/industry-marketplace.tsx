"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Stethoscope, Utensils, GraduationCap, ArrowRight } from "lucide-react"

/**
 * PRD v12.0 Industry Templates Marketplace Component
 * Pre-packaged industry blueprints for Real Estate, Healthcare, Restaurants, Education, Ecommerce.
 */
export function IndustryMarketplace() {
  const packs = [
    { title: "Real Estate Property Accelerator", icon: Building2, industry: "Real Estate" },
    { title: "Healthcare Doctor Consultation Pack", icon: Stethoscope, industry: "Healthcare" },
    { title: "Restaurant Local Food Delivery Pack", icon: Utensils, industry: "Food & Dining" },
    { title: "School & Academy Admissions Pack", icon: GraduationCap, industry: "Education" }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
            Industry Blueprint Marketplace
          </CardTitle>
          <CardDescription className="text-[10px]">
            Pre-packaged industry pipelines, campaign blueprints, AI prompts & automations
          </CardDescription>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {packs.length} Industry Packs Available
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5">
        {packs.map(p => {
          const Icon = p.icon
          return (
            <div key={p.title} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-foreground text-xs">{p.title}</span>
                  <p className="text-[10px] font-mono text-muted-foreground">Industry: {p.industry}</p>
                </div>
              </div>
              <Button size="sm" className="h-7 text-[10px] font-bold bg-primary text-primary-foreground gap-1">
                Apply Pack <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
