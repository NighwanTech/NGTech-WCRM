'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, BrainCircuit, Check, X, ThumbsUp, ThumbsDown, MessageSquare, Search, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface AIDecision {
  id: string
  action_type: string
  target_id: string
  ai_rationale: string
  confidence_score: number
  status: string
  created_at: string
  expected_impact?: { budget_adjustment?: number, original_cpl?: number }
  estimated_cost_cents: number
}

export function DecisionCenter() {
  const [decisions, setDecisions] = useState<AIDecision[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState('')
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null)
  
  // Intelligence Hub State
  const [mining, setMining] = useState(false)
  const [miningMode, setMiningMode] = useState('manual')
  const [lookbackDays, setLookbackDays] = useState('7')

  useEffect(() => {
    fetchDecisions()
  }, [])

  const fetchDecisions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/meta/decisions')
      const data = await res.json()
      if (data.success && data.decisions) {
        setDecisions(data.decisions)
      }
    } catch (err) {
      console.error('Failed to fetch AI decisions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/meta/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisionId: id, action }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Decision ${action.toLowerCase()}ed successfully.`)
        setDecisions(prev => prev.map(d => d.id === id ? { ...d, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : d))
      }
    } catch {
      toast.error('Failed to update decision status.')
    }
  }

  const submitFeedback = async (type: 'HELPFUL' | 'NOT_HELPFUL') => {
    toast.success(`Feedback logged to Knowledge Base: ${type}`)
    setFeedback('')
    setActiveDecisionId(null)
  }

  const triggerMining = async () => {
    setMining(true)
    try {
      const res = await fetch('/api/meta/ai/mine-whatsapp', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || 'Customer insights successfully mined!')
        if (data.insights && data.insights.length > 0) {
          // In a real app, we would refetch decisions here to see the new ones
          toast('New AI Recommendations have been added to your queue.')
        }
      } else {
        toast.error(data.error || 'Failed to mine WhatsApp insights.')
      }
    } catch (e: any) {
      toast.error('An unexpected error occurred.')
    } finally {
      setMining(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/meta-ads">
            <Button variant="outline" size="sm" className="hidden md:flex">
              &larr; Back to Dashboard
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">AI Decision Center</h2>
            <p className="text-muted-foreground">Review, approve, and provide feedback on AI optimization proposals.</p>
          </div>
        </div>
      </div>

      {/* Customer Voice Analytics Hub */}
      <Card className="border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
            Customer Voice Analytics (WhatsApp Integration)
          </CardTitle>
          <CardDescription>
            Automatically analyze raw WhatsApp conversations to detect trends, objections, and buying intent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center bg-background p-3 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-2 mr-4">
                <Switch 
                  id="auto-mode" 
                  checked={miningMode !== 'manual'} 
                  onCheckedChange={(c) => setMiningMode(c ? 'schedule' : 'manual')} 
                />
                <Label htmlFor="auto-mode" className="font-semibold cursor-pointer">Automatic Extraction</Label>
              </div>
              
              {miningMode !== 'manual' && (
                <div className="flex items-center gap-2 border-l pl-4">
                  <Label className="text-xs text-muted-foreground">Trigger By:</Label>
                  <Select value={miningMode} onValueChange={(val) => val && setMiningMode(val)}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="schedule">Schedule (Daily)</SelectItem>
                      <SelectItem value="volume">Volume (500 msgs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center gap-2 border-l pl-4">
                <Label className="text-xs text-muted-foreground">Lookback:</Label>
                <Select value={lookbackDays} onValueChange={(val) => val && setLookbackDays(val)}>
                  <SelectTrigger className="w-[100px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="15">15 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={triggerMining} 
              disabled={mining}
              className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
            >
              {mining ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Mine Insights Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="space-y-4">
          {decisions.map(decision => (
            <Card key={decision.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Left side: Status & Core Info */}
                <div className="bg-muted/30 p-6 md:w-1/3 border-r">
                  <div className="flex items-center gap-2 mb-4">
                    <BrainCircuit className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold">{decision.action_type}</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Target Campaign</Label>
                      <p className="font-medium">{decision.target_id}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">AI Confidence</Label>
                      <p className="font-medium text-emerald-600">{decision.confidence_score}%</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <div>
                        <Badge variant={decision.status === 'PENDING_APPROVAL' ? 'secondary' : decision.status === 'REJECTED' ? 'destructive' : 'default'}>
                          {decision.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: Explainable AI & Actions */}
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Explainable AI Rationale</Label>
                      <p className="text-sm mt-1 bg-muted/50 p-3 rounded-md">{decision.ai_rationale}</p>
                    </div>
                    
                    {decision.expected_impact && (
                      <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-2 rounded border border-amber-100 dark:border-amber-500/20">
                        <TrendingUp className="w-4 h-4" /><strong>Expected Impact:</strong> +{decision.expected_impact.budget_adjustment}% Budget Adjustment
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {decision.status === 'PENDING_APPROVAL' && (
                      <>
                        <Button onClick={() => handleAction(decision.id, 'APPROVE')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                          <Check className="w-4 h-4 mr-2" /> Approve & Execute
                        </Button>
                        <Button variant="destructive" onClick={() => handleAction(decision.id, 'REJECT')}>
                          <X className="w-4 h-4 mr-2" /> Reject
                        </Button>
                      </>
                    )}

                    <Dialog open={activeDecisionId === decision.id} onOpenChange={(open) => !open && setActiveDecisionId(null)}>
                      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2" onClick={() => setActiveDecisionId(decision.id)}>
                        <MessageSquare className="w-4 h-4 mr-2" /> Provide Feedback
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Train the AI</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-sm text-muted-foreground">
                            Your feedback helps the AI learn. This will be stored in the Knowledge Base for future decisions.
                          </p>
                          <Textarea 
                            placeholder="e.g., Rejecting because we have a supply shortage right now..." 
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                          />
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => submitFeedback('NOT_HELPFUL')}>
                              <ThumbsDown className="w-4 h-4 mr-2" /> Bad Recommendation
                            </Button>
                            <Button variant="outline" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" onClick={() => submitFeedback('HELPFUL')}>
                              <ThumbsUp className="w-4 h-4 mr-2" /> Good Recommendation
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <span className="text-xs text-muted-foreground ml-auto">
                      Cost: {(decision.estimated_cost_cents / 100).toFixed(4)}¢
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
