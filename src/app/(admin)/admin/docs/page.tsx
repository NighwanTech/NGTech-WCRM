'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Sparkles,
  Layers,
  CheckCircle2,
  X,
  FileText
} from 'lucide-react';
import {
  DocCategory,
  DocArticle,
  FALLBACK_DOC_CATEGORIES,
  FALLBACK_DOC_ARTICLES
} from '@/lib/services/docs-cms.service';

export default function AdminDocsPage() {
  const [categories, setCategories] = useState<DocCategory[]>(FALLBACK_DOC_CATEGORIES);
  const [articles, setArticles] = useState<DocArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<DocArticle> | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategorySlug, setFormCategorySlug] = useState('ai-copilot');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formContentMdx, setFormContentMdx] = useState('');
  const [formVersion, setFormVersion] = useState('v1.0');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formTags, setFormTags] = useState('AI, Guide, Setup');

  useEffect(() => {
    // Generate full list for admin view
    const list: DocArticle[] = [...FALLBACK_DOC_ARTICLES];
    FALLBACK_DOC_CATEGORIES.forEach(cat => {
      const exists = list.some(a => a.category_slug === cat.slug);
      if (!exists) {
        list.push({
          id: `art_admin_${cat.slug}`,
          category_id: cat.id,
          category_slug: cat.slug,
          category_name: cat.name,
          title: `${cat.name} — Overview & Setup Guide`,
          slug: 'overview',
          description: cat.description,
          status: 'published',
          version: 'v1.0',
          author_name: 'AI WCRM Engineering',
          reading_time_minutes: 4,
          tags: [cat.name, 'Setup', 'Guide'],
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-07-30T00:00:00Z',
          content_mdx: `# ${cat.name}\n\nOverview documentation content.`
        });
      }
    });
    setArticles(list);
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormTitle('');
    setFormCategorySlug('ai-copilot');
    setFormSlug('');
    setFormDescription('');
    setFormContentMdx('# New Document Title\n\nStart typing documentation content in Markdown...');
    setFormVersion('v1.0');
    setFormStatus('published');
    setFormTags('Documentation, Guide');
    setIsModalOpen(true);
  };

  const openEditModal = (art: DocArticle) => {
    setEditingArticle(art);
    setFormTitle(art.title);
    setFormCategorySlug(art.category_slug || 'ai-copilot');
    setFormSlug(art.slug);
    setFormDescription(art.description);
    setFormContentMdx(art.content_mdx);
    setFormVersion(art.version || 'v1.0');
    setFormStatus(art.status === 'published' ? 'published' : 'draft');
    setFormTags((art.tags || []).join(', '));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = categories.find(c => c.slug === formCategorySlug);
    const newArt: DocArticle = {
      id: editingArticle?.id || `art_${Date.now()}`,
      category_id: catObj?.id || 'cat_custom',
      category_slug: formCategorySlug,
      category_name: catObj?.name || 'Custom Category',
      title: formTitle,
      slug: formSlug || formTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      description: formDescription,
      content_mdx: formContentMdx,
      status: formStatus,
      version: formVersion,
      author_name: 'Super Admin',
      reading_time_minutes: Math.ceil(formContentMdx.split(' ').length / 150),
      tags: formTags.split(',').map(t => t.trim()),
      created_at: editingArticle?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (editingArticle) {
      setArticles(articles.map(a => (a.id === editingArticle.id ? newArt : a)));
    } else {
      setArticles([newArt, ...articles]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this documentation article?')) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const filteredArticles = articles.filter(art => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.category_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategorySlug === 'all' || art.category_slug === selectedCategorySlug;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 p-6 text-foreground font-sans">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">Documentation CMS</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
              15 Categories Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground pt-1">
            Manage user manual guides, API references, BYOK setup articles, and release notes for <Link href="/docs" target="_blank" className="text-emerald-400 underline font-mono">/docs</Link>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-all"
          >
            <ExternalLink className="h-4 w-4 text-emerald-400" /> View Public Portal
          </Link>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="h-4 w-4" /> Create Article
          </button>
        </div>
      </div>

      {/* Category Overview Stats Pill Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {categories.slice(0, 10).map(cat => {
          const count = articles.filter(a => a.category_slug === cat.slug).length;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategorySlug(selectedCategorySlug === cat.slug ? 'all' : cat.slug)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer text-left space-y-1 ${
                selectedCategorySlug === cat.slug
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-foreground'
                  : 'bg-card border-border/80 text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="truncate uppercase font-bold text-emerald-400">{cat.name.split(' ')[0]}</span>
                <span className="px-1.5 py-0.5 rounded bg-muted font-bold text-foreground">{count}</span>
              </div>
              <p className="text-xs font-extrabold truncate text-foreground">{cat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/80">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, tag, or category..."
            className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategorySlug}
            onChange={e => setSelectedCategorySlug(e.target.value)}
            className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground focus:outline-none"
          >
            <option value="all">All Categories ({articles.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Management Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xl text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-mono text-[11px]">
                <th className="p-4 font-black uppercase text-foreground">ARTICLE TITLE</th>
                <th className="p-4 font-black uppercase text-foreground">CATEGORY</th>
                <th className="p-4 font-black uppercase text-foreground">VERSION</th>
                <th className="p-4 font-black uppercase text-foreground">STATUS</th>
                <th className="p-4 font-black uppercase text-foreground">LAST UPDATED</th>
                <th className="p-4 text-right font-black uppercase text-foreground">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground font-mono">
                    No documentation articles match your filters.
                  </td>
                </tr>
              ) : (
                filteredArticles.map(art => (
                  <tr key={art.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <Link
                          href={`/docs/${art.category_slug}/${art.slug}`}
                          target="_blank"
                          className="font-bold text-foreground hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                        >
                          <FileText className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{art.title}</span>
                        </Link>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{art.description}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      {art.category_name || art.category_slug}
                    </td>
                    <td className="p-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold text-[10px]">
                        {art.version || 'v1.0'}
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase ${
                        art.status === 'published' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        {art.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-muted-foreground">
                      {new Date(art.updated_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(art)}
                          className="p-2 rounded-lg bg-muted hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-400 transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id)}
                          className="p-2 rounded-lg bg-muted hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto text-left">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                {editingArticle ? 'Edit Article' : 'New Article'}
              </span>
              <h3 className="text-2xl font-black text-foreground">
                {editingArticle ? `Edit "${editingArticle.title}"` : 'Create Documentation Article'}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground font-mono">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. BYOK AI Model Vault Setup"
                    className="w-full p-3 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground font-mono">Category *</label>
                  <select
                    value={formCategorySlug}
                    onChange={e => setFormCategorySlug(e.target.value)}
                    className="w-full p-3 rounded-xl bg-background border border-border text-foreground font-bold focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground font-mono">URL Slug (auto-generated)</label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={e => setFormSlug(e.target.value)}
                    placeholder="byok-model-vault"
                    className="w-full p-3 rounded-xl bg-background border border-border text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground font-mono">Version Tag</label>
                  <input
                    type="text"
                    value={formVersion}
                    onChange={e => setFormVersion(e.target.value)}
                    placeholder="v1.0"
                    className="w-full p-3 rounded-xl bg-background border border-border text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground font-mono">Publication Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-background border border-border text-foreground font-bold"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground font-mono">Short Description / Subtitle</label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Concise overview of what this guide covers..."
                  className="w-full p-3 rounded-xl bg-background border border-border text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground font-mono">MDX Documentation Content</label>
                <textarea
                  rows={10}
                  value={formContentMdx}
                  onChange={e => setFormContentMdx(e.target.value)}
                  className="w-full p-3 rounded-xl bg-background border border-border font-mono text-xs text-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-muted-foreground font-bold hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg"
                >
                  Save & Publish Article →
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
