'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BrainCircuit, FlaskConical, Play, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { MetaAdsHeader } from './meta-ads-header'

export function ExperimentsLabView() {
  const [running, setRunning] = useState(false)

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      <MetaAdsHeader
        title="AI Experiment Lab"
        description="Automated A/B & Multivariate testing across Headlines, Creatives, Audiences, and Budget Allocation."
        icon={FlaskConical}
        breadcrumbs={[{ label: 'Experiment Lab' }]}
        actions={
          <Button size="sm" onClick={() => toast.success('New A/B Test initialized!')} className="gap-2 font-bold">
            <FlaskConical className="w-4 h-4" /> Create A/B Test
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-[10px]">
              Active Experiment
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">Confidence: 96%</span>
          </div>
          <h3 className="font-bold text-sm text-foreground">Headline A/B Split Test: WhatsApp Direct vs Free Trial</h3>
          <p className="text-xs text-muted-foreground">
            AI evaluated Variant A (WhatsApp Direct CTA) vs Variant B (Free Trial CTA). Variant A yields 34% lower Cost per Conversation.
          </p>
          <div className="pt-2 border-t flex justify-end">
            <Button size="sm" variant="outline" onClick={() => toast.success('Variant A declared winner & scaled on Meta!')} className="text-xs font-bold gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Auto-Scale Winner
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
