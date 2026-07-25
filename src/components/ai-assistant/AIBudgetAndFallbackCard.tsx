import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IndianRupee, ShieldAlert, Zap, Layers, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  config: any;
  onChange: (field: string, value: any, category?: string) => void;
}

export function AIBudgetAndFallbackCard({ config, onChange }: Props) {
  const budgetInr = config.monthly_budget_inr || 2500;
  const currentMonthSpendInr = config.current_month_spend_inr || 0;
  const spendPercent = Math.min(100, Math.round((currentMonthSpendInr / budgetInr) * 100));

  return (
    <Card className="mt-6 border-amber-500/20 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-amber-500" />
              Monthly Budget Limits (INR ₹) & Auto-Failover
            </CardTitle>
            <CardDescription>
              Set monthly spending caps in Indian Rupees (₹) and configure secondary backup AI engines.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="enable-budget-cap" className="text-xs font-medium">Enable Budget Protection</Label>
            <Switch
              id="enable-budget-cap"
              checked={config.enable_budget_cap ?? true}
              onCheckedChange={(v) => onChange('enable_budget_cap', v)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Monthly Budget Setting & Progress Bar */}
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-semibold text-sm">Monthly AI Spend Limit (₹ INR)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
                <Input
                  type="number"
                  placeholder="e.g. 2500"
                  value={config.monthly_budget_inr || 2500}
                  onChange={(e) => onChange('monthly_budget_inr', parseFloat(e.target.value) || 0)}
                  className="pl-8 font-mono"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Prevents unexpected OpenAI / AI billing spikes when viral traffic occurs.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-sm">Action When 100% Budget Reached</Label>
              <Select
                value={config.budget_action || 'handoff'}
                onValueChange={(v) => onChange('budget_action', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="handoff">Transfer Chat to Human Agent (Recommended)</SelectItem>
                  <SelectItem value="pause">Pause AI Auto-Reply</SelectItem>
                  <SelectItem value="system_fallback">Switch to Free System Fallback</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Spend Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Month-to-Date Spend Progress</span>
              <span className={spendPercent >= 90 ? 'text-rose-500 font-bold' : spendPercent >= 80 ? 'text-amber-500' : 'text-emerald-500'}>
                ₹{currentMonthSpendInr.toFixed(2)} / ₹{budgetInr.toLocaleString()} ({spendPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  spendPercent >= 90
                    ? 'bg-rose-500'
                    : spendPercent >= 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${spendPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Auto-Failover Provider (Zero-Downtime Backup) */}
        <div className="pt-4 border-t space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <div>
                <Label className="font-semibold text-base">Secondary AI Provider (Auto-Failover)</Label>
                <p className="text-xs text-muted-foreground">
                  Backup AI engine used automatically if Primary Provider hits rate limits (429) or timeouts.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="enable-auto-fallback" className="text-xs font-medium">Enable Failover</Label>
              <Switch
                id="enable-auto-fallback"
                checked={config.enable_auto_fallback ?? true}
                onCheckedChange={(v) => onChange('enable_auto_fallback', v)}
              />
            </div>
          </div>

          {config.enable_auto_fallback !== false && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-lg bg-muted/40 border">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Backup Provider</Label>
                <Select
                  value={config.fallback_provider || 'gemini'}
                  onValueChange={(v) => onChange('fallback_provider', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fallback provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Google Gemini (Ultra Reliable)</SelectItem>
                    <SelectItem value="groq">Groq (Ultra-Fast Backup)</SelectItem>
                    <SelectItem value="openai">OpenAI (GPT-4o Mini)</SelectItem>
                    <SelectItem value="claude">Anthropic Claude</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Backup Model</Label>
                <Select
                  value={config.fallback_model || 'gemini-1.5-flash'}
                  onValueChange={(v) => onChange('fallback_model', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fallback model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Fast & Low Cost)</SelectItem>
                    <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B Instant (Groq)</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
