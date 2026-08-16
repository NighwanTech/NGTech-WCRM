"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Mail, Phone, Globe, FileSpreadsheet, Sparkles, Search, Send, User } from "lucide-react"

export interface InboxThread {
  id: string
  name: string
  source: 'WHATSAPP' | 'META_LEAD' | 'WEBSITE' | 'EMAIL' | 'EXCEL'
  lastMessage: string
  timestamp: string
  aiScore: number
  unread: boolean
}

/**
 * CTO Refinement #6 — Universal Omnichannel AI Inbox
 * Unifies WhatsApp, Meta Instant Forms, Website Chat, Email, and Excel leads in one conversation inbox.
 */
export function UniversalOmnichannelInbox({ threads = [] }: { threads?: InboxThread[] }) {
  const [selectedThread, setSelectedThread] = useState<InboxThread | null>(threads[0] || null)

  return (
    <Card className="border bg-card shadow-xs text-xs overflow-hidden">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
            Universal Omnichannel AI Inbox
          </CardTitle>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono text-[9px]">
          {threads.length} ACTIVE THREADS
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        {threads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x h-[400px]">
            {/* Left Thread List */}
            <div className="md:col-span-4 overflow-y-auto divide-y">
              {threads.map((th) => {
                const isSelected = selectedThread?.id === th.id
                return (
                  <button
                    key={th.id}
                    onClick={() => setSelectedThread(th)}
                    className={`w-full text-left p-3 transition-colors flex items-start gap-2.5 cursor-pointer ${
                      isSelected ? "bg-primary/10" : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {th.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-xs truncate">{th.name}</span>
                        <span className="text-[9px] text-muted-foreground font-mono">{th.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{th.lastMessage}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Right Chat Preview */}
            <div className="md:col-span-8 p-4 flex flex-col justify-between bg-card/50">
              {selectedThread ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-bold text-foreground text-xs">{selectedThread.name}</span>
                      <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
                        {selectedThread.source}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 text-foreground text-xs max-w-[80%]">
                    {selectedThread.lastMessage}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="py-12 px-4 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
            <p className="font-bold text-foreground text-xs">No Active Conversations</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Inbound messages across WhatsApp Cloud API, Meta Instant Leads, and Website Chatbots will stream here in real time.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
