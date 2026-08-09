"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from "lucide-react"

export function AIInsightsPanel() {
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch("/api/meta/ai/insights")
        const data = await res.json()
        if (data.success && data.insights) {
          setInsights(data.insights)
        }
      } catch (err) {
        console.error("Failed to fetch AI insights", err)
      } finally {
        setLoading(false)
      }
    }
    fetchInsights()
  }, [])

  const getIconForType = (type: string) => {
    switch (type) {
      case 'opportunity': return { icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' }
      case 'warning': return { icon: AlertTriangle, color: 'text-amber-500', bgColor: 'bg-amber-500/10' }
      case 'suggestion': return { icon: Lightbulb, color: 'text-blue-500', bgColor: 'bg-blue-500/10' }
      default: return { icon: Lightbulb, color: 'text-primary', bgColor: 'bg-primary/10' }
    }
  }

  return (
    <Card className="border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" /> AI Autonomous Optimization Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : insights.length > 0 ? (
          insights.map((item, idx) => {
            const { icon: Icon, color, bgColor } = getIconForType(item.type)
            return (
              <div key={idx} className="p-4 rounded-xl border bg-muted/20 flex items-start gap-4">
                <div className={`p-2.5 rounded-lg shrink-0 ${bgColor}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center p-6 text-muted-foreground text-sm">
            No actionable insights found for your campaigns at this time. Check back later.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

