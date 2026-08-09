import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart, BarChart, TrendingUp, Users, DollarSign, Target, Zap } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PredictiveAnalyticsPage() {
  // Static mock data for Phase 6 visualization
  // In production, this would be fetched from /api/meta/ai/predictive-insights
  
  const leadScoring = [
    { name: 'Campaign A (Broad)', score: 85, trend: '+5%', cpl: '₹120' },
    { name: 'Campaign B (Lookalike)', score: 92, trend: '+12%', cpl: '₹85' },
    { name: 'Campaign C (Retargeting)', score: 64, trend: '-8%', cpl: '₹210' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/meta-ads">
            <Button variant="outline" size="sm" className="hidden md:flex">
              &larr; Back to Dashboard
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Executive Intelligence</h2>
            <p className="text-muted-foreground">AI-driven predictive analytics and cross-channel attribution.</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
          <Zap className="w-3 h-3 mr-1" /> AI Engine Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted ROI (30d)</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">285%</div>
            <p className="text-xs text-muted-foreground">+15% from previous month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Cost Per Acquisition</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹850</div>
            <p className="text-xs text-muted-foreground">Trending downwards (Good)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer LTV Forecast</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,400</div>
            <p className="text-xs text-muted-foreground">Based on historical CRM data</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creative Fatigue</CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">High Risk</div>
            <p className="text-xs text-muted-foreground">2 active ads need replacing</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Predictive Lead Quality Scoring</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {leadScoring.map((campaign, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{campaign.name}</span>
                  <span className="text-muted-foreground">Predicted Score: {campaign.score}/100</span>
                </div>
                <Progress value={campaign.score} className={campaign.score > 80 ? "bg-emerald-100 [&>div]:bg-emerald-500" : "bg-orange-100 [&>div]:bg-orange-500"} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Est. CPL: {campaign.cpl}</span>
                  <span className={campaign.trend.startsWith('+') ? 'text-emerald-500' : 'text-orange-500'}>
                    {campaign.trend} conversion rate
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Optimization Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-full">
                    <BarChart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Scale "Campaign B"</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on CRM closed-won data from the Knowledge Base, audiences in this campaign have a 40% higher Payback Period velocity. The AI predicts scaling budget by 20% will yield 15 more high-quality leads this week.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-orange-50/50 border-orange-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 text-orange-700 rounded-full">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-orange-900">Creative Refresh Needed</h4>
                    <p className="text-xs text-orange-700 mt-1">
                      "Summer Sale Image 1" has reached a frequency of 3.2. CTR has dropped by 45% in the last 3 days. AI recommends generating a new visual asset to avoid CPA spikes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
