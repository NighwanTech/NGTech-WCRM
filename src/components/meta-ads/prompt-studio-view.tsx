'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Copy, Plus, Star, ShieldCheck, Check, Search, Filter, BookOpen, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { MetaAdsHeader } from './meta-ads-header'

export interface MetaAdPrompt {
  id: string
  title: string
  category: 'strategy' | 'audience' | 'headline' | 'primary_text' | 'creative' | 'scaling' | 'compliance'
  promptText: string
  version: string
  isFavorite: boolean
  variables: string[]
}

const DEFAULT_PROMPTS: MetaAdPrompt[] = [
  {
    id: 'pr-1',
    title: 'High-Converting Click-to-WhatsApp Hook Generator',
    category: 'primary_text',
    promptText: 'Act as an expert direct-response copywriter. Generate 3 high-converting WhatsApp primary copy hooks for {product_name} targeting {audience_demographics}. Focus on solving {customer_pain_point} with direct CTA to message on WhatsApp for instant pricing.',
    version: 'v2.1',
    isFavorite: true,
    variables: ['product_name', 'audience_demographics', 'customer_pain_point'],
  },
  {
    id: 'pr-2',
    title: 'Lookalike Audience Demographics Extractor',
    category: 'audience',
    promptText: 'Analyze target buyers for {business_category} in {region_location}. Return exact age bounds, top 5 Meta detailed interests, behaviors, household income tiers, and lookalike source parameters.',
    version: 'v1.4',
    isFavorite: true,
    variables: ['business_category', 'region_location'],
  },
  {
    id: 'pr-3',
    title: 'Meta Ad Policy & Compliance Pre-Flight Checker',
    category: 'compliance',
    promptText: 'Review the following ad copy and headline for Meta Advertising Policy compliance regarding special ad categories ({special_category}). Identify any flaggable claims, absolute guarantees, or restricted terms and provide compliant rewrites.',
    version: 'v3.0',
    isFavorite: false,
    variables: ['special_category'],
  },
  {
    id: 'pr-4',
    title: 'CBO Campaign Budget Scaling Strategy',
    category: 'scaling',
    promptText: 'Evaluate campaign performance data where CPL is {current_cpl} INR and ROAS is {current_roas}. Generate step-by-step 20% daily budget scaling rules and audience duplication parameters without breaking Meta learning phase.',
    version: 'v1.8',
    isFavorite: true,
    variables: ['current_cpl', 'current_roas'],
  },
]

export function PromptStudioView() {
  const [prompts, setPrompts] = useState<MetaAdPrompt[]>(DEFAULT_PROMPTS)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activePrompt, setActivePrompt] = useState<MetaAdPrompt>(DEFAULT_PROMPTS[0])
  const [promptText, setPromptText] = useState(DEFAULT_PROMPTS[0].promptText)

  const toggleFavorite = (id: string) => {
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    toast.success('Prompt library updated')
  }

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Isolated Advertising Prompt copied to clipboard!')
  }

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.promptText.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCat
  })

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      <MetaAdsHeader
        title="AI Prompt Studio"
        description="Dedicated advertising prompt library, versioning, and variable injection. Completely isolated from Chatbot, WhatsApp API, and Voice AI."
        icon={Sparkles}
        breadcrumbs={[{ label: 'Prompt Studio' }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold text-xs">
              🔒 Isolated Engine
            </Badge>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-bold shadow-xs">
              <Plus className="w-4 h-4" /> Create Ad Prompt
            </Button>
          </div>
        }
      />

      {/* Main Grid: Sidebar Library vs Prompt Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt Navigation Library (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search ad intelligence prompts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 px-2.5 rounded-md border bg-background text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="primary_text">Primary Text</option>
              <option value="audience">Audience</option>
              <option value="scaling">Scaling</option>
              <option value="compliance">Compliance</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredPrompts.map((p) => (
              <Card
                key={p.id}
                onClick={() => {
                  setActivePrompt(p)
                  setPromptText(p.promptText)
                }}
                className={`cursor-pointer transition-all hover:border-primary/50 shadow-2xs ${
                  activePrompt.id === p.id ? 'border-primary bg-primary/5 shadow-xs' : 'bg-card'
                }`}
              >
                <CardContent className="p-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-xs text-foreground leading-snug line-clamp-1">{p.title}</h3>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(p.id)
                      }}
                      className="text-muted-foreground hover:text-amber-500 transition-colors"
                    >
                      <Star className={`w-3.5 h-3.5 ${p.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed font-mono">
                    {p.promptText}
                  </p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">{p.category}</span>
                    <span className="font-mono text-muted-foreground">{p.version}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Prompt Editor & Testing Sandbox (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border bg-card shadow-sm">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" /> {activePrompt.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Isolated Ad Intelligence Prompt • Version {activePrompt.version}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyPrompt(promptText)}
                  className="gap-1.5 text-xs font-bold"
                >
                  <Copy className="w-3.5 h-3.5 text-emerald-500" /> Copy Prompt
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Prompt Template & Variables</span>
                  <span className="text-[11px] font-mono text-muted-foreground">Variables: {activePrompt.variables.map(v => `{${v}}`).join(', ')}</span>
                </div>
                <Textarea
                  rows={6}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="text-xs font-mono leading-relaxed bg-muted/20"
                />
              </div>

              <div className="p-3 rounded-xl border bg-muted/40 space-y-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Isolation Architecture Guarantee
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This prompt engine executes in an isolated sandbox exclusively for Meta Ads campaign strategy, copy generation, and ad auditing. Prompts are never leaked or shared with WhatsApp bot flow builders or Voice AI agents.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
