import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { IndianRupee, Zap, Calendar, AlertTriangle } from 'lucide-react';

interface Props {
  config: any;
  onChange: (field: string, value: any, category?: string) => void;
}

export function AIBudgetAndFallbackCard({ config, onChange }: Props) {
  const budgetInr = config.monthly_budget_inr || 2500;
  const currentMonthSpendInr = config.current_month_spend_inr || 0;
  const triggerPercent = config.budget_alert_threshold_percent || 90;
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
              Set monthly spending caps in Indian Rupees (₹), alert thresholds, budget reset dates, and backup AI engines.
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
        {/* Monthly Budget Settings Grid */}
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* 1. Monthly Budget Limit */}
            <div className="space-y-2">
              <Label className="font-semibold text-xs">Monthly AI Spend Limit (₹ INR)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
                <Input
                  type="number"
                  placeholder="e.g. 2500"
                  value={config.monthly_budget_inr || 2500}
                  onChange={(e) => onChange('monthly_budget_inr', parseFloat(e.target.value) || 0)}
                  className="pl-8 font-mono text-xs"
                />
              </div>
            </div>

            {/* 2. Alert & Action Threshold % */}
            <div className="space-y-2">
              <Label className="font-semibold text-xs">Trigger Action At Threshold</Label>
              <Select
                value={String(config.budget_alert_threshold_percent || 90)}
                onValueChange={(v) => { if (v) onChange('budget_alert_threshold_percent', parseInt(v)); }}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select threshold %" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">At 50% of Budget Limit</SelectItem>
                  <SelectItem value="75">At 75% of Budget Limit</SelectItem>
                  <SelectItem value="90">At 90% of Budget Limit (Recommended)</SelectItem>
                  <SelectItem value="100">At 100% of Budget Limit (Strict Cap)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Action When Threshold Reached */}
            <div className="space-y-2">
              <Label className="font-semibold text-xs">Action When Reached</Label>
              <Select
                value={config.budget_action || 'handoff'}
                onValueChange={(v) => { if (v) onChange('budget_action', v); }}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select action">
                    {config.budget_action === 'pause'
                      ? 'Pause AI Auto-Reply'
                      : config.budget_action === 'system_fallback'
                      ? 'Switch to Free System Fallback'
                      : 'Transfer Chat to Human Agent'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="handoff">Transfer Chat to Human Agent</SelectItem>
                  <SelectItem value="pause">Pause AI Auto-Reply</SelectItem>
                  <SelectItem value="system_fallback">Switch to Free System Fallback</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Monthly Reset Day */}
            <div className="space-y-2">
              <Label className="font-semibold text-xs flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Monthly Reset Day
              </Label>
              <Select
                value={String(config.budget_reset_day || 1)}
                onValueChange={(v) => { if (v) onChange('budget_reset_day', parseInt(v)); }}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st of every month</SelectItem>
                  <SelectItem value="5">5th of every month</SelectItem>
                  <SelectItem value="10">10th of every month</SelectItem>
                  <SelectItem value="15">15th of every month</SelectItem>
                  <SelectItem value="25">25th of every month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Spend Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Month-to-Date Spend Progress</span>
              <span className={spendPercent >= triggerPercent ? 'text-rose-500 font-bold' : spendPercent >= (triggerPercent - 15) ? 'text-amber-500' : 'text-emerald-500'}>
                ₹{currentMonthSpendInr.toFixed(2)} / ₹{budgetInr.toLocaleString()} ({spendPercent}% spent — Action triggers at {triggerPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  spendPercent >= triggerPercent
                    ? 'bg-rose-500'
                    : spendPercent >= (triggerPercent - 15)
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
                  onValueChange={(v) => { if (v) onChange('fallback_provider', v); }}
                >
                  <SelectTrigger className="text-xs">
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
                  onValueChange={(v) => { if (v) onChange('fallback_model', v); }}
                >
                  <SelectTrigger className="text-xs">
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
