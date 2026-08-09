"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Plus, ArrowRight, RefreshCw, Loader2 } from "lucide-react"

interface Mapping {
  id?: string
  form_id: string
  form_name: string
  target_pipeline_id?: string
  target_stage_id?: string
}

export function LeadFormMapper() {
  const [formId, setFormId] = useState("")
  const [formName, setFormName] = useState("")
  const [pipelineId, setPipelineId] = useState("")
  const [stageId, setStageId] = useState("")
  const [mappings, setMappings] = useState<Mapping[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchMappings = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/meta/lead-forms")
      const data = await res.json()
      if (data.success) {
        setMappings(data.mappings || [])
      }
    } catch (err) {
      console.error("Failed to fetch lead form mappings:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMappings()
  }, [])

  const handleAddMapping = async () => {
    if (!formId || !formName) return
    setSaving(true)

    try {
      const res = await fetch("/api/meta/lead-forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId,
          formName,
          fieldMapping: { fullName: "full_name", phone: "phone_number", email: "email" },
          targetPipelineId: pipelineId || null,
          targetStageId: stageId || null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setMappings((prev) => [data.mapping, ...prev.filter(m => m.form_id !== formId)])
        setFormId("")
        setFormName("")
        setPipelineId("")
        setStageId("")
      }
    } catch (err) {
      console.error("Failed to add mapping:", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">Facebook Lead Form to Pipeline Mapper</CardTitle>
          <CardDescription>
            Automatically map incoming Facebook/Instagram Lead Forms to target CRM Pipelines and Stages.
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={fetchMappings} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg border">
          <div>
            <Label htmlFor="formId">Meta Form ID</Label>
            <Input
              id="formId"
              placeholder="e.g. 102938475610293"
              value={formId}
              onChange={(e) => setFormId(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="formName">Form Display Name</Label>
            <Input
              id="formName"
              placeholder="e.g. Summer Promo Lead Form"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddMapping} disabled={saving || !formId || !formName} className="w-full gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Save Mapping
            </Button>
          </div>
        </div>

        {mappings.length > 0 ? (
          <div className="space-y-3 mt-6">
            <h4 className="font-semibold text-sm text-foreground">Active Form Mappings</h4>
            {mappings.map((m, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border bg-card text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">{m.form_name}</span>
                  <span className="text-xs font-mono text-muted-foreground">({m.form_id})</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <div className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                  {m.target_pipeline_id ? `Pipeline: ${m.target_pipeline_id}` : 'Default CRM Inbox'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <div className="text-sm text-muted-foreground py-4 text-center">No active form mappings found.</div>
        )}
      </CardContent>
    </Card>
  )
}
