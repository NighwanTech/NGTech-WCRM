'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Search, Sparkles, HelpCircle, ArrowRight, ShieldCheck, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export interface KBArticle {
  id: string
  title: string
  category: string
  summary: string
  readTime: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  updatedDate: string
}

const META_KB_ARTICLES: KBArticle[] = [
  {
    id: 'kb-1',
    title: 'Meta Conversions API (CAPI) & Pixel Setup Guide',
    category: 'Setup & Tracking',
    summary: 'Step-by-step instructions for enabling server-side CAPI tracking for zero data loss on iOS 14+ devices.',
    readTime: '6 min read',
    difficulty: 'Intermediate',
    updatedDate: 'August 14, 2026',
  },
  {
    id: 'kb-2',
    title: 'Click-to-WhatsApp Campaign Optimization Playbook',
    category: 'WhatsApp Campaigns',
    summary: 'How to structure CBO campaigns, set up auto-greeting ref parameters, and achieve sub-₹10 cost per WhatsApp conversation.',
    readTime: '8 min read',
    difficulty: 'Advanced',
    updatedDate: 'August 15, 2026',
  },
  {
    id: 'kb-3',
    title: 'Navigating Meta Special Ad Categories (Credit, Housing, Employment)',
    category: 'Compliance & Policy',
    summary: 'Detailed guidelines on targeting restrictions, age bounds, and zip-code rules for special ad categories.',
    readTime: '5 min read',
    difficulty: 'Beginner',
    updatedDate: 'August 10, 2026',
  },
  {
    id: 'kb-4',
    title: 'Creative Fatigue & Audience Overlap Resolution',
    category: 'Troubleshooting',
    summary: 'Diagnosing high CPMs, resetting Meta learning phases, and using dynamic creative rotation to sustain ROAS.',
    readTime: '7 min read',
    difficulty: 'Advanced',
    updatedDate: 'August 12, 2026',
  },
]

import { MetaAdsHeader } from './meta-ads-header'

export function MetaKnowledgeBaseView() {
  const [search, setSearch] = useState('')
  const [aiQuery, setAiQuery] = useState('')
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiQuery) return
    setAiLoading(true)
    setTimeout(() => {
      setAiLoading(false)
      setAiResponse(
        `Based on Meta Ads OS Documentation: To scale your Click-to-WhatsApp campaign effectively, increase campaign daily budget by 15-20% every 48 hours once learning phase completes. Ensure your WABA auto-reply flow triggers instantly on lead ref parameter.`
      )
      toast.success('AI Knowledge Assistant synthesized response!')
    }, 1000)
  }

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      <MetaAdsHeader
        title="Meta Ads Knowledge Base"
        description="Enterprise Meta Advertising guides, CAPI setups, WhatsApp ad playbooks, compliance rules, and AI Knowledge Assistant."
        icon={BookOpen}
        breadcrumbs={[{ label: 'Knowledge Base' }]}
      />

      {/* AI Assistant Banner */}
      <Card className="border bg-gradient-to-r from-primary/10 via-purple-500/10 to-background p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">AI Meta Ads Knowledge Assistant</h2>
          </div>

          <form onSubmit={handleAskAI} className="flex flex-col sm:flex-row gap-2 w-full">
            <Input
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="e.g. How do I fix high CPM on WhatsApp lead campaigns?"
              className="bg-background text-xs h-10 font-medium flex-1 min-w-0"
            />
            <Button type="submit" disabled={aiLoading || !aiQuery} className="h-10 px-5 font-bold gap-2 text-xs shrink-0">
              {aiLoading ? 'Thinking...' : 'Ask AI'}
            </Button>
          </form>

          {aiResponse && (
            <div className="p-4 rounded-xl border bg-card text-xs text-foreground leading-relaxed space-y-1 shadow-2xs">
              <span className="font-bold text-primary flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> AI Knowledge Answer:
              </span>
              <p>{aiResponse}</p>
            </div>
          )}
        </div>
      </Card>

      {/* KB Articles Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Meta Advertising Guides & Playbooks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {META_KB_ARTICLES.map((article) => (
            <Card key={article.id} className="border bg-card hover:border-primary/50 transition-all shadow-2xs">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-primary border-primary/30">
                    {article.category}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-mono">{article.readTime}</span>
                </div>

                <h4 className="font-bold text-sm text-foreground leading-snug">{article.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{article.summary}</p>

                <div className="pt-2 flex items-center justify-between border-t text-[11px]">
                  <span className="text-muted-foreground">Updated {article.updatedDate}</span>
                  <Button size="sm" variant="ghost" className="h-7 text-xs font-bold text-primary gap-1 p-0 hover:bg-transparent">
                    Read Playbook <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
