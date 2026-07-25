import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cpu, IndianRupee, Activity, Layers, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AIUsageSummary {
  summary: {
    totalRequests: number;
    totalTokens: number;
    totalPromptTokens: number;
    totalCompletionTokens: number;
    totalEstimatedCostUsd: number;
    totalEstimatedCostInr: number;
    exchangeRate: number;
  };
  providerBreakdown: Record<string, { requests: number; tokens: number; cost: number }>;
  modelBreakdown: Record<string, { requests: number; tokens: number; cost: number }>;
  recentLogs: Array<{
    id: string;
    provider: string;
    model: string;
    feature: string;
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    estimated_cost_usd: number;
    created_at: string;
  }>;
}

export function AIUsageDashboardCard() {
  const [data, setData] = useState<AIUsageSummary | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchUsage() {
    try {
      setLoading(true);
      const res = await fetch('/api/ai-assistant/usage');
      if (!res.ok) throw new Error('Failed to load usage data');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      toast.error('Could not load AI usage statistics');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsage();
  }, []);

  const summary = data?.summary || {
    totalRequests: 0,
    totalTokens: 0,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalEstimatedCostUsd: 0,
    totalEstimatedCostInr: 0,
    exchangeRate: 86.0,
  };

  // Utility helper for INR formatting
  const formatCostINR = (usdAmount: number) => {
    const inr = usdAmount * (summary.exchangeRate || 86.0);
    if (inr < 0.01 && inr > 0) return `₹${inr.toFixed(4)}`;
    return `₹${inr.toFixed(2)}`;
  };

  return (
    <Card className="mt-6 border-primary/20 bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            AI Usage & Analytics Dashboard (INR ₹)
          </CardTitle>
          <CardDescription>
            Real-time token consumption, request count, and estimated cost in Indian Rupees (₹).
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsage}
          disabled={loading}
          className="gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metric Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center justify-between text-muted-foreground mb-1 text-xs">
              <span>Total Tokens Used</span>
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold font-mono">
              {summary.totalTokens.toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              In: {summary.totalPromptTokens.toLocaleString()} | Out: {summary.totalCompletionTokens.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-center justify-between text-muted-foreground mb-1 text-xs">
              <span>Estimated Cost (INR)</span>
              <IndianRupee className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              ₹{summary.totalEstimatedCostInr.toFixed(2)}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              (${summary.totalEstimatedCostUsd.toFixed(4)} USD)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <div className="flex items-center justify-between text-muted-foreground mb-1 text-xs">
              <span>Total Requests</span>
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {summary.totalRequests.toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              AI executions logged
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
            <div className="flex items-center justify-between text-muted-foreground mb-1 text-xs">
              <span>Active Providers</span>
              <Cpu className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
              {Object.keys(data?.providerBreakdown || {}).length || 1}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Active engines
            </div>
          </div>
        </div>

        {/* Model Breakdown & Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
          {/* Provider/Model Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Usage & Cost by Provider / Model</h4>
            {Object.keys(data?.modelBreakdown || {}).length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No AI executions recorded yet.</p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {Object.entries(data?.modelBreakdown || {}).map(([modelKey, stats]) => (
                  <div
                    key={modelKey}
                    className="flex items-center justify-between p-2.5 rounded-md bg-muted/30 border text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="uppercase text-[10px]">
                        {modelKey.split('/')[0]}
                      </Badge>
                      <span className="font-medium font-mono">{modelKey.split('/')[1]}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{stats.tokens.toLocaleString()} tokens</span>
                      <span className="text-emerald-600 font-semibold ml-2">({formatCostINR(stats.cost)})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Logs Table */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Recent AI Activity Logs</h4>
            {(!data?.recentLogs || data.recentLogs.length === 0) ? (
              <p className="text-xs text-muted-foreground italic">No recent activity.</p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {data.recentLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-2 rounded-md border bg-card text-[11px]"
                  >
                    <div>
                      <span className="font-semibold capitalize">{log.feature.replace('_', ' ')}</span>
                      <span className="text-muted-foreground ml-2">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                        {log.provider}
                      </Badge>
                      <span className="font-mono text-muted-foreground">
                        {log.total_tokens} tokens ({formatCostINR(log.estimated_cost_usd)})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
