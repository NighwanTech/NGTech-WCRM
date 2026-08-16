"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Play, MessageSquare, Clock, User, ArrowDown } from "lucide-react"

/**
 * PRD v12.0 Module 3 — Universal Workflow Builder
 * Visual drag & drop automation builder executing via ToolRouter and Event Bus.
 */
export function WorkflowBuilder() {
  const nodes = [
    { title: "Trigger: Meta Lead Created", type: "TRIGGER", icon: Play },
    { title: "Action: Run AI Lead Qualification (90+ Score)", type: "AI", icon: GitBranch },
    { title: "Action: Send Automated WhatsApp Greeting", type: "ACTION", icon: MessageSquare },
    { title: "Wait: 15 Minutes for Customer Reply", type: "WAIT", icon: Clock },
    { title: "Action: Assign to Patna Enterprise Sales Desk", type: "ASSIGN", icon: User }
  ]

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
            Universal Workflow & Automation Builder
          </CardTitle>
          <CardDescription className="text-[10px]">
            Visual event-driven automation canvas executing via Event Bus & ToolRouter
          </CardDescription>
        </div>
        <Badge className="bg-primary text-primary-foreground font-mono font-bold text-[10px]">
          WORKFLOW ACTIVE
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-2 flex flex-col items-center">
        {nodes.map((node, idx) => {
          const Icon = node.icon
          return (
            <div key={node.title} className="flex flex-col items-center w-full max-w-md">
              <div className="w-full p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-foreground text-xs">{node.title}</span>
                  <p className="text-[10px] font-mono text-muted-foreground">Node Type: {node.type}</p>
                </div>
              </div>
              {idx < nodes.length - 1 && <ArrowDown className="w-4 h-4 text-muted-foreground my-1" />}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
