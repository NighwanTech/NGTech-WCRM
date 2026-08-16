"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Rocket, Cpu, Sliders, Clock, ShoppingBag, Activity, ShieldAlert, Layers, Sparkles, Check
} from "lucide-react"

// Automation Module Imports
import { WorkflowBuilder } from "@/components/automation/workflow-builder"
import { AISkillMarketplace } from "@/components/ai/skill-marketplace"
import { JobScheduler } from "@/components/system/job-scheduler"
import { WorkflowMarketplace } from "@/components/automation/workflow-marketplace"
import { AgentStudio } from "@/components/ai/agent-studio"

/**
 * PRD v15.0 Module 1 — Enterprise Automation Hub
 * Single control center for all automation: Workflows, AI Agents, Rules, Scheduler, Marketplace & Execution Logs.
 */
export function AutomationHub() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'WORKFLOWS' | 'AGENTS' | 'SCHEDULER' | 'MARKETPLACE'>('DASHBOARD')

  return (
    <Card className="border bg-card shadow-xs text-xs">
      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Enterprise Automation Hub (EAP Control Center)
            </CardTitle>
            <CardDescription className="text-[10px]">
              Unified control plane for Workflows, AI Agents, Rules Engine & Background Job Scheduler
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-mono font-bold text-[10px]">
          ALL AUTOMATION WORKERS ONLINE
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Hub Sub-Tabs Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1.5 rounded-xl border text-xs font-bold">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'DASHBOARD' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:bg-muted/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Dashboard & Telemetry
          </button>
          <button
            onClick={() => setActiveTab('WORKFLOWS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'WORKFLOWS' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:bg-muted/60'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" /> Workflow Designer
          </button>
          <button
            onClick={() => setActiveTab('AGENTS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'AGENTS' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:bg-muted/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" /> AI Agent Studio
          </button>
          <button
            onClick={() => setActiveTab('SCHEDULER')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'SCHEDULER' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:bg-muted/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Job Scheduler
          </button>
          <button
            onClick={() => setActiveTab('MARKETPLACE')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'MARKETPLACE' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:bg-muted/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-purple-400" /> Workflow Marketplace
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Active Workflows</span>
                <p className="text-base font-extrabold text-foreground">14 Active</p>
              </div>
              <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">AI Employee Agents</span>
                <p className="text-base font-extrabold text-emerald-600">6 Deployed</p>
              </div>
              <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Scheduled Jobs</span>
                <p className="text-base font-extrabold text-primary">28 Scheduled</p>
              </div>
              <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Success Rate</span>
                <p className="text-base font-extrabold text-foreground">99.98%</p>
              </div>
            </div>
            <WorkflowBuilder />
          </div>
        )}

        {activeTab === 'WORKFLOWS' && <WorkflowBuilder />}
        {activeTab === 'AGENTS' && <AgentStudio />}
        {activeTab === 'SCHEDULER' && <JobScheduler />}
        {activeTab === 'MARKETPLACE' && <WorkflowMarketplace />}
      </CardContent>
    </Card>
  )
}
