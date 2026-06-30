import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Trophy, Search, Star, MessageSquare, Timer, CheckCircle, Shield } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AgentPerformance {
  userId: string
  fullName: string
  email: string
  avatarUrl: string | null
  role: string
  conversationsHandled: number
  avgResponseTimeMin: number | null
  avgCsat: number | null
  resolutionRate: number
  slaComplianceRate?: number
  messagesSent: number
  score: number
}

interface AgentScorecardProps {
  data: AgentPerformance[] | null
  loading: boolean
}

export function AgentScorecard({ data, loading }: AgentScorecardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortedData, setSortedData] = useState<AgentPerformance[]>([])
  const [sortBy, setSortBy] = useState<'score' | 'csat' | 'time' | 'resolution' | 'sla'>('score')

  useEffect(() => {
    if (!data) return
    let filtered = data.filter(
      (agent) =>
        agent.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    filtered.sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score
      if (sortBy === 'csat') return (b.avgCsat || 0) - (a.avgCsat || 0)
      if (sortBy === 'time') return (a.avgResponseTimeMin || 9999) - (b.avgResponseTimeMin || 9999)
      if (sortBy === 'resolution') return b.resolutionRate - a.resolutionRate
      if (sortBy === 'sla') return (b.slaComplianceRate ?? 100) - (a.slaComplianceRate ?? 100)
      return 0
    })

    setSortedData(filtered)
  }, [data, searchQuery, sortBy])

  const getCsatColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground'
    if (score >= 4.0) return 'text-green-500 fill-green-500'
    if (score >= 3.0) return 'text-amber-500 fill-amber-500'
    return 'text-red-500 fill-red-500'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <Card className="w-full border-border bg-card">
      <CardHeader className="space-y-4 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Trophy className="h-5 w-5 text-amber-500" />
            Agent Performance Scorecard
          </CardTitle>
          <CardDescription>
            Evaluate response times, resolution rates, and client satisfaction metrics.
          </CardDescription>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5 self-start sm:self-auto">
            <button
              onClick={() => setSortBy('score')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                sortBy === 'score' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Top Score
            </button>
            <button
              onClick={() => setSortBy('csat')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                sortBy === 'csat' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              CSAT
            </button>
            <button
              onClick={() => setSortBy('time')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                sortBy === 'time' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Response Time
            </button>
            <button
              onClick={() => setSortBy('sla')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                sortBy === 'sla' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              SLA
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            No agent data available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-medium">
                  <th className="py-3 pl-2 min-w-[220px]">Agent</th>
                  <th className="py-3 min-w-[100px]">Conversations</th>
                  <th className="py-3 min-w-[120px]">Avg Response</th>
                  <th className="py-3 min-w-[80px]">CSAT</th>
                  <th className="py-3 min-w-[150px]">Resolution Rate</th>
                  <th className="py-3 min-w-[140px]">SLA Compliance</th>
                  <th className="py-3 min-w-[100px]">Messages</th>
                  <th className="py-3 pr-2 text-right min-w-[150px]">Performance Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedData.map((agent, index) => (
                  <tr key={agent.userId} className="group hover:bg-muted/30 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-9 w-9 border border-border">
                            <AvatarImage src={agent.avatarUrl || undefined} />
                            <AvatarFallback className="bg-muted text-xs font-semibold">
                              {agent.fullName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {index === 0 && searchQuery === '' && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-amber-950">
                              1
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            {agent.fullName}
                            {agent.role === 'owner' || agent.role === 'admin' ? (
                              <span title={agent.role}>
                                <Shield className="h-3 w-3 text-primary fill-primary/20" />
                              </span>
                            ) : null}
                          </div>
                          <div className="text-xs text-muted-foreground">{agent.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-medium text-foreground tabular-nums">
                      {agent.conversationsHandled}
                    </td>
                    <td className="py-3 text-foreground tabular-nums">
                      {agent.avgResponseTimeMin !== null ? (
                        <span className="flex items-center gap-1">
                          <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                          {agent.avgResponseTimeMin}m
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3">
                      {agent.avgCsat !== null ? (
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <Star className={`h-4 w-4 ${getCsatColor(agent.avgCsat)}`} />
                          {agent.avgCsat}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-medium">{agent.resolutionRate}%</span>
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${agent.resolutionRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-medium">{agent.slaComplianceRate ?? 100}%</span>
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full ${
                              (agent.slaComplianceRate ?? 100) >= 90
                                ? 'bg-green-500'
                                : (agent.slaComplianceRate ?? 100) >= 75
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${agent.slaComplianceRate ?? 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground tabular-nums">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {agent.messagesSent}
                      </div>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <div className="inline-flex flex-col items-end gap-1.5">
                        <span className="font-bold text-foreground tabular-nums">{agent.score}/100</span>
                        <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full ${getScoreColor(agent.score)}`}
                            style={{ width: `${agent.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
