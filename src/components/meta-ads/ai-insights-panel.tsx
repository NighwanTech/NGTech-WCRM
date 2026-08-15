"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from "lucide-react"

export function AIInsightsPanel() {
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [applyingId, setApplyingId] = useState<string | null>(null)

  const fetchInsights = async () => {
    try {
      const res = await fetch("/api/meta/v1/ai/recommendations")
      const data = await res.json()
      if (data.success && data.recommendations) {
        setInsights(data.recommendations)
      }
    } catch (err) {
      console.error("Failed to fetch AI recommendations", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  const handleApplyRecommendation = async (recId: string) => {
    setApplyingId(recId)
    try {
      await fetch('/api/meta/v1/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPLY', recommendationId: recId })
      })
      await fetchInsights()
    } catch (err) {
      console.error("Failed to apply recommendation", err)
    } finally {
      setApplyingId(null)
    }
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'HIGH_CPL': return { icon: AlertTriangle, color: 'text-amber-500', bgColor: 'bg-amber-500/10' }
      case 'CREATIVE_FATIGUE': return { icon: AlertTriangle, color: 'text-rose-500', bgColor: 'bg-rose-500/10' }
      case 'LOW_CTR': return { icon: Lightbulb, color: 'text-blue-500', bgColor: 'bg-blue-500/10' }
      default: return { icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' }
    }
  }

  return (
    <Card className="border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" /> AI Autonomous Optimization Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : insights.length > 0 ? (
          insights.map((item) => {
            const { icon: Icon, color, bgColor } = getIconForType(item.type)
            const isApplied = item.status === 'APPLIED'
            return (
              <div key={item.id} className="p-4 rounded-xl border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-lg shrink-0 ${bgColor}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">{item.confidence_score}% Confidence</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">Human-on-the-Loop</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">Rollback Ready</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    <span className="inline-block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{item.expected_improvement}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                  {isApplied ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">Applied ✅</span>
                  ) : (
                    <button
                      onClick={() => handleApplyRecommendation(item.id)}
                      disabled={applyingId === item.id}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {applyingId === item.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Apply Optimization
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-6 text-center text-xs text-muted-foreground border rounded-xl bg-muted/10">
            No pending optimization warnings. All campaigns operating at peak efficiency!
          </div>
        )}
      </CardContent>
    </Card>
  )
}

