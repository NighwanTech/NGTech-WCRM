"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Building2, Stethoscope, GraduationCap, ArrowRight } from "lucide-react"

/**
 * PRD v14.0 Module 5 — Playbook Library
 * Industry Playbooks for Manufacturing, Education, Hospital, Real Estate, Retail, Automobile.
 */
export function PlaybookLibrary() {
  const playbooks = [
    { title: "Real Estate Property Sales Playbook", industry: "Real Estate", icon: Building2 },
    { title: "Healthcare Doctor Appointment Playbook", industry: "Healthcare", icon: Stethoscope },
    { title: "Academy Admissions Conversion Playbook", industry: "Education", icon: GraduationCap }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Sales Playbook Library & Script Engine
            </CardTitle>
            <CardDescription className="text-[10px]">
              AI adapts proposal templates, negotiation scripts & follow-up cadence by industry
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          {playbooks.length} Playbooks Active
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5">
        {playbooks.map(pb => {
          const Icon = pb.icon
          return (
            <div key={pb.title} className="p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-foreground text-xs">{pb.title}</span>
                  <p className="text-[10px] font-mono text-muted-foreground">Industry: {pb.industry}</p>
                </div>
              </div>
              <Button size="sm" className="h-7 text-[10px] font-bold bg-primary text-primary-foreground gap-1">
                Activate <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
