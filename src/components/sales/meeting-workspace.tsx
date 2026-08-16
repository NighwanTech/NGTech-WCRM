"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Video, CheckCircle2, Sparkles, Clock } from "lucide-react"

/**
 * PRD v14.0 Module 4 — Meeting Workspace
 * Meeting Recording, AI Transcription, AI Summary, Action Items & Customer360 Sync.
 */
export function MeetingWorkspace({ meetings = [] }: { meetings?: any[] }) {
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
          {meetings.length} RECORDINGS
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-3 font-mono">
        {meetings.length > 0 ? (
          meetings.map((m, idx) => (
            <div key={idx} className="p-3 rounded-xl border bg-card space-y-1">
              <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-primary" /> {m.title}
              </span>
              <p className="text-[11px] text-muted-foreground">{m.time} • Duration: {m.duration} • Attendees: {m.attendees}</p>
              <div className="p-2 rounded bg-muted/30 text-[10px] space-y-1">
                <p className="font-bold text-emerald-600">AI Meeting Summary:</p>
                <p className="text-foreground">{m.summary}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 px-4 text-center border rounded-xl bg-muted/10 space-y-1.5">
            <Video className="w-5 h-5 text-muted-foreground mx-auto opacity-60" />
            <p className="font-bold text-foreground text-xs">No Recorded Meetings</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Connect Zoom, Google Meet, or Retell Voice AI to automatically transcribe sales meetings and extract action items.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
