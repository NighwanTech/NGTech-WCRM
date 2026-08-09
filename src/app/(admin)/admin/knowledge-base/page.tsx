'use client'

import React, { useEffect, useState } from 'react'
import {
  BookOpen,
  Globe,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  FileText,
  Filter,
  Check,
} from 'lucide-react'

interface KnowledgeDocument {
  id: string
  title: string
  category: 'faq' | 'pricing' | 'feature' | 'contact' | 'onboarding'
  sourceUrl: string
  content: string
  publishStatus: 'draft' | 'published'
  checksum: string
  crawledAt: string
  updatedAt: string
}

interface CrawlDiff {
  route: string
  status: string
  message: string
}

interface QuestionGap {
  id: string
  query: string
  count: number
  status: string
}

export default function AdminKnowledgeBasePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [gaps, setGaps] = useState<QuestionGap[]>([])
  const [loading, setLoading] = useState(true)
  const [crawling, setCrawling] = useState(false)
  const [crawlDiffs, setCrawlDiffs] = useState<CrawlDiff[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'documents' | 'gaps'>('documents')

  // Edit/Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState<Partial<KnowledgeDocument> | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/knowledge-base')
      const data = await res.json()
      if (data.success) {
        setDocuments(data.documents)
        setGaps(data.gaps || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRunCrawler = async () => {
    setCrawling(true)
    try {
      const res = await fetch('/api/admin/knowledge-base/crawl', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setCrawlDiffs(data.diffs || [])
        setToast(`Auto-Crawler completed! Indexed ${data.crawledCount} pages.`)
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setCrawling(false)
      setTimeout(() => setToast(null), 4000)
    }
  }

  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDoc?.title || !editingDoc?.content) return

    try {
      const res = await fetch('/api/admin/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editingDoc.id ? 'update' : 'create',
          document: editingDoc,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setToast('Knowledge Document saved successfully!')
        setIsModalOpen(false)
        setEditingDoc(null)
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(() => setToast(null), 3000)
    }
  }

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Knowledge Document?')) return
    try {
      const res = await fetch('/api/admin/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', document: { id } }),
      })
      const data = await res.json()
      if (data.success) {
        setToast('Document deleted.')
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(() => setToast(null), 3000)
    }
  }

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCat
  })

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-sm font-semibold text-muted-foreground">Loading Knowledge Base Documents…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 text-white px-5 py-3 shadow-2xl font-semibold text-xs animate-bounce">
          <Check className="h-4 w-4" /> {toast}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl border border-border/60 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-mono font-bold uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" /> Super Admin Knowledge CMS & Crawler
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Platform Knowledge Base Store</h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Index, manage, and auto-crawl internal marketing routes to power the retrieval-first In-Dashboard Copilot and marketing AI Chatbot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingDoc({ title: '', category: 'faq', content: '', publishStatus: 'published' })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <Plus className="h-4 w-4" /> Add Document
          </button>
          <button
            onClick={handleRunCrawler}
            disabled={crawling}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${crawling ? 'animate-spin' : ''}`} />
            {crawling ? 'Crawling Pages…' : 'Run Auto-Crawler'}
          </button>
        </div>
      </div>

      {/* Crawler Diffs Banner */}
      {crawlDiffs.length > 0 && (
        <div className="p-5 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-xl space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Background Crawler Sync Diffs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {crawlDiffs.map((diff, i) => (
              <div key={i} className="p-3 rounded-2xl bg-card/80 border border-border/40 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-foreground">{diff.route}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                    {diff.status}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{diff.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl border border-border bg-card/80 max-w-xs">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'documents' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Knowledge Items ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('gaps')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'gaps' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            FAQ Gaps ({gaps.length})
          </button>
        </div>

        {/* Search & Category Filter */}
        {activeTab === 'documents' && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Knowledge Base…"
                className="w-full h-9 rounded-xl border border-border bg-background px-3 pl-9 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="pricing">Pricing</option>
              <option value="feature">Features</option>
              <option value="onboarding">Onboarding</option>
              <option value="contact">Contact & Support</option>
              <option value="faq">FAQ</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Tab View 1: Knowledge Documents */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col justify-between p-5 rounded-3xl border border-border bg-card/80 backdrop-blur-xl shadow-sm space-y-4 hover:border-emerald-500/30 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {doc.category}
                    </span>
                    <h3 className="text-base font-extrabold text-foreground group-hover:text-emerald-500 transition-colors">
                      {doc.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 uppercase shrink-0">
                    {doc.publishStatus}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 bg-muted/30 p-3 rounded-2xl border border-border/40 font-mono">
                  {doc.content}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
                <a
                  href={doc.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-500 transition-colors font-mono text-[11px]"
                >
                  <Globe className="h-3.5 w-3.5" /> Source Route <ExternalLink className="h-3 w-3" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingDoc(doc)
                      setIsModalOpen(true)
                    }}
                    className="p-1.5 rounded-xl border border-border hover:bg-muted text-foreground transition-colors"
                    title="Edit Document"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-1.5 rounded-xl border border-red-500/30 hover:bg-red-500/10 text-red-500 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Tab View 2: Unanswered Question Gaps */}
      {activeTab === 'gaps' && (
        <div className="p-6 rounded-3xl border border-border bg-card/80 backdrop-blur-xl space-y-4 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" /> Unanswered User Questions (Gap Analytics)
            </h2>
            <p className="text-xs text-muted-foreground">
              Questions asked by users in the Copilot that scored low confidence. Super Admins can publish 1-click KB answers.
            </p>
          </div>

          <div className="divide-y divide-border/40 rounded-2xl border border-border/40 overflow-hidden bg-background/50">
            {gaps.map((gap) => (
              <div key={gap.id} className="p-4 flex items-center justify-between text-xs hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <p className="font-bold text-foreground text-sm">&ldquo;{gap.query}&rdquo;</p>
                  <span className="text-[10px] text-amber-500 font-mono">Asked {gap.count} times by users</span>
                </div>

                <button
                  onClick={() => {
                    setEditingDoc({
                      title: `FAQ: ${gap.query}`,
                      category: 'faq',
                      sourceUrl: '/settings',
                      content: `To resolve "${gap.query}", go to Settings or the relevant feature module to configure your integration or export settings.`,
                      publishStatus: 'published',
                      gapId: gap.id,
                    } as any)
                    setIsModalOpen(true)
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" /> Create Answer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit / Create Document Modal */}
      {isModalOpen && editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-base font-extrabold text-foreground">
                {editingDoc.id ? 'Edit Knowledge Document' : 'Create Knowledge Document'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Document Title</label>
                <input
                  type="text"
                  required
                  value={editingDoc.title || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  placeholder="e.g. Starter Plan Pricing & Limits"
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Category</label>
                  <select
                    value={editingDoc.category || 'faq'}
                    onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value as any })}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="pricing">Pricing</option>
                    <option value="feature">Feature</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="contact">Contact & Support</option>
                    <option value="faq">FAQ</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Publish Status</label>
                  <select
                    value={editingDoc.publishStatus || 'published'}
                    onChange={(e) => setEditingDoc({ ...editingDoc, publishStatus: e.target.value as any })}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Source Route URL</label>
                <input
                  type="text"
                  value={editingDoc.sourceUrl || '/'}
                  onChange={(e) => setEditingDoc({ ...editingDoc, sourceUrl: e.target.value })}
                  placeholder="e.g. /orders or /inbox or /settings"
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs font-mono text-foreground focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">Document Content (Searchable KB)</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingDoc.title) return
                      setEditingDoc({
                        ...editingDoc,
                        content: `In AIWCRM, to resolve "${editingDoc.title.replace('FAQ: ', '')}", navigate to the corresponding feature page. You can configure automated webhooks, export data, or manage workflows directly from your user dashboard.`,
                      })
                    }}
                    className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    ⚡ Auto-Draft Content
                  </button>
                </div>
                <textarea
                  required
                  rows={5}
                  value={editingDoc.content || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                  placeholder="Enter detailed knowledge base content..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs font-mono text-foreground focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Save & Resolve Gap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
