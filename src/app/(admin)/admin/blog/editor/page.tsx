'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Upload } from 'lucide-react'
import { uploadAccountMedia } from '@/lib/storage/upload-media'

function BlogEditorForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!!postId)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Uncategorized',
    author_name: 'Admin',
    cover_image_url: '',
    status: 'draft',
    seo_title: '',
    seo_description: ''
  })

  useEffect(() => {
    if (postId) {
      fetch(`/api/admin/blog`)
        .then(res => res.json())
        .then(data => {
          if (data.posts) {
            const post = data.posts.find((p: any) => p.id === postId)
            if (post) setFormData(post)
          }
        })
        .finally(() => setFetching(false))
    }
  }, [postId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Auto-generate slug from title if slug is empty
    if (name === 'title' && !formData.slug) {
      setFormData(prev => ({ 
        ...prev, 
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') 
      }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      // Reusing the existing chat-media bucket for blog images
      const { publicUrl } = await uploadAccountMedia('chat-media', file)
      setFormData(prev => ({ ...prev, cover_image_url: publicUrl }))
    } catch (err: any) {
      setError(`Upload failed: ${err.message}. Ensure 'chat-media' bucket exists and RLS allows uploads.`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, isPublishing: boolean = false) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const finalData = { ...formData, status: isPublishing ? 'published' : formData.status }
    
    try {
      const res = await fetch('/api/admin/blog', {
        method: postId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postId ? { id: postId, ...finalData } : finalData)
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save post')
      
      router.push('/admin/blog')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="p-8">Loading post data...</div>

  return (
    <form className="max-w-4xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="rounded-md p-2 hover:bg-muted text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{postId ? 'Edit Post' : 'New Post'}</h1>
            <p className="text-sm text-muted-foreground">{formData.status === 'published' ? 'This post is live.' : 'Draft mode'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {error && <span className="text-sm text-destructive">{error}</span>}
          <button 
            type="button" 
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Save className="h-4 w-4" /> Save Draft
          </button>
          <button 
            type="button" 
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Post Title</label>
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Enter an engaging title..." 
              required
              className="w-full text-2xl font-bold rounded-lg border border-border bg-card px-4 py-3 text-foreground focus:border-primary outline-none" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Content (Markdown supported)</label>
            <textarea 
              name="content" 
              value={formData.content} 
              onChange={handleChange} 
              placeholder="Write your article here..." 
              required
              className="w-full h-[500px] rounded-lg border border-border bg-card px-4 py-4 text-foreground focus:border-primary outline-none font-mono text-sm resize-none" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Excerpt</label>
            <textarea 
              name="excerpt" 
              value={formData.excerpt} 
              onChange={handleChange} 
              placeholder="A short summary for the blog card..." 
              className="w-full h-24 rounded-lg border border-border bg-card px-4 py-3 text-foreground focus:border-primary outline-none resize-none" 
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold text-foreground border-b border-border pb-2">Publishing</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">URL Slug</label>
              <input 
                name="slug" 
                value={formData.slug} 
                onChange={handleChange} 
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <input 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Author Name</label>
              <input 
                name="author_name" 
                value={formData.author_name} 
                onChange={handleChange} 
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary outline-none" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Cover Image</label>
              <div className="flex gap-2">
                <input 
                  name="cover_image_url" 
                  value={formData.cover_image_url} 
                  onChange={handleChange} 
                  placeholder="https://..."
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary outline-none" 
                />
                <label className={`flex cursor-pointer items-center justify-center rounded-md border border-border bg-muted px-3 transition-colors hover:bg-muted/80 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              {uploading && <p className="text-xs text-primary">Uploading image...</p>}
              {formData.cover_image_url && (
                <img src={formData.cover_image_url} alt="Cover Preview" className="mt-2 w-full h-24 object-cover rounded-md border border-border" />
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold text-foreground border-b border-border pb-2">SEO Meta Data</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">SEO Title</label>
              <input 
                name="seo_title" 
                value={formData.seo_title} 
                onChange={handleChange} 
                placeholder="Title for search engines"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">SEO Description</label>
              <textarea 
                name="seo_description" 
                value={formData.seo_description} 
                onChange={handleChange} 
                placeholder="Meta description..."
                className="w-full h-24 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary outline-none resize-none" 
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default function BlogEditorPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading editor...</div>}>
      <BlogEditorForm />
    </Suspense>
  )
}
