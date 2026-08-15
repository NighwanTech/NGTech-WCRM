'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Palette, Sparkles, Image as ImageIcon, Video, Layers, Wand2, Download, Copy, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import { MetaAdsHeader } from './meta-ads-header'

export function CreativeStudioView() {
  const [creativeType, setCreativeType] = useState<'poster' | 'video' | 'carousel'>('poster')
  const [prompt, setPrompt] = useState('High converting SaaS product banner with dark glassmorphic UI overlay, metallic cyan accents, and Send WhatsApp CTA badge.')
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string>('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80')

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      toast.success('AI Banner Graphic generated!')
    }, 1500)
  }

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      <MetaAdsHeader
        title="Creative Studio"
        description="AI Poster & Video Generation, Brand Kit Manager, Auto Background Removal, and Creative Performance History."
        icon={Palette}
        breadcrumbs={[{ label: 'Creative Studio' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Creative Form (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-primary" /> AI Graphic & Video Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Creative Format</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={creativeType === 'poster' ? 'default' : 'outline'}
                    onClick={() => setCreativeType('poster')}
                    className="text-xs font-bold gap-1.5 h-9"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Poster Graphic
                  </Button>
                  <Button
                    type="button"
                    variant={creativeType === 'video' ? 'default' : 'outline'}
                    onClick={() => setCreativeType('video')}
                    className="text-xs font-bold gap-1.5 h-9"
                  >
                    <Video className="w-3.5 h-3.5" /> Video Reel
                  </Button>
                  <Button
                    type="button"
                    variant={creativeType === 'carousel' ? 'default' : 'outline'}
                    onClick={() => setCreativeType('carousel')}
                    className="text-xs font-bold gap-1.5 h-9"
                  >
                    <Layers className="w-3.5 h-3.5" /> Carousel Cards
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">AI Creative Prompt</label>
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="text-xs font-medium h-10"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 gap-2 shadow-md"
              >
                {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Creative Banner with AI
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preview Banner (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="border bg-card shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold">Creative Preview & Brand Kit</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="w-full h-64 rounded-xl overflow-hidden bg-muted border relative">
                <img src={generatedImage} alt="AI Banner Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.success('Creative Asset saved to workspace library!')} className="text-xs font-bold">
                  Save to Asset Library
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
