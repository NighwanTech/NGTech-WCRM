'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Cpu, IndianRupee, Layers, TrendingUp, DollarSign, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAIAnalyticsPage() {
  const [markupPercent, setMarkupPercent] = useState(20);
  const [exchangeRate, setExchangeRate] = useState(86.0);
  const [saving, setSaving] = useState(false);

  function handleSaveSettings() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Super Admin AI Markup settings saved!');
    }, 600);
  }

  // Mock cross-tenant data
  const mockStats = {
    totalTokens: 1425000,
    rawCostUsd: 4.85,
    rawCostInr: 417.1,
    markupRevenueInr: 500.52,
    activeAccounts: 8,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Cpu className="h-6 w-6 text-primary" />
            Super Admin AI Platform Analytics & Reseller Margin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform-wide AI token consumption, API costs in INR (₹), and reseller markup controls.
          </p>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Platform Token Consumption</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono">
            {mockStats.totalTokens.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground">Across all client accounts</p>
        </div>

        <div className="p-4 rounded-xl bg-card border space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Raw Provider Expense (INR)</span>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            ₹{mockStats.rawCostInr.toFixed(2)}
          </div>
          <p className="text-[11px] text-muted-foreground">(${mockStats.rawCostUsd.toFixed(2)} USD @ ₹86)</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Billed Revenue (with +{markupPercent}% Markup)</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ₹{mockStats.markupRevenueInr.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-600/80 font-medium">
            Profit: +₹{(mockStats.markupRevenueInr - mockStats.rawCostInr).toFixed(2)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Active AI Tenant Accounts</span>
            <Cpu className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
            {mockStats.activeAccounts}
          </div>
          <p className="text-[11px] text-muted-foreground">Accounts using AI features</p>
        </div>
      </div>

      {/* Super Admin Markup Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Token Reseller Monetization & Exchange Rate</CardTitle>
          <CardDescription>
            Configure profit markup margins and USD-to-INR exchange conversion rate for system AI keys.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-semibold text-sm">Reseller Markup Margin (%)</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="20"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(parseFloat(e.target.value) || 0)}
                  className="pr-8 font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Added to raw AI token cost when billing client accounts using system default keys.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-sm">USD to INR Exchange Rate (₹)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
                <Input
                  type="number"
                  placeholder="86.00"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 86)}
                  className="pl-8 font-mono"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Standard currency conversion multiplier (1 USD = ₹{exchangeRate} INR).
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveSettings} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              Save Monetization Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
