'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Bot,
  Save,
  X,
  Filter,
  Eye,
  Settings,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FALLBACK_FEATURES_CATALOG, FeatureRecord, FeatureSectionBlock } from '@/lib/services/features-cms.service';

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState<FeatureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureRecord | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/features/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setForm((prev) => ({ ...prev, image_asset: data.assetName }));
      setMsg({ type: 'success', text: `Image "${file.name}" uploaded & selected!` });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const [form, setForm] = useState<{
    name: string;
    slug: string;
    category: string;
    status: string;
    publish_status: string;
    short_description: string;
    meta_title: string;
    meta_description: string;
    featured_toggle: boolean;
    image_asset: string;
  }>({
    name: '',
    slug: '',
    category: 'Customer Support',
    status: 'live',
    publish_status: 'published',
    short_description: '',
    meta_title: '',
    meta_description: '',
    featured_toggle: false,
    image_asset: 'dashboard-mockup'
  });

  const categories = [
    'AI Platform',
    'Sales CRM',
    'Customer Support',
    'Marketing',
    'Automation',
    'Analytics',
    'Developer Platform',
    'Security'
  ];

  useEffect(() => {
    fetch('/api/admin/features')
      .then((res) => res.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          setFeatures(data.features);
        } else {
          setFeatures(FALLBACK_FEATURES_CATALOG);
        }
      })
      .catch((err) => console.error('Error fetching admin features:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredFeatures = features.filter((f) => {
    const matchQuery =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || f.category === selectedCategory;
    return matchQuery && matchCat;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    let updatedSections: FeatureSectionBlock[] = editingFeature ? [...editingFeature.sections_config] : [
      {
        id: 'sec_hero_' + Date.now(),
        type: 'hero',
        enabled: true,
        order: 1,
        content: {
          title: form.name,
          subheadline: form.short_description,
          cta_primary: 'Start 7-Day Free Trial',
          cta_primary_url: `/free-trial?feature=${form.slug}`,
          image_asset: form.image_asset
        }
      },
      {
        id: 'sec_cta_' + Date.now(),
        type: 'cta',
        enabled: true,
        order: 2,
        content: {
          title: `Start Using ${form.name} Today`,
          button_text: 'Claim Your 7-Day Free Trial →',
          button_url: `/free-trial?feature=${form.slug}`
        }
      }
    ];

    if (editingFeature && updatedSections.length > 0 && updatedSections[0].type === 'hero') {
      updatedSections[0] = {
        ...updatedSections[0],
        content: {
          ...updatedSections[0].content,
          image_asset: form.image_asset
        }
      };
    }

    const payload = {
      id: editingFeature ? editingFeature.id : undefined,
      ...form,
      sections_config: updatedSections
    };

    try {
      const res = await fetch('/api/admin/features', {
        method: editingFeature ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save feature');
      }

      setMsg({ type: 'success', text: `Feature "${form.name}" saved successfully!` });
      setShowModal(false);

      // Refresh list
      if (editingFeature) {
        setFeatures((prev) =>
          prev.map((f) =>
            f.id === editingFeature.id
              ? ({
                  ...f,
                  ...form,
                  category: form.category as any,
                  status: form.status as any,
                  publish_status: form.publish_status as any
                } as FeatureRecord)
              : f
          )
        );
      } else {
        const newFeat: FeatureRecord = data.feature || {
          id: 'feat_' + Date.now(),
          ...form,
          category: form.category as any,
          status: form.status as any,
          publish_status: form.publish_status as any,
          available_in_plans: ['Starter', 'Pro', 'Enterprise'],
          supported_industries: ['Manufacturing', 'Healthcare', 'Education'],
          sections_config: payload.sections_config
        };
        setFeatures((prev) => [...prev, newFeat]);
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  if (loading) return <div className="p-8 text-xs font-mono">Loading Feature CMS…</div>;

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Layers className="h-6 w-6 text-emerald-500" /> Super Admin Feature CMS
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage 40+ feature landing pages, dynamic section blocks, SEO metadata, plan badges, and versioning.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingFeature(null);
            setForm({
              name: '',
              slug: '',
              category: 'Customer Support',
              status: 'live',
              publish_status: 'published',
              short_description: '',
              meta_title: '',
              meta_description: '',
              featured_toggle: false,
              image_asset: 'dashboard-mockup'
            });
            setShowModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-full gap-2"
        >
          <Plus className="h-4 w-4" /> Add New Feature
        </Button>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl text-xs font-mono font-bold border ${msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
          {msg.text}
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feature name or slug..."
            className="w-full rounded-full border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Features Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feat) => (
          <div key={feat.id || feat.slug} className="p-6 rounded-3xl bg-card border border-border/80 space-y-4 shadow-md relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-extrabold uppercase border border-emerald-500/30">
                  {feat.category}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-foreground font-bold">
                  {feat.publish_status || 'published'}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-foreground">{feat.name}</h3>
              <p className="text-[11px] font-mono text-emerald-400">/features/{feat.slug}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{feat.short_description}</p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border/40">
              <Link
                href={`/features/${feat.slug}`}
                target="_blank"
                className="text-xs font-mono font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingFeature(feat);
                    setForm({
                      name: feat.name,
                      slug: feat.slug,
                      category: feat.category,
                      status: feat.status || 'live',
                      publish_status: feat.publish_status || 'published',
                      short_description: feat.short_description || '',
                      meta_title: feat.meta_title || '',
                      meta_description: feat.meta_description || '',
                      featured_toggle: feat.featured_toggle || false,
                      image_asset: feat.sections_config?.[0]?.content?.image_asset || 'dashboard-mockup'
                    });
                    setShowModal(true);
                  }}
                  className="text-xs gap-1"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-black text-foreground">
                {editingFeature ? `Edit Feature: ${editingFeature.name}` : 'Add New Feature Page'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Feature Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Shared Team Inbox" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Slug URL *</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required placeholder="shared-inbox" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Category</Label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold">Status Badge</Label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs"
                  >
                    <option value="live">Live (Active)</option>
                    <option value="beta">Beta Feature</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Short Description</Label>
                <Textarea value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} rows={2} placeholder="Feature value proposition..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">SEO Meta Title</Label>
                  <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} placeholder="WhatsApp Shared Inbox | WCRM" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Publish Status</Label>
                  <select
                    value={form.publish_status}
                    onChange={(e) => setForm({ ...form, publish_status: e.target.value })}
                    className="w-full rounded-md border border-border bg-background p-2 text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* IMAGE ASSET SELECTOR & FILE UPLOAD */}
              <div className="space-y-3 p-4 rounded-2xl bg-muted/30 border border-border/80">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Feature UI Screenshot Asset
                  </Label>

                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all shadow-sm">
                    <Upload className="h-3 w-3" /> {uploading ? 'Uploading...' : 'Upload New Screenshot'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2">
                    <select
                      value={form.image_asset}
                      onChange={(e) => setForm({ ...form, image_asset: e.target.value })}
                      className="w-full rounded-md border border-border bg-background p-2 text-xs"
                    >
                      {form.image_asset && !['inbox-mockup', 'ai-mockup', 'pipeline-mockup', 'crm-mockup', 'broadcast-mockup', 'automation-mockup', 'flow-mockup', 'dashboard-mockup'].includes(form.image_asset) && (
                        <option value={form.image_asset}>Uploaded: {form.image_asset}</option>
                      )}
                      <option value="inbox-mockup">inbox-mockup.png (Shared Team Inbox)</option>
                      <option value="ai-mockup">ai-mockup.png (BYOK Multi-LLM Engine)</option>
                      <option value="pipeline-mockup">pipeline-mockup.png (Visual Kanban Pipeline)</option>
                      <option value="crm-mockup">crm-mockup.png (Sales CRM Deals)</option>
                      <option value="broadcast-mockup">broadcast-mockup.png (Meta Broadcasts)</option>
                      <option value="automation-mockup">automation-mockup.png (No-Code Workflows)</option>
                      <option value="flow-mockup">flow-mockup.png (Customer Automation Journey)</option>
                      <option value="dashboard-mockup">dashboard-mockup.png (Central Overview Dashboard)</option>
                    </select>

                    <Input
                      value={form.image_asset}
                      onChange={(e) => setForm({ ...form, image_asset: e.target.value })}
                      placeholder="Or enter custom image path (e.g. uploads/my-image)"
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="overflow-hidden rounded-xl border border-border bg-background h-28 relative flex items-center justify-center">
                    <img
                      src={`/${form.image_asset.replace(/^\//, '').replace(/\.png$/, '')}.png`}
                      alt="Asset Preview"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/dashboard-mockup.png'; }}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs gap-2">
                  <Save className="h-4 w-4" /> Save Feature CMS
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
