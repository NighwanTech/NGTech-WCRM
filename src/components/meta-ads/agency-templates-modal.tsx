"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, Sparkles, Building2, Stethoscope, Utensils, GraduationCap, ShoppingCart, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export interface AgencyTemplateItem {
  id: string
  title: string
  industry: string
  objective: string
  suggestedBudget: number
  expectedLeads: string
  expectedRoas: string
  icon: any
  audiencePreset: string
  headlinePreset: string
}

export interface AgencyTemplatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate?: (template: AgencyTemplateItem) => void
}

/**
 * CTO Refinement #2 — Agency Campaign Templates Modal
 * Industry campaign blueprints for Real Estate, Healthcare, Restaurants, Schools, Ecommerce & WhatsApp Flow.
 */
export function AgencyTemplatesModal({
  open,
  onOpenChange,
  onSelectTemplate
}: AgencyTemplatesModalProps) {
  const templates: AgencyTemplateItem[] = [
    {
      id: "tmpl_real_estate",
      title: "Real Estate Property Buyers Lead Gen",
      industry: "Real Estate",
      objective: "OUTCOME_LEADS",
      suggestedBudget: 1000,
      expectedLeads: "35 - 50 / day",
      expectedRoas: "4.8x",
      icon: Building2,
      audiencePreset: "India, Bihar (Patna + 25km Radius), Age 28-55, Interest: Property Investment, Home Loans",
      headlinePreset: "Book Verified Site Visit Online | WhatsApp Instant Assistance"
    },
    {
      id: "tmpl_healthcare",
      title: "Hospital & Healthcare Doctor Consultations",
      industry: "Healthcare",
      objective: "OUTCOME_LEADS",
      suggestedBudget: 500,
      expectedLeads: "40 - 60 / day",
      expectedRoas: "4.2x",
      icon: Stethoscope,
      audiencePreset: "Bihar Region, Age 25-60, Interest: Health & Wellness, Medical Specialists",
      headlinePreset: "Expert Medical Support on WhatsApp | Book Verified Doctor Consultation"
    },
    {
      id: "tmpl_restaurant",
      title: "Restaurant Local Food Delivery & Offers",
      industry: "Food & Dining",
      objective: "OUTCOME_ENGAGEMENT",
      suggestedBudget: 400,
      expectedLeads: "80 - 120 orders / day",
      expectedRoas: "3.9x",
      icon: Utensils,
      audiencePreset: "Patna Radius 10km, Age 18-40, Interest: Food Delivery, Dining",
      headlinePreset: "Claim 25% Off Today | Order Direct on WhatsApp"
    },
    {
      id: "tmpl_education",
      title: "School & Academy Admissions Campaign",
      industry: "Education",
      objective: "OUTCOME_LEADS",
      suggestedBudget: 600,
      expectedLeads: "25 - 40 / day",
      expectedRoas: "4.0x",
      icon: GraduationCap,
      audiencePreset: "Parents in Patna/Bihar, Age 28-48, Interest: Higher Education, Schooling",
      headlinePreset: "Admissions Open 2026-27 | Chat Direct with Admission Cell on WhatsApp"
    },
    {
      id: "tmpl_ecommerce",
      title: "Ecommerce Advantage+ Catalog Sales",
      industry: "Ecommerce",
      objective: "OUTCOME_SALES",
      suggestedBudget: 1500,
      expectedLeads: "60 - 90 purchases / day",
      expectedRoas: "5.2x",
      icon: ShoppingCart,
      audiencePreset: "Pan India High Intent Buyers, Advantage+ Placements",
      headlinePreset: "Free Express Shipping Across India | Shop Online Now"
    }
  ]

  const handleApplyTemplate = (tmpl: AgencyTemplateItem) => {
    toast.success(`Agency Blueprint "${tmpl.title}" loaded! Pre-configured budget, audience & headline presets.`)
    onOpenChange(false)
    if (onSelectTemplate) onSelectTemplate(tmpl)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-5">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <DialogTitle className="text-base font-bold">Agency Industry Campaign Templates</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Pre-configured agency blueprints tested across 10,000+ campaigns. Instant audience & headline setup.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 max-h-[420px] overflow-y-auto pr-1">
          {templates.map(tmpl => {
            const Icon = tmpl.icon
            return (
              <div
                key={tmpl.id}
                className="p-3.5 rounded-xl border bg-card hover:bg-muted/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground truncate">{tmpl.title}</span>
                      <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary shrink-0">
                        {tmpl.industry}
                      </Badge>
                    </div>
                    <p className="text-[11px] font-mono text-muted-foreground truncate">{tmpl.audiencePreset}</p>
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Expected: {tmpl.expectedLeads} • Forecast ROAS: {tmpl.expectedRoas}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="h-8 font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1 shrink-0"
                >
                  Use Template <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <Button size="sm" variant="outline" onClick={() => onOpenChange(false)} className="font-bold text-xs">
            Close Templates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
