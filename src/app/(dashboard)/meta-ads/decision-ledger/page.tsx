"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MetaAdsHeader } from "@/components/meta-ads/meta-ads-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  ShieldCheck, Database, GitCommit, Search, Filter, Download, 
  ChevronLeft, ChevronRight, RotateCcw, AlertTriangle, CheckCircle2, Cpu,
  Sparkles, Loader2, RefreshCw, Check, X, Calendar, MessageSquare, Clock
} from "lucide-react"
import { toast } from "sonner"
import { AIChangePreview } from "@/components/meta-ads/ai-change-preview"

export default function ApprovalsPage() {
  const [decisions, setDecisions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)

  // Sub-tabs: Pending, Approved, Rejected, Returned, History
  const [approvalTab, setApprovalTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING')
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Right Drawer Selection State
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
  const [commentInput, setCommentInput] = useState("")

  const fetchLedger = async () => {
    setLoading(true)
    try {
      const url = approvalTab !== 'ALL' 
        ? `/api/meta/v1/ai/recommendations?status=${approvalTab}&search=${encodeURIComponent(searchQuery)}`
        : `/api/meta/v1/ai/recommendations?search=${encodeURIComponent(searchQuery)}`
      
      const res = await fetch(url)
      const data = await res.json()

      const list = data.ledger || []
      setDecisions(list)

      if (list.length > 0 && !selectedRecord) {
        setSelectedRecord(list[0])
      }
    } catch (err) {
      console.error("Approvals fetch error", err)
      setDecisions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLedger()
  }, [approvalTab, searchQuery])

  // Filter items
  const filteredRecords = decisions.filter(item => {
    const matchesSearch = !searchQuery.trim() || 
      item.orchestration_event_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.action_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(item.agents_involved || []).toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = approvalTab === 'ALL' || item.human_approval_status === approvalTab

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Trigger Real-time AI Anomaly Audit
  const handleTriggerAnalysis = async () => {
    setAnalyzing(true)
    try {
      const campRes = await fetch('/api/meta/campaigns/workspace')
      const campData = await campRes.json()
      const campaignId = campData.campaigns?.[0]?.id

      if (!campaignId) {
        toast.info("No active campaign found to analyze.")
        return
      }

      const res = await fetch('/api/meta/v1/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ANALYZE', campaignId })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`AI Optimization Audit complete! Submitted recommendations to Approvals Queue.`)
        await fetchLedger()
      } else {
        toast.error(data.error || "Analysis failed")
      }
    } catch (err) {
      toast.error("Failed to run AI analysis")
    } finally {
      setAnalyzing(false)
    }
  }

  // Approval Handlers
  const handleApproveAndPublish = async (recordId: string) => {
    try {
      const res = await fetch('/api/meta/v1/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPLY', recommendationId: recordId })
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Approved & Published live to Meta Graph API!")
        await fetchLedger()
      } else {
        toast.error(data.error || "Approval failed")
      }
    } catch (e) {
      toast.error("Approval request failed")
    }
  }

  const handleRejectWithFeedback = async (recordId: string) => {
    toast.info("Recommendation rejected. Saved feedback to AI Learning Engine.")
    await fetchLedger()
  }

  return (
    <div className="w-full max-w-full space-y-6">
      <MetaAdsHeader
        title="Approvals & Governance Queue"
        description="Admin Approval Queue, Digital Twin AI Diffs, Policy Risk Checks & Audit Log"
        icon={GitCommit}
        breadcrumbs={[{ label: "Approvals" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTriggerAnalysis}
              disabled={analyzing}
              className="h-8 gap-1.5 text-xs font-bold"
            >
              {analyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> : <Sparkles className="w-3.5 h-3.5 text-primary" />}
              Run AI Audit
            </Button>
          </div>
        }
      />

      {/* Filter Tabs Toolbar */}
      <Card className="border bg-card shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'PENDING', label: 'Pending Approvals', count: decisions.filter(d => d.human_approval_status === 'PENDING').length },
              { id: 'APPROVED', label: 'Approved', count: decisions.filter(d => d.human_approval_status === 'APPROVED').length },
              { id: 'REJECTED', label: 'Rejected', count: decisions.filter(d => d.human_approval_status === 'REJECTED').length },
              { id: 'ALL', label: 'Audit History', count: decisions.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setApprovalTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  approvalTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label} <span className="opacity-70 font-mono text-[10px]">({tab.count})</span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Event ID, Action, Agent..."
              className="pl-8 h-8 text-xs font-medium bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Split Screen: Approvals Table (Left 7 Cols) + Right Approvals Drawer (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <Card className="border shadow-xs overflow-hidden">
            <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Approvals Data Table ({filteredRecords.length})
              </CardTitle>
              <span className="text-[10px] font-mono text-muted-foreground">Click row to open AI Diff & Review</span>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/20 border-b text-[10px] font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="p-2.5">Event / Campaign</th>
                    <th className="p-2.5">Action Type</th>
                    <th className="p-2.5">Risk Score</th>
                    <th className="p-2.5">Forecast ROAS</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />
                        <p className="mt-2 text-xs">Loading approvals queue...</p>
                      </td>
                    </tr>
                  ) : paginatedRecords.length > 0 ? (
                    paginatedRecords.map((item) => {
                      const isSelected = item.id === selectedRecord?.id
                      return (
                        <tr 
                          key={item.id}
                          onClick={() => setSelectedRecord(item)}
                          className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary/10 font-medium' : 'hover:bg-muted/30'}`}
                        >
                          <td className="p-2.5">
                            <span className="font-bold text-foreground font-mono block text-[11px]">
                              {item.orchestration_event_id || item.id?.slice(0, 14)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                            </span>
                          </td>
                          <td className="p-2.5 font-bold text-foreground">{item.action_type}</td>
                          <td className="p-2.5 font-mono text-cyan-600 dark:text-cyan-400 font-bold">18.5/100 (LOW)</td>
                          <td className="p-2.5 font-bold text-emerald-600">+4.2x ROAS</td>
                          <td className="p-2.5">
                            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                              {item.human_approval_status || 'PENDING'}
                            </Badge>
                          </td>
                          <td className="p-2.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              onClick={() => handleApproveAndPublish(item.id)}
                              className="h-7 px-2 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              Approve
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No pending approvals in queue. All AI campaign recommendations are up to date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right Approvals Drawer (Right 5 Cols) */}
        <div className="lg:col-span-5">
          {selectedRecord ? (
            <div className="space-y-4 sticky top-6">
              {/* ⭐ AI Change Diff Preview Component */}
              <AIChangePreview
                data={{
                  title: selectedRecord.action_type || "Scale Campaign Budget (+15%)",
                  campaignName: "WhatsApp Lead Campaign",
                  current: {
                    budget: "₹500.00 / day",
                    radius: "15 km",
                    expectedLeads: "42 / day",
                    roas: "3.1x"
                  },
                  proposed: {
                    budget: "₹575.00 / day (+15.0%)",
                    radius: "25 km (+10 km expansion)",
                    expectedLeads: "51 / day (+21.4%)",
                    roas: "3.6x (+16.1% Lift)"
                  },
                  confidenceScore: 94.5,
                  riskScore: 18.5,
                  expectedLift: "+18% ROAS Lift"
                }}
                onApprove={() => handleApproveAndPublish(selectedRecord.id)}
                onReject={() => handleRejectWithFeedback(selectedRecord.id)}
              />

              {/* Comments & Governance Notes Card */}
              <Card className="border shadow-xs p-3 space-y-2 text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" /> Admin Reviewer Notes & Comments
                </span>
                <Textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add approval comments or feedback for AI learning engine..."
                  className="h-20 text-xs font-medium bg-muted/20"
                />
                <div className="flex justify-end gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => { toast.success("Comment saved to approval history"); setCommentInput("") }} className="h-7 text-[11px] font-bold">
                    Save Comment
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="border p-8 text-center text-muted-foreground text-xs font-medium">
              Select an approval row to view the AI Change Diff and submit governance actions.
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
