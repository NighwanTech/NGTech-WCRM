"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Video, CheckCircle2, Sparkles, Clock } from "lucide-react"

/**
 * PRD v14.0 Module 4 — Meeting Workspace
 * Meeting Recording, AI Transcription, AI Summary, Action Items & Customer360 Sync.
 */
export function MeetingWorkspace() {
  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              AI Meeting Assistant & Transcription
            </CardTitle>
            <CardDescription className="text-[10px]">
              Auto-transcribes sales calls, extracts action items & syncs to Customer360
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono text-[9px]">
          RECORDING SYNCED
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-3 font-mono">
        <div className="p-3 rounded-xl border bg-card space-y-1">
          <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-primary" /> Strategy Call with Patna Real Estate Developers
          </span>
          <p className="text-[11px] text-muted-foreground">Today at 11:00 AM • Duration: 45 Mins • Attendees: Rahul Sharma, Sunil Kumar</p>
          <div className="p-2 rounded bg-muted/30 text-[10px] space-y-1">
            <p className="font-bold text-emerald-600">AI Meeting Summary:</p>
            <p className="text-foreground">Client agreed on ₹25L scope. Action items: Send formal PDF quotation with 10% instant discount by 5 PM.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
