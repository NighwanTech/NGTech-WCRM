import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, MessageSquare, HandHelping, Clock, Coins, RefreshCcw } from "lucide-react"

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-assistant/analytics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading analytics...</div>;
  }

  if (!metrics) {
    return <div className="p-8 text-center text-muted-foreground">Failed to load analytics.</div>;
  }

  const statCards = [
    { title: "Total AI Replies", value: metrics.totalReplies, icon: MessageSquare, desc: "Across all conversations" },
    { title: "Human Handoffs", value: metrics.humanHandoffs, icon: HandHelping, desc: "Escalated to agents" },
    { title: "Avg Response Time", value: `${metrics.avgResponseTime}ms`, icon: Clock, desc: "End-to-end latency" },
    { title: "Est. Cost", value: `$${metrics.totalCost.toFixed(4)}`, icon: Coins, desc: "API usage cost" },
    { title: "Avg Tokens / Reply", value: metrics.avgTokens, icon: Activity, desc: "Prompt + Completion" },
    { title: "Errors", value: metrics.errors, icon: RefreshCcw, desc: "Failed API requests", textClass: "text-red-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Analytics</CardTitle>
        <CardDescription>Real-time metrics from your production WhatsApp bot.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="p-4 border rounded-xl bg-card shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <Icon className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${stat.textClass || 'text-zinc-900'}`}>{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
           <Card className="shadow-none border bg-zinc-50/50">
             <CardHeader className="pb-2"><CardTitle className="text-sm">Provider Usage</CardTitle></CardHeader>
             <CardContent>
               {Object.keys(metrics.providerUsage || {}).length === 0 ? (
                 <p className="text-xs text-muted-foreground">No data available yet.</p>
               ) : (
                 <ul className="space-y-2 text-sm">
                   {Object.entries(metrics.providerUsage).map(([k,v]) => (
                     <li key={k} className="flex justify-between border-b pb-1">
                       <span className="capitalize font-medium">{k}</span>
                       <span>{v as number} requests</span>
                     </li>
                   ))}
                 </ul>
               )}
             </CardContent>
           </Card>
           
           <Card className="shadow-none border bg-zinc-50/50">
             <CardHeader className="pb-2"><CardTitle className="text-sm">Model Distribution</CardTitle></CardHeader>
             <CardContent>
               {Object.keys(metrics.modelUsage || {}).length === 0 ? (
                 <p className="text-xs text-muted-foreground">No data available yet.</p>
               ) : (
                 <ul className="space-y-2 text-sm">
                   {Object.entries(metrics.modelUsage).map(([k,v]) => (
                     <li key={k} className="flex justify-between border-b pb-1">
                       <span className="font-mono text-xs">{k}</span>
                       <span>{v as number}</span>
                     </li>
                   ))}
                 </ul>
               )}
             </CardContent>
           </Card>
        </div>
      </CardContent>
    </Card>
  )
}
