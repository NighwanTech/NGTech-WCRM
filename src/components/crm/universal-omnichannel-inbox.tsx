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
const DEFAULT_THREADS: InboxThread[] = [
  {
    id: "th_1",
    name: "Rahul Sharma",
    source: "WHATSAPP",
    lastMessage: "Please send verified pricing brochure for Patna property.",
    timestamp: "09:17 AM",
    aiScore: 96,
    unread: true
  },
  {
    id: "th_2",
    name: "Priya Singh",
    source: "META_LEAD",
    lastMessage: "Inquired via Hospital Consultation Instant Form",
    timestamp: "Yesterday",
    aiScore: 91,
    unread: false
  },
  {
    id: "th_3",
    name: "Amit Kumar",
    source: "WEBSITE",
    lastMessage: "Website Chatbot: Looking for bulk cleaning supplies.",
    timestamp: "2 days ago",
    aiScore: 84,
    unread: false
  }
]

export function UniversalOmnichannelInbox({ threads }: { threads?: InboxThread[] }) {
  const displayThreads = threads && threads.length > 0 ? threads : DEFAULT_THREADS
  const [selectedThread, setSelectedThread] = useState<InboxThread>(displayThreads[0])

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
          {displayThreads.length} ACTIVE THREADS
        </Badge>
      </CardHeader>

      <CardContent className="p-0 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x min-h-[380px]">
        {/* Left Thread List */}
        <div className="md:col-span-4 p-2 space-y-1 bg-muted/10 overflow-y-auto">
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full h-8 pl-8 pr-3 rounded-lg border bg-background text-xs"
            />
          </div>

          {displayThreads.map(th => {
            const isSelected = th.id === selectedThread.id
            return (
              <button
                key={th.id}
                onClick={() => setSelectedThread(th)}
                className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer space-y-1 ${
                  isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/40 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground truncate">{th.name}</span>
                  <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
                    {th.source}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1">{th.lastMessage}</p>
                <div className="flex items-center justify-between text-[9px] text-muted-foreground font-mono">
                  <span>Score: {th.aiScore}/100</span>
                  <span>{th.timestamp}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Active Conversation Area */}
        <div className="md:col-span-8 p-4 flex flex-col justify-between space-y-4 bg-card/50">
          <div className="border-b pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {selectedThread.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-foreground text-xs">{selectedThread.name}</p>
                <p className="text-[10px] text-muted-foreground">Channel: {selectedThread.source} • AI Score: {selectedThread.aiScore}/100</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold gap-1">
              <Sparkles className="w-3 h-3 text-primary" /> AI Suggest Reply
            </Button>
          </div>

          <div className="space-y-2 text-[11px] flex-1">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 max-w-sm">
              <span className="font-bold text-primary">AI Sales Assistant:</span>
              <p className="text-foreground mt-0.5">Namaste {selectedThread.name} 👋 Thank you for inquiring. How can I assist your requirement today?</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border max-w-sm ml-auto text-right">
              <span className="font-bold text-foreground">{selectedThread.name}:</span>
              <p className="text-foreground mt-0.5">{selectedThread.lastMessage}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <input
              type="text"
              placeholder="Type message or click AI Suggest Reply..."
              className="flex-1 h-8 px-3 rounded-lg border bg-background text-xs"
            />
            <Button size="sm" className="h-8 font-bold bg-primary text-primary-foreground gap-1">
              <Send className="w-3.5 h-3.5" /> Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
