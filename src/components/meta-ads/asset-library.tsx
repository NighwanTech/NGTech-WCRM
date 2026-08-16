'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, Image as ImageIcon, Video, Plus, Sparkles, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { ImageViewer } from '@/components/ui/image-viewer'
import { useRef } from 'react'

interface Asset {
  id: string
  name: string
  type: 'IMAGE' | 'VIDEO'
  public_url: string
  source: 'MANUAL_UPLOAD' | 'AI_GENERATED'
  approval_status: 'DRAFT' | 'APPROVED' | 'REJECTED'
  created_at: string
}

import { MetaAdsHeader } from './meta-ads-header'

export function AssetLibrary() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    // In a real implementation, this would fetch from /api/meta/assets
    setLoading(true)
    setTimeout(() => {
      setAssets([
        {
          id: '1',
          name: 'Hero Product Ad Banner',
          type: 'IMAGE',
          public_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
          source: 'AI_GENERATED',
          approval_status: 'APPROVED',
          created_at: new Date().toISOString()
        }
      ])
      setLoading(false)
    }, 500)
  }

  const handleGenerate = async () => {
    if (!aiPrompt) return
    setGenerating(true)
    try {
      const res = await fetch('/api/meta/ai/generate-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, type: 'image' })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to generate media')
      
      setAssets(prev => [data.asset, ...prev])
      toast.success('AI Media generated successfully!')
      setAiPrompt('')
      setIsDialogOpen(false)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      toast.success(`Asset "${file.name}" uploaded successfully!`)
      // Mock adding to list
      const newAsset = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
        public_url: URL.createObjectURL(file),
        created_at: new Date().toISOString(),
        is_ai_generated: false,
        approval_status: 'APPROVED',
        source: 'MANUAL',
      }
      setAssets([newAsset as unknown as Asset, ...assets])
    }
  }

  return (
    <div className="space-y-6">
      <MetaAdsHeader
        title="Creative Asset Library"
        description="Manage your ad creatives, brand media, and generated AI variations."
        icon={ImageIcon}
        breadcrumbs={[{ label: 'Asset Library' }]}
      />
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2 w-full justify-end">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,video/*" 
            onChange={handleFileUpload}
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Plus className="w-4 h-4 mr-2" /> Upload Manual
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow h-9 px-4 py-2 cursor-pointer">
              <Sparkles className="w-4 h-4 mr-2" /> Generate with AI
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate AI Creative</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>What do you want to generate?</Label>
                  <Input 
                    placeholder="A cinematic shot of a laptop with neon green accents..." 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Our AI will automatically enhance this prompt for the visual model.</p>
                </div>
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                  onClick={handleGenerate}
                  disabled={generating || !aiPrompt}
                >
                  {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : 'Generate Image'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {assets.map(asset => (
            <Card key={asset.id} className="overflow-hidden group">
              <div className="relative aspect-square bg-muted cursor-pointer">
                {asset.type === 'IMAGE' ? (
                  <ImageViewer src={asset.public_url} alt={asset.name}>
                    <Image src={asset.public_url} alt={asset.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </ImageViewer>
                ) : (
                  <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
                    <video 
                      src={asset.public_url} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all" 
                      muted loop playsInline 
                      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})} 
                      onMouseLeave={(e) => {
                        e.currentTarget.pause()
                        e.currentTarget.currentTime = 0
                      }} 
                    />
                    <Video className="absolute w-12 h-12 text-white/50 pointer-events-none group-hover:opacity-0 transition-opacity" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {asset.source === 'AI_GENERATED' && (
                    <Badge variant="secondary" className="bg-black/50 text-white border-none backdrop-blur-md">
                      <Sparkles className="w-3 h-3 mr-1" /> AI
                    </Badge>
                  )}
                  <Badge variant={asset.approval_status === 'APPROVED' ? 'default' : 'secondary'} className="bg-black/50 text-white border-none backdrop-blur-md">
                    {asset.approval_status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm truncate" title={asset.name}>{asset.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(asset.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
          {assets.length === 0 && (
            <div className="col-span-full p-12 text-center border rounded-lg border-dashed">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No assets found</h3>
              <p className="text-muted-foreground">Upload an image or generate one using AI.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
