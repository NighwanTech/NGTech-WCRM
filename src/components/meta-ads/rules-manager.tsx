"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Loader2, Trash2, Zap } from "lucide-react"

export function RulesManager() {
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [name, setName] = useState("")
  const [metric, setMetric] = useState("cpl")
  const [operator, setOperator] = useState("greater_than")
  const [conditionValue, setConditionValue] = useState("")
  const [action, setAction] = useState("pause_campaign")
  const [actionValue, setActionValue] = useState("")

  const fetchRules = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/meta/rules")
      const data = await res.json()
      if (data.success) {
        setRules(data.rules || [])
      }
    } catch (err) {
      console.error("Failed to fetch rules:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRules()
  }, [])

  const handleAddRule = async () => {
    if (!name || !conditionValue) return
    setSaving(true)

    try {
      const res = await fetch("/api/meta/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          is_active: true,
          condition_metric: metric,
          condition_operator: operator,
          condition_value: Number(conditionValue),
          action_type: action,
          action_value: actionValue ? Number(actionValue) : 0,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setRules([data.rule, ...rules])
        setName("")
        setConditionValue("")
        setActionValue("")
      }
    } catch (err) {
      console.error("Failed to add rule:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRule = async (id: string) => {
    try {
      await fetch(`/api/meta/rules?id=${id}`, { method: "DELETE" })
      setRules(rules.filter(r => r.id !== id))
    } catch (err) {
      console.error("Failed to delete rule:", err)
    }
  }

  return (
    <Card className="border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" /> Autonomous Optimization Rules
        </CardTitle>
        <CardDescription>
          Create rules to automatically pause campaigns or adjust budgets based on live performance metrics.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-muted/30 p-4 rounded-lg border items-end">
          <div className="col-span-2">
            <Label>Rule Name</Label>
            <Input placeholder="e.g. Pause High CPL" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>If Metric</Label>
            <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={metric} onChange={e => setMetric(e.target.value)}>
              <option value="cpl">CPL</option>
              <option value="ctr">CTR</option>
              <option value="spend">Spend</option>
            </select>
          </div>
          <div>
            <Label>Is</Label>
            <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={operator} onChange={e => setOperator(e.target.value)}>
              <option value="greater_than">&gt;</option>
              <option value="less_than">&lt;</option>
            </select>
          </div>
          <div>
            <Label>Value</Label>
            <Input type="number" placeholder="Value" value={conditionValue} onChange={(e) => setConditionValue(e.target.value)} />
          </div>
          <div>
            <Label>Then</Label>
            <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={action} onChange={e => setAction(e.target.value)}>
              <option value="pause_campaign">Pause</option>
              <option value="increase_budget">Increase Budget %</option>
              <option value="decrease_budget">Decrease Budget %</option>
            </select>
          </div>
        </div>

        {(action === "increase_budget" || action === "decrease_budget") && (
          <div className="w-1/3">
             <Label>Action Value (%)</Label>
             <Input type="number" placeholder="20" value={actionValue} onChange={(e) => setActionValue(e.target.value)} />
          </div>
        )}

        <Button onClick={handleAddRule} disabled={saving || !name || !conditionValue} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Rule
        </Button>

        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mx-auto" />
        ) : rules.length > 0 ? (
          <div className="space-y-2 mt-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex justify-between items-center p-3 border rounded-lg bg-card">
                <div>
                  <div className="font-semibold">{rule.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    If {rule.condition_metric} {rule.condition_operator === 'greater_than' ? '>' : '<'} {rule.condition_value}, then {rule.action_type.replace('_', ' ')} {rule.action_value > 0 ? `by ${rule.action_value}%` : ''}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-4">No active rules configured.</div>
        )}
      </CardContent>
    </Card>
  )
}
