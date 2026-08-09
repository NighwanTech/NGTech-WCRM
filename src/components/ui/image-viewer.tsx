'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'

interface ImageViewerProps {
  src: string
  alt?: string
  className?: string
  children: React.ReactNode
}

export function ImageViewer({ src, alt = 'Image', className, children }: ImageViewerProps) {
  const [open, setOpen] = useState(false)

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `download-${Date.now()}.jpg` // Or extract filename if possible
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`cursor-zoom-in relative group block w-full h-full border-none p-0 bg-transparent ${className || ''}`} onClick={(e) => e.stopPropagation()}>
        {children}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <Download className="text-white w-6 h-6" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-5xl bg-black/95 border-none p-0 overflow-hidden shadow-2xl flex flex-col items-center justify-center h-[90vh]">
        <DialogTitle className="sr-only">View Image</DialogTitle>
        <div className="absolute top-4 right-4 flex gap-2 z-50">
          <Button variant="secondary" size="icon" onClick={handleDownload} title="Download Image">
            <Download className="w-5 h-5" />
          </Button>
          <Button variant="secondary" size="icon" onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="w-full h-full p-4 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={src} 
            alt={alt} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
